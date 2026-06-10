/* ===================================================
   tinyVue 1.0 — Reactive Frontend Framework
   Zero dependencies · Vue 3 syntax · Solid.js performance
   =================================================== */
(function () {

/* ===================================================
   CONFIG
   =================================================== */
const SLIM_DEBUG = false;         // toggle devtools logging
const ROUTER_MODE = 'hash';       // 'hash' or 'history'
const APP_ROOT = '#app';          // mount selector

/* ===================================================
   MODULE 1 — REACTIVE SYSTEM
   =================================================== */
const _reactiveTargets = new WeakMap();
const _effectStack = [];
const _subscribers = new Map();
const _computedCache = new WeakMap();
let _batchQueued = false;
const _batchQueue = new Set();
const _lifecycleHooks = new Map();

function _getSubs(key) {
  if (!_subscribers.has(key)) _subscribers.set(key, new Set());
  return _subscribers.get(key);
}

function _track(key) {
  if (_effectStack.length > 0) {
    _getSubs(key).add(_effectStack[_effectStack.length - 1]);
  }
}

function _trigger(key) {
  const subs = _getSubs(key);
  for (const sub of subs) {
    _batchQueue.add(sub);
  }
  if (!_batchQueued) {
    _batchQueued = true;
    Promise.resolve().then(_flushBatch);
  }
}

function _flushBatch() {
  _batchQueued = false;
  const seen = new Set();
  for (const sub of _batchQueue) {
    if (seen.has(sub)) continue;
    seen.add(sub);
    try { sub(); } catch (e) { console.error('tinyVue batch error:', e); }
  }
  _batchQueue.clear();
}

function ref(initial) {
  let _v = initial;
  const k = Symbol('ref');
  return {
    get value() { _track(k); return _v; },
    set value(v) {
      if (!Object.is(_v, v)) {
        _v = v;
        _trigger(k);
      }
    },
    _isRef: true
  };
}

function reactive(obj) {
  if (_reactiveTargets.has(obj)) return _reactiveTargets.get(obj);
  const handlers = {
    get(target, prop, receiver) {
      const k = Symbol('reactive:' + String(prop));
      _track(k);
      const val = Reflect.get(target, prop, receiver);
      if (val !== null && typeof val === 'object' && !val._isRef && !Array.isArray(val)) {
        if (!_reactiveTargets.has(val)) _reactiveTargets.set(val, reactive(val));
        return _reactiveTargets.get(val);
      }
      return val;
    },
    set(target, prop, value, receiver) {
      const k = Symbol('reactive:' + String(prop));
      const old = Reflect.get(target, prop, receiver);
      if (!Object.is(old, value)) {
        Reflect.set(target, prop, value, receiver);
        _trigger(k);
      }
      return true;
    },
    deleteProperty(target, prop) {
      const k = Symbol('reactive:' + String(prop));
      if (Reflect.has(target, prop)) {
        Reflect.deleteProperty(target, prop);
        _trigger(k);
      }
      return true;
    }
  };
  const proxy = new Proxy(obj, handlers);
  _reactiveTargets.set(obj, proxy);
  return proxy;
}

function computed(fn) {
  let _v, _dirty = true;
  const _ref = ref(undefined);
  const _runner = () => {
    _effectStack.push(_runner);
    try {
      const nv = fn();
      if (!Object.is(nv, _v)) { _v = nv; _ref.value = _v; }
    } finally {
      _effectStack.pop();
    }
    _dirty = false;
  };
  _runner._isComputed = true;
  _runner();
  return {
    get value() { if (_dirty) _runner(); return _ref.value; },
    _isRef: true
  };
}

function watch(src, cb, opts) {
  let oldVal;
  const immediate = opts?.immediate || false;
  const deep = opts?.deep || false;
  const getter = typeof src === 'function' ? src : () => src;
  const _runner = () => {
    const nv = getter();
    if (!Object.is(nv, oldVal) || deep) {
      cb(nv, oldVal);
      oldVal = nv;
    }
  };
  _effectStack.push(_runner);
  try { oldVal = getter(); } finally { _effectStack.pop(); }
  if (immediate) cb(oldVal, undefined);
  return () => {
    const k = Symbol('reactive:watch');
    _getSubs(k).delete(_runner);
  };
}

function effect(fn) {
  const _runner = () => {
    _effectStack.push(_runner);
    try { fn(); } finally { _effectStack.pop(); }
  };
  _runner();
  return () => {
    const keys = [..._subscribers.keys()];
    for (const k of keys) _getSubs(k).delete(_runner);
  };
}

function untrack(fn) {
  const stackLen = _effectStack.length;
  try { return fn(); } finally { _effectStack.length = stackLen; }
}

function nextTick(fn) {
  return fn ? Promise.resolve().then(fn) : Promise.resolve();
}

/* Lifecycle registries */
function onMounted(fn) { _pushHook('mounted', fn); }
function onUnmounted(fn) { _pushHook('unmounted', fn); }
function onUpdated(fn) { _pushHook('updated', fn); }
function onErrorCaptured(fn) { _pushHook('errorCaptured', fn); }
function onBeforeRouteLeave(fn) { _pushHook('beforeRouteLeave', fn); }

function _pushHook(name, fn) {
  const idx = _effectStack.length > 0 ? _effectStack[_effectStack.length - 1] : null;
  const key = idx || 'global';
  if (!_lifecycleHooks.has(key)) _lifecycleHooks.set(key, { mounted: [], unmounted: [], updated: [], errorCaptured: [], beforeRouteLeave: [] });
  const hooks = _lifecycleHooks.get(key);
  hooks[name].push(fn);
}

function _getCurrentHooks() {
  const idx = _effectStack.length > 0 ? _effectStack[_effectStack.length - 1] : null;
  const key = idx || 'global';
  return _lifecycleHooks.get(key) || { mounted: [], unmounted: [], updated: [], errorCaptured: [], beforeRouteLeave: [] };
}

/* ===================================================
   MODULE 2 — EXPRESSION EVALUATOR
   =================================================== */
const _exprCache = new Map();

function _compileExpr(expr) {
  if (_exprCache.has(expr)) return _exprCache.get(expr);
  try {
    const fn = new Function('$data', '$router', 'with($data||{}){try{return (' + expr + ')}catch(e){return undefined}}');
    _exprCache.set(expr, fn);
    return fn;
  } catch (e) {
    const fn = () => undefined;
    _exprCache.set(expr, fn);
    return fn;
  }
}

function _evalExpr(expr, ctx) {
  if (expr == null || expr === '') return '';
  const fn = _compileExpr(expr);
  try { return fn(ctx, ctx.$router || null); } catch (e) { return undefined; }
}

/* ===================================================
   MODULE 3 — TEMPLATE COMPILER
   =================================================== */
function _compileTemplate(templateStr, ctx) {
  if (SLIM_DEBUG) console.log('[tinyVue] compileTemplate start, len:', templateStr.length, 'name:', ctx._def?.name);
  const subs = [];
  const temp = document.createElement('div');
  temp.innerHTML = templateStr.trim();
  const root = temp.firstElementChild || temp.firstChild;
  if (!root) return { root: document.createTextNode(''), subs };
  
  _compileIter = 0;
  _walkNode(root, ctx, subs);
  if (SLIM_DEBUG) console.log('[tinyVue] compileTemplate done, subs:', subs.length);
  return { root, subs };
}

let _compileIter = 0;

function _walkNode(node, ctx, subs) {
  _compileIter++;
  if (_compileIter > 100000) { console.error('[tinyVue] compile iteration limit exceeded'); return; }
  if (node.nodeType === 3) { // text node
    _processTextNode(node, ctx, subs);
    return;
  }
  if (node.nodeType !== 1) return;
  
  const el = node;
  const attrsToRemove = [];
  
  // Process directives
  for (let i = el.attributes.length - 1; i >= 0; i--) {
    const attr = el.attributes[i];
    const name = attr.name;
    const val = attr.value;
    
    if (name === 'v-if' || name === 'v-show') {
      attrsToRemove.push(attr);
      const anchor = document.createComment('tiny-v-if');
      el.parentNode && el.parentNode.insertBefore(anchor, el);
      const sub = _createIfSub(el, anchor, val, ctx, subs, name === 'v-show');
      subs.push(sub);
      el.parentNode && el.parentNode.removeChild(el);
      return;
    }
    
    if (name === 'v-else' || name === 'v-else-if') {
      attrsToRemove.push(attr);
      el.style.display = 'none';
      return;
    }
    
    if (name === 'v-for') {
      attrsToRemove.push(attr);
      _processForDirective(el, val, ctx, subs);
      return;
    }
    
    if (name === 'v-model') {
      attrsToRemove.push(attr);
      _processModelDirective(el, val, ctx, subs);
    }
    
    if (name === 'v-html') {
      attrsToRemove.push(attr);
      const sub = _createHtmlSub(el, val, ctx);
      subs.push(sub);
    }
    
    if (name === 'v-text') {
      attrsToRemove.push(attr);
      const sub = _createTextContSub(el, val, ctx);
      subs.push(sub);
    }
    
    if (name.startsWith(':')) {
      attrsToRemove.push(attr);
      const bindName = name.slice(1);
      _processBindDirective(el, bindName, val, ctx, subs);
    }
    
    if (name.startsWith('@')) {
      attrsToRemove.push(attr);
      _processEventDirective(el, name, val, ctx);
    }
    
    if (name === 'data-transition') {
      attrsToRemove.push(attr);
    }
  }
  
  // Remove processed attrs
  for (const a of attrsToRemove) {
    el.removeAttribute(a.name);
  }
  
  // Process remaining template expressions in string attributes
  for (let i = 0; i < el.attributes.length; i++) {
    const attr = el.attributes[i];
    if (attr.value.includes('${')) {
      const sub = _createAttrExprSub(el, attr.name, attr.value, ctx);
      subs.push(sub);
    }
  }
  
  // Process children
  for (let i = el.childNodes.length - 1; i >= 0; i--) {
    _walkNode(el.childNodes[i], ctx, subs);
  }
}

function _processTextNode(node, ctx, subs) {
  const text = node.textContent;
  if (!text.includes('{{') && !text.includes('${')) return;
  
  // Replace {{ expr }} with ${expr}
  const processed = text.replace(/\{\{\s*(.*?)\s*\}\}/g, '${$1}');
  if (processed === text) return;
  
  // Parse into static parts and expressions
  const parts = [];
  let lastIdx = 0;
  const re = /\$\{(.*?)\}/g;
  let match;
  while ((match = re.exec(processed)) !== null) {
    if (match.index > lastIdx) parts.push({ type: 'static', value: processed.slice(lastIdx, match.index) });
    parts.push({ type: 'expr', value: match[1] });
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < processed.length) parts.push({ type: 'static', value: processed.slice(lastIdx) });
  
  if (parts.length === 1 && parts[0].type === 'expr') {
    const sub = _createTextSub(node, parts[0].value, ctx);
    subs.push(sub);
  } else {
    const parent = node.parentNode;
    const fragment = document.createDocumentFragment();
    const exprNodes = [];
    for (const p of parts) {
      if (p.type === 'static') {
        fragment.appendChild(document.createTextNode(p.value));
      } else {
        const tn = document.createTextNode('');
        fragment.appendChild(tn);
        exprNodes.push({ node: tn, expr: p.value });
      }
    }
    parent.replaceChild(fragment, node);
    for (const en of exprNodes) {
      const sub = _createTextSub(en.node, en.expr, ctx);
      subs.push(sub);
    }
  }
}

/* ===================================================
   MODULE 4 — SUBSCRIPTION ENGINE
   =================================================== */
function _createTextSub(node, expr, ctx) {
  const fn = _compileExpr(expr);
  let current = '';
  const update = () => {
    try {
      const nv = String(fn(ctx, ctx.$router || null) ?? '');
      if (nv !== current) { node.data = nv; current = nv; }
    } catch (e) { /* silent */ }
  };
  _effectStack.push(update);
  try { update(); } finally { _effectStack.pop(); }
  return update;
}

function _createTextContSub(el, expr, ctx) {
  const fn = _compileExpr(expr);
  let current = '';
  const update = () => {
    try {
      const nv = String(fn(ctx, ctx.$router || null) ?? '');
      if (nv !== current) { el.textContent = nv; current = nv; }
    } catch (e) { /* silent */ }
  };
  _effectStack.push(update);
  try { update(); } finally { _effectStack.pop(); }
  return update;
}

function _createHtmlSub(el, expr, ctx) {
  const fn = _compileExpr(expr);
  let current = '';
  const update = () => {
    try {
      const nv = String(fn(ctx, ctx.$router || null) ?? '');
      if (nv !== current) { el.innerHTML = nv; current = nv; }
    } catch (e) { /* silent */ }
  };
  _effectStack.push(update);
  try { update(); } finally { _effectStack.pop(); }
  return update;
}

function _createAttrExprSub(el, attrName, template, ctx) {
  const parts = [];
  let lastIdx = 0;
  const re = /\$\{(.*?)\}/g;
  let match;
  while ((match = re.exec(template)) !== null) {
    if (match.index > lastIdx) parts.push({ type: 'static', value: template.slice(lastIdx, match.index) });
    parts.push({ type: 'expr', value: match[1] });
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < template.length) parts.push({ type: 'static', value: template.slice(lastIdx) });
  
  if (parts.length === 1 && parts[0].type === 'expr') {
    const fn = _compileExpr(parts[0].value);
    let current = '';
    const update = () => {
      try {
        const nv = String(fn(ctx, ctx.$router || null) ?? '');
        if (nv !== current) {
          if (nv === '' || nv === 'false' || nv === 'undefined') el.removeAttribute(attrName);
          else el.setAttribute(attrName, nv);
          current = nv;
        }
      } catch (e) { /* silent */ }
    };
    _effectStack.push(update);
    try { update(); } finally { _effectStack.pop(); }
    return update;
  }
  
  // Mixed static + dynamic
  const fns = parts.map(p => p.type === 'expr' ? _compileExpr(p.value) : null);
  let current = '';
  const update = () => {
    try {
      let result = '';
      for (let i = 0; i < parts.length; i++) {
        if (parts[i].type === 'static') result += parts[i].value;
        else result += String(fns[i](ctx, ctx.$router || null) ?? '');
      }
      if (result !== current) {
        if (result === '' || result === 'false' || result === 'undefined') el.removeAttribute(attrName);
        else el.setAttribute(attrName, result);
        current = result;
      }
    } catch (e) { /* silent */ }
  };
  _effectStack.push(update);
  try { update(); } finally { _effectStack.pop(); }
  return update;
}

function _createIfSub(el, anchor, expr, ctx, subs, isShow) {
  const fn = _compileExpr(expr);
  let shown = false;
  const parent = el.parentNode;
  
  const update = () => {
    try {
      const cond = !!fn(ctx, ctx.$router || null);
      if (isShow) {
        el.style.display = cond ? '' : 'none';
        return;
      }
      if (cond && !shown) {
        anchor.parentNode && anchor.parentNode.insertBefore(el, anchor.nextSibling);
        // Re-process children now that el is in DOM
        for (let i = 0; i < el.childNodes.length; i++) {
          _walkNode(el.childNodes[i], ctx, subs);
        }
        shown = true;
      } else if (!cond && shown) {
        el.parentNode && el.parentNode.removeChild(el);
        shown = false;
      }
    } catch (e) { /* silent */ }
  };
  
  _effectStack.push(update);
  try { update(); } finally { _effectStack.pop(); }
  return update;
}

function _processForDirective(el, expr, ctx, subs) {
  const match = expr.match(/^\s*[{(]\s*(\w+)\s*(?:,\s*(\w+))?\s*[})]\s+in\s+(.+)$/) || expr.match(/^\s*(\w+)\s+in\s+(.+)$/);
  if (!match) return;
  const itemName = match[1];
  const indexName = match[2] !== undefined && match[3] !== undefined ? match[2] : undefined;
  const arrExpr = match[3] || match[2];
  const fn = _compileExpr(arrExpr);
  const parent = el.parentNode;
  const anchor = document.createComment('tiny-for');
  parent.insertBefore(anchor, el);
  parent.removeChild(el);
  
  let items = [];
  let itemNodes = new Map();
  
  const update = () => {
    try {
      const raw = fn(ctx, ctx.$router || null);
      const newItems = Array.isArray(raw) ? raw : (raw ? Object.values(raw) : []);
      
      // Simple keyed diff
      const newItemNodes = new Map();
      const frag = document.createDocumentFragment();
      
      for (let i = 0; i < newItems.length; i++) {
        const item = newItems[i];
        const key = item && item._key !== undefined ? item._key : i;
        
        if (itemNodes.has(key)) {
          const existing = itemNodes.get(key);
          newItemNodes.set(key, existing);
          frag.appendChild(existing.clone);
        } else {
          const clone = el.cloneNode(true);
          const forCtx = Object.create(ctx);
          forCtx[itemName] = item;
          if (indexName) forCtx[indexName] = i;
          for (let j = 0; j < clone.childNodes.length; j++) {
            _walkNode(clone.childNodes[j], forCtx, subs);
          }
          newItemNodes.set(key, { clone, item });
          frag.appendChild(clone);
        }
      }
      
      anchor.parentNode && anchor.parentNode.insertBefore(frag, anchor.nextSibling);
      items = newItems;
      itemNodes = newItemNodes;
    } catch (e) { /* silent */ }
  };
  
  _effectStack.push(update);
  try { update(); } finally { _effectStack.pop(); }
  subs.push(update);
}

function _processModelDirective(el, expr, ctx, subs) {
  if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
    const fn = _compileExpr(expr);
    const updateView = () => {
      try {
        const v = fn(ctx, ctx.$router || null);
        if (v !== undefined && v !== null) {
          if (el.type === 'checkbox') el.checked = !!v;
          else el.value = v;
        }
      } catch (e) { /* silent */ }
    };
    _effectStack.push(updateView);
    try { updateView(); } finally { _effectStack.pop(); }
    
    el.addEventListener('input', () => {
      // set the value on the context
      const parts = expr.split('.');
      let target = ctx;
      for (let i = 0; i < parts.length - 1; i++) {
        target = target[parts[i]];
        if (!target) break;
      }
      if (target) {
        const lastKey = parts[parts.length - 1];
        if (el.type === 'checkbox') target[lastKey] = el.checked;
        else if (el.type === 'number' || el.dataset.number !== undefined) target[lastKey] = parseFloat(el.value) || el.value;
        else target[lastKey] = el.value;
      }
    });
  } else if (el.tagName === 'SELECT') {
    // similar to input
    const fn = _compileExpr(expr);
    const updateView = () => {
      try {
        const v = fn(ctx, ctx.$router || null);
        if (v !== undefined && v !== null) el.value = v;
      } catch (e) { /* silent */ }
    };
    _effectStack.push(updateView);
    try { updateView(); } finally { _effectStack.pop(); }
    
    el.addEventListener('change', () => {
      const parts = expr.split('.');
      let target = ctx;
      for (let i = 0; i < parts.length - 1; i++) {
        target = target[parts[i]];
        if (!target) break;
      }
      if (target) target[parts[parts.length - 1]] = el.value;
    });
  }
}

function _processBindDirective(el, bindName, val, ctx, subs) {
  if (bindName === 'class') {
    const fn = _compileExpr(val);
    let current = '';
    const update = () => {
      try {
        const result = fn(ctx, ctx.$router || null);
        let className = '';
        if (typeof result === 'string') className = result;
        else if (Array.isArray(result)) className = result.filter(Boolean).join(' ');
        else if (typeof result === 'object') {
          for (const k in result) {
            if (result[k] && result.hasOwnProperty(k)) className += (className ? ' ' : '') + k;
          }
        }
        if (className !== current) {
          if (bindName === 'class') el.className = className;
          else el.setAttribute(bindName, className);
          current = className;
        }
      } catch (e) { /* silent */ }
    };
    _effectStack.push(update);
    try { update(); } finally { _effectStack.pop(); }
    subs.push(update);
  } else if (bindName === 'style') {
    const fn = _compileExpr(val);
    let current = '';
    const update = () => {
      try {
        const result = fn(ctx, ctx.$router || null);
        if (typeof result === 'string') {
          el.style.cssText = result;
        } else if (result && typeof result === 'object') {
          for (const k in result) {
            if (result.hasOwnProperty(k)) {
              el.style[k] = result[k];
            }
          }
        }
      } catch (e) { /* silent */ }
    };
    _effectStack.push(update);
    try { update(); } finally { _effectStack.pop(); }
    subs.push(update);
  } else if (bindName === 'key') {
    // handled by v-for
  } else {
    const fn = _compileExpr(val);
    let current = '';
    const update = () => {
      try {
        const nv = String(fn(ctx, ctx.$router || null) ?? '');
        if (nv !== current) {
          if (bindName === 'disabled' || bindName === 'checked' || bindName === 'selected') {
            if (fn(ctx, ctx.$router || null)) el.setAttribute(bindName, '');
            else el.removeAttribute(bindName);
          } else {
            el.setAttribute(bindName, nv);
          }
          current = nv;
        }
      } catch (e) { /* silent */ }
    };
    _effectStack.push(update);
    try { update(); } finally { _effectStack.pop(); }
    subs.push(update);
  }
}

function _processEventDirective(el, attrName, val, ctx) {
  let eventType = attrName.slice(1);
  let useCapture = false;
  let keyModifier = null;
  let preventDefault = false;
  let stopPropagation = false;
  
  // Parse modifiers
  const parts = eventType.split('.');
  eventType = parts[0];
  for (let i = 1; i < parts.length; i++) {
    const mod = parts[i];
    if (mod === 'prevent') preventDefault = true;
    else if (mod === 'stop') stopPropagation = true;
    else if (mod === 'capture') useCapture = true;
    else if (mod === 'self') { /* handled in handler */ }
    else if (['enter', 'tab', 'delete', 'esc', 'space', 'up', 'down', 'left', 'right'].includes(mod)) keyModifier = mod;
  }
  
  let methodName = val;
  if (val.endsWith('()')) methodName = val.slice(0, -2).trim();
  
  const handler = function(e) {
    if (keyModifier) {
      const keyMap = { enter: 13, tab: 9, delete: 46, esc: 27, space: 32, up: 38, down: 40, left: 37, right: 39 };
      if (keyMap[keyModifier] !== e.keyCode && e.key !== keyModifier) return;
    }
    if (preventDefault) e.preventDefault();
    if (stopPropagation) e.stopPropagation();
    const fn = ctx[methodName];
    if (typeof fn === 'function') fn.call(ctx, e);
  };
  
  el.addEventListener(eventType, handler, useCapture);
}

/* ===================================================
   MODULE 5 — COMPONENT ENGINE
   =================================================== */
let _componentIdCounter = 0;

function defineComponent(def) {
  return def;
}

function _createComponentInstance(compDef, extraProps) {
  const id = ++_componentIdCounter;
  const instance = {
    _id: id,
    _def: compDef,
    _subs: [],
    _mounted: false,
    _el: null,
    _unmounters: []
  };
  
  // Initialize data
  const dataObj = typeof compDef.data === 'function' ? compDef.data() : {};
  for (const k in dataObj) instance[k] = dataObj[k];
  
  // Add router if available
  if (window.__router) instance.$router = window.__router;
  instance.$route = _routeState;
  instance.$root = instance;
  
  // Initialize computed
  if (compDef.computed) {
    for (const k in compDef.computed) {
      const fn = typeof compDef.computed[k] === 'function' ? compDef.computed[k] : compDef.computed[k].get;
      Object.defineProperty(instance, k, {
        get() { return computed(fn.bind(instance)).value; },
        enumerable: true
      });
    }
  }
  
  // Run setup() if provided (Composition API)
  if (compDef.setup) {
    const setupResult = compDef.setup.call(instance, {});
    if (setupResult && typeof setupResult === 'object') {
      for (const k in setupResult) {
        const val = setupResult[k];
        if (val && val._isRef) {
          Object.defineProperty(instance, k, {
            get() { return val.value; },
            set(v) { val.value = v; },
            enumerable: true
          });
        } else {
          instance[k] = val;
        }
      }
    }
  }
  
  // Merge methods
  if (compDef.methods) {
    for (const k in compDef.methods) {
      instance[k] = compDef.methods[k].bind(instance);
    }
  }
  
  // Template
  instance._template = compDef.template || '';
  
  // Lifecycle hooks
  if (compDef.mounted) instance._onMounted = compDef.mounted.bind(instance);
  if (compDef.unmounted) instance._onUnmounted = compDef.unmounted.bind(instance);
  if (compDef.updated) instance._onUpdated = compDef.updated.bind(instance);
  if (compDef.errorCaptured) instance._onErrorCaptured = compDef.errorCaptured.bind(instance);
  if (compDef.beforeRouteLeave) instance._onBeforeRouteLeave = compDef.beforeRouteLeave.bind(instance);
  
  return instance;
}

function _mountInstance(instance, container) {
  // Compile template
  const { root, subs } = _compileTemplate(instance._template, instance);
  instance._subs = subs;
  
  // Replace container content
  container.innerHTML = '';
  container.appendChild(root);
  
  // Store ref
  instance._el = root;
  instance._mounted = true;
  
  // Run mounted
  if (instance._onMounted) instance._onMounted();
  
  if (SLIM_DEBUG) console.log('[tinyVue] Mounted:', instance._def.name || 'Anonymous', instance._id, '-', subs.length, 'subscriptions');
}

function _unmountInstance(instance) {
  if (instance._onUnmounted) instance._onUnmounted();
  // Clean up subscriptions (they reference DOM that's being removed)
  instance._subs = [];
  instance._mounted = false;
  if (SLIM_DEBUG) console.log('[tinyVue] Unmounted:', instance._def.name || 'Anonymous', instance._id);
}

/* ===================================================
   MODULE 6 — ROUTER
   =================================================== */
const _routeState = reactive({ path: '', params: {}, meta: {} });

function createRouter(config) {
  const mode = config.mode || 'hash';
  const routes = config.routes || [];
  const scrollBehavior = config.scrollBehavior || ((to) => ({ top: 0 }));
  
  let currentPath = '';
  let currentRoute = null;
  let currentParams = {};
  let currentMeta = {};
  let componentInstances = {};
  let container = null;
  let beforeEachHooks = [];
  let afterEachHooks = [];
  
  const router = {
    path: '',
    params: {},
    meta: {},
    _routes: routes,
    
    use(fn) { return this; },
    
    beforeEach(fn) {
      beforeEachHooks.push(fn);
      return this;
    },
    
    afterEach(fn) {
      afterEachHooks.push(fn);
      return this;
    },
    
    push(path) {
      navigateTo(path);
    },
    
    replace(path) {
      navigateTo(path, true);
    },
    
    _matchRoute(path) {
      for (const route of routes) {
        const routePath = route.path;
        if (routePath === path) {
          return { route, params: {}, meta: route.meta || {} };
        }
        // Match /:param patterns
        const routeParts = routePath.split('/');
        const pathParts = path.split('/');
        if (routeParts.length === pathParts.length) {
          const params = {};
          let match = true;
          for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) {
              params[routeParts[i].slice(1)] = pathParts[i];
            } else if (routeParts[i] !== pathParts[i]) {
              match = false;
              break;
            }
          }
          if (match) return { route, params, meta: route.meta || {} };
        }
      }
      // Check for catch-all redirect
      for (const route of routes) {
        if (route.path === '/:pathMatch(.*)*' || route.path === '*') {
          return { route, params: { pathMatch: path.slice(1) }, meta: route.meta || {} };
        }
      }
      return null;
    },
    
    init(el) {
      container = el;
      if (mode === 'hash') {
        window.addEventListener('hashchange', handleHashChange);
        if (!window.location.hash) {
          window.location.hash = '#/';
        } else {
          handleHashChange();
        }
      } else {
        // History mode
        window.addEventListener('popstate', handlePopState);
        navigateTo(window.location.pathname, true);
      }
    },
    
    destroy() {
      if (mode === 'hash') window.removeEventListener('hashchange', handleHashChange);
      else window.removeEventListener('popstate', handlePopState);
    }
  };
  
  window.__router = router;
  
  function handleHashChange() {
    const hash = window.location.hash.slice(1) || '/';
    navigateTo(hash);
  }
  
  function handlePopState() {
    navigateTo(window.location.pathname, true);
  }
  
  function navigateTo(path, replace) {
    let targetPath = path;
    if (mode === 'hash') {
      targetPath = path.startsWith('/') ? path : '/' + path;
    }
    
    const match = router._matchRoute(targetPath);
    if (!match) {
      console.warn('[tinyVue] No route matched:', targetPath);
      return;
    }
    
    const from = { path: currentPath, route: currentRoute, params: currentParams, meta: currentMeta };
    const to = { path: targetPath, route: match.route, params: match.params, meta: match.meta };
    
    // Run beforeEach hooks (async support via simple sequential)
    let cancelled = false;
    for (const hook of beforeEachHooks) {
      const result = hook(to, from);
      if (result === false) { cancelled = true; break; }
    }
    if (cancelled) return;
    
    // BeforeRouteLeave on current component
    if (componentInstances[currentPath] && componentInstances[currentPath]._onBeforeRouteLeave) {
      const result = componentInstances[currentPath]._onBeforeRouteLeave(to, from);
      if (result === false) return;
    }
    
    // Update URL
    if (mode === 'hash') {
      if (replace) {
        window.location.hash = '#/' + targetPath.slice(1);
      } else {
        // Only change if different
        if ('#' + targetPath !== window.location.hash) {
          window.location.hash = '#' + targetPath;
        }
      }
    } else {
      if (replace) window.history.replaceState({}, '', targetPath);
      else window.history.pushState({}, '', targetPath);
    }
    
    // Unmount current component
    if (componentInstances[currentPath]) {
      _unmountInstance(componentInstances[currentPath]);
      delete componentInstances[currentPath];
    }
    
    // Update state
    currentPath = targetPath;
    currentRoute = match.route;
    currentParams = match.params;
    currentMeta = match.meta;
    router.path = currentPath;
    router.params = currentParams;
    router.meta = currentMeta;
    _routeState.path = currentPath;
    _routeState.params = {...currentParams};
    _routeState.meta = {...currentMeta};
    
    // Update document title
    if (match.meta && match.meta.title) {
      document.title = match.meta.title + ' — Md. Asaduzzaman (Aminur)';
    }
    
    // Mount new component
    const route = match.route;
    if (route.redirect) {
      navigateTo(route.redirect);
      return;
    }
    
    if (route.component) {
      const instance = _createComponentInstance(route.component);
      // Pass params as props if route.props is true
      if (route.props && match.params) {
        for (const k in match.params) {
          instance[k] = match.params[k];
        }
      }
      componentInstances[currentPath] = instance;
      _mountInstance(instance, container);
    }
    
    // Scroll behavior
    const scroll = scrollBehavior(to, from, null);
    if (scroll) {
      if (scroll.behavior === 'smooth') window.scrollTo({ top: scroll.top || 0, behavior: 'smooth' });
      else window.scrollTo({ top: scroll.top || 0 });
    }
    
    // AfterEach hooks
    for (const hook of afterEachHooks) {
      hook(to, from);
    }
    
    // Update active nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === '#' + targetPath || href === targetPath) {
        link.classList.add('nav-link-active');
      } else {
        link.classList.remove('nav-link-active');
      }
    });
    
    if (SLIM_DEBUG) console.log('[tinyVue] Route:', currentPath, match.params);
  }
  
  return router;
}

/* ===================================================
   MODULE 7 — TRANSITIONS (CSS class-based)
   =================================================== */
function _applyTransition(el, name, action, done) {
  if (!name || !el) { if (done) done(); return; }
  const prefix = name;
  
  if (action === 'enter') {
    el.classList.add(prefix + '-enter');
    requestAnimationFrame(() => {
      el.classList.remove(prefix + '-enter');
      el.classList.add(prefix + '-enter-active');
      const onEnd = () => {
        el.classList.remove(prefix + '-enter-active');
        if (done) done();
      };
      const dur = _getTransitionDuration(el);
      if (dur > 0) setTimeout(onEnd, dur + 50);
      else requestAnimationFrame(onEnd);
    });
  } else if (action === 'leave') {
    el.classList.add(prefix + '-leave');
    requestAnimationFrame(() => {
      el.classList.remove(prefix + '-leave');
      el.classList.add(prefix + '-leave-active');
      const onEnd = () => {
        el.classList.remove(prefix + '-leave-active');
        if (done) done();
      };
      const dur = _getTransitionDuration(el);
      if (dur > 0) setTimeout(onEnd, dur + 50);
      else requestAnimationFrame(onEnd);
    });
  } else {
    if (done) done();
  }
}

function _getTransitionDuration(el) {
  const style = window.getComputedStyle(el);
  const dur = parseFloat(style.transitionDuration) || 0;
  const delay = parseFloat(style.transitionDelay) || 0;
  return (dur + delay) * 1000;
}

/* ===================================================
   MODULE 8 — APP BOOTSTRAP
   =================================================== */
function createApp(rootComponent) {
  const app = {
    _root: rootComponent,
    _router: null,
    
    use(router) {
      this._router = router;
      return this;
    },
    
    mount(selector) {
      const el = document.querySelector(selector);
      if (!el) { console.error('[tinyVue] Mount target not found:', selector); return; }
      
      // Create root instance
      const instance = _createComponentInstance(this._root);
      
      // If router, pass container
      if (this._router) {
        this._router.init(el);
      } else {
        _mountInstance(instance, el);
      }
      
      return {
        unmount() {
          if (app._router) app._router.destroy();
          _unmountInstance(instance);
        }
      };
    }
  };
  
  return app;
}

/* ===================================================
   MODULE 9 — DEVTOOLS
   =================================================== */
if (SLIM_DEBUG) {
  window.__tinyVue = {
    version: '1.0',
    subscribers: _subscribers,
    batchQueue: _batchQueue,
    reactiveTargets: _reactiveTargets,
    effectStack: _effectStack,
    compiledExprCache: _exprCache
  };
  console.log('[tinyVue 1.0] DevTools active', window.__tinyVue);
}

/* ===================================================
   EXPORTS (global)
   =================================================== */
window.tinyVue = {
  ref, reactive, computed, watch, effect, untrack, nextTick,
  defineComponent,
  createRouter,
  createApp,
  onMounted, onUnmounted, onUpdated, onErrorCaptured, onBeforeRouteLeave,
  createComponentInstance: _createComponentInstance,
  mountComponent: _mountInstance,
  _compileTemplate,
  SLIM_DEBUG, ROUTER_MODE, APP_ROOT
};
})();
