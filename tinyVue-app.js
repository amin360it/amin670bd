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
  
  _walkNode(root, ctx, subs);
  if (SLIM_DEBUG) console.log('[tinyVue] compileTemplate done, subs:', subs.length);
  return { root, subs };
}

function _walkNode(node, ctx, subs) {
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

/* ===================================================
   tinyVue 1.0 — Application Data
   All data from cv.json, projects.json, multimedia.json, services.json
   Inlined as plain JS object — zero JSON fetches needed
   =================================================== */

const DATA = {
  personal: {
    name: "Md. Asaduzzaman",
    nickname: "Aminur",
    title: "IT & Digital Operations Specialist",
    phone1: "+880 1979 670601",
    phone2: "+880 1719 670601",
    email: "amin670bd@gmail.com",
    email2: "amin670job@gmail.com",
    location: "Ashuliya, Savar, Dhaka, Bangladesh",
    linkedin: "linkedin.com/in/aminur670bd",
    website: "https://amin670bd.github.io",
    photo: "assets/images/profile.webp",
    dob: "22/01/1997",
    blood: "O+",
    religion: "Islam",
    currentSalary: "21,800 BDT",
    expectedSalary: "Negotiable",
    available: "Immediately"
  },
  languages: [
    { name: "Bangla", level: "Native", pct: 100 },
    { name: "English", level: "Fluent", pct: 85 },
    { name: "Hindi", level: "Intermediate", pct: 60 }
  ],
  objective: "I offer a unique blend of creative, technical, and support-based services that span across IT support, ERP operations, digital systems, and administrative workflows. My goal is to contribute to a company's IT infrastructure with hands-on experience in system maintenance, user support, and process improvement.",
  summary: "IT professional since 2018 with 6.5+ years of hands-on employment across IT support, ERP systems, web development, and system integration. Skilled in troubleshooting, hardware/software setup, ERP data entry, and user support. Adept at managing in-house workflows, enhancing digital visibility, and ensuring smooth technical and administrative operations.",
  stats: [
    { value: "15+", label: "Sites Built" },
    { value: "60%", label: "Efficiency Boost" },
    { value: "100+", label: "Users Managed" }
  ],
  skills: [
    { title: "Office & Productivity", icon: "description", items: ["MS Office (Word, Excel, PowerPoint, Outlook)", "Google Workspace", "Excel Automation & Macros", "Report Generation", "PDF Editing"] },
    { title: "Design & Graphics", icon: "palette", items: ["Photoshop", "Illustrator", "Canva", "Infographics", "Posters / Labels", "Logos", "Invoices"] },
    { title: "Video & AI Multimedia", icon: "movie", items: ["Filmora (Video Editing)", "AI Image Manipulation & Editing", "AI Audio & Multimedia"] },
    { title: "ERP & Business Systems", icon: "storage", items: ["GPRO ERP (All Modules)", "Inventory Management", "Payroll / Billing", "Data Entry & Verification", "POS Systems", "File Handling", "ERP Install & Support", "Garments Systems", "RFID Tag Generation"] },
    { title: "E-Commerce & Marketplaces", icon: "shopping_cart", items: ["Product Listing", "Order / Shipping Handling", "Customer Support", "Bundle Tracking", "Amazon Seller Central", "eBay", "WooCommerce", "WordPress"] },
    { title: "C / C++ & .NET Stack", icon: "code", items: ["C / C++", "C# & WinForms", ".NET SDK 9/10", "ADO.NET", "Crystal Reports", ".NET Framework", "MS Access"] },
    { title: "PHP & Laravel Stack", icon: "code", items: ["Laravel", "Blade Templates", "Eloquent ORM", "Artisan CLI", "REST APIs", "MVC Architecture", "PHP & MySQL", "PDO"] },
    { title: "Frontend Stack", icon: "code", items: ["Vue 3 (Options / Composition API)", "Vue Router", "Pinia", "Vite", "HTML / CSS / JavaScript", "Tailwind / Bootstrap 4/5", "jQuery", "Responsive Design"] },
    { title: "Databases & SQL", icon: "table_chart", items: ["MySQL / phpMyAdmin", "MySQL Workbench", "SQL Server", "MS Access", "Excel VBA Macros"] },
    { title: "AI & Automation Tools", icon: "smart_toy", items: ["Prompt Engineering", "GitHub Copilot", "ChatGPT", "Opencode / OpenRouter", "Qwen AI / Gemini", "n8n Workflow Automation"] },
    { title: "Web Dev & CMS", icon: "travel_explore", items: ["WordPress", "Elementor", "WooCommerce", "LMS", "Plugin Dev", "Payment Systems", "ACF", "Custom Post Types", "REST API", "Child Themes", "SEO Plugins"] },
    { title: "IT Support & System Admin", icon: "dns", items: ["Windows / Linux OS Install", "Hard / Soft Diagnostics", "Remote IT Support", "System Maintenance", "User Training", "Driver Setup", "PC Assembly & Upgrade"] },
    { title: "System Integration & Hardware", icon: "settings_ethernet", items: ["Barcode Printer Configuration", "Automated Label Printing", "Weight Scale Integration", "NXP MCU RFID Terminals", "MOXA Serial Cards", "Network Configuration"] },
    { title: "Email & Communication", icon: "forward_to_inbox", items: ["Corporate Email Setup", "Bulk Mailing Tools", "Email Automation", "Face-to-Face Communication", "Social Media Management"] },
    { title: "Networking & Security", icon: "lan", items: ["IP Config & Subnetting", "LAN / Router Setup", "File / Printer Sharing", "Firewall & Antivirus", "IP Camera Installation", "Network Cabling", "RS-485 Cabling"] }
  ],
  experience: [
    { title: "Sr. Officer (In-Charge, Barcode)", company: "Dhaka Thai ALCOMAXX PLC", location: "Ashuliya, Savar, Dhaka", period: "Sep 2025 - Present", highlights: ["Lead barcode operations, product labeling, bundling, and production coordination across packing lines", "Developed and maintained C# desktop applications for weight scale integration with LightHouse ERP", "Troubleshot utility software, barcode printers, and IT systems across packing lines", "Improved workflow efficiency and reduced downtime through barcode system optimization", "Designed and implemented automated label printing systems increasing daily output from 2,500 to 8,000+ labels", "Coordinated with production and quality teams to ensure accurate product tracking and traceability"] },
    { title: "Officer - IT (G-Pro)", company: "Keya Cosmetic Ltd.", location: "Gazipur, Dhaka", period: "May 2022 - Jul 2025", highlights: ["Administered GPRO ERP modules including cutting, store, production, payroll, billing, and inventory management", "Configured IP settings and network cabling for 30+ production floor workstations", "Set up and maintained printer connectivity across the facility", "Installed and configured IP cameras for production floor surveillance", "Managed 30+ production lines each with 10+ NXP MCU-based RFID terminals as IoT checkpoints", "Configured and maintained MOXA multiport serial cards over RS-485 telephone-type cabling to collect data from RFID terminals into GPRO ERP", "Provided IT training and support to 30+ end-users on ERP modules and software tools", "Assisted with routine server backups and basic system maintenance", "Automated routine data entry and reporting tasks using Excel macros and ERP export tools"] },
    { title: "IT Assistant", company: "Rahamat Sweaters Ltd.", location: "Gazipur, Dhaka", period: "Jan 2022 - May 2022", highlights: ["Designed barcode and label systems for production tracking and warehouse management", "Performed ERP data entry, verification, and synchronization across multiple departments", "Provided hardware and software support for production floor workstations", "Assisted in inventory reconciliation and stock movement documentation"] },
    { title: "Web Developer", company: "Faith Media Ltd.", location: "Mohakhali, Dhaka", period: "Jan 2021 - Jul 2021", highlights: ["Developed and maintained WordPress/WooCommerce websites with custom themes and plugins", "Created SEO-optimized content, product listings, and competitive pricing strategies for e-commerce clients", "Designed infographics, promotional banners, and website visuals using Photoshop and Illustrator", "Implemented LMS and membership plugins for client educational platforms", "Optimized site performance through caching, image compression, and database optimization"] },
    { title: "Remote IT Assistant to CEO", company: "TIC Accessories Inc.", location: "New York, USA", period: "Jan 2020 - Dec 2020", highlights: ["Managed Amazon Seller Central and eBay Seller Hub — listings, pricing, inventory sync, and order processing for 200+ products", "Automated Excel reports and email marketing campaigns for sales and inventory tracking", "Provided remote IT support via AnyDesk and TeamViewer to New York office staff", "Created professional product photography and edited images for marketplace listings", "Monitored competitor pricing and adjusted listings to maintain competitive edge"] },
    { title: "ICT Teacher & IT Trainer", company: "EEE & IT Training Center", location: "Naogaon", period: "Jul 2019 - Dec 2019", highlights: ["Trained SSC and HSC students in MS Office, programming fundamentals, and hardware troubleshooting", "Developed practical IT curriculum modules with hands-on exercises for real-world skill building", "Guided students through computer assembly, OS installation, and basic networking labs", "Conducted assessments and provided one-on-one mentoring to improve student outcomes"] },
    { title: "IT Assistant", company: "ZSN Computers", location: "Naogaon", period: "Jul 2018 - Dec 2018", highlights: ["Assembled custom PCs and installed operating systems, drivers, and essential software", "Provided hardware diagnostics, repair services, and software troubleshooting for walk-in clients", "Maintained workshop inventory of components and managed customer service requests", "Performed system upgrades including RAM, storage, and graphics card installations"] }
  ],
  education: [
    { degree: "Diploma in Computer Engineering", school: "Bogura Polytechnic Institute", year: "2018", grade: "CGPA: 2.92 / 4.00", gradeValue: 2.92, gradeMax: 4, location: "Bogura", icon: "computer", skills: ["C Programming", "Python", "Java", "Web Development", "Database Management", "Computer Networking"], achievements: [{ text: "Res-Q & Remote Control — IoT-based rescue car for multi-sector demo missions | Champion at BPI Innovation & Projects Fair 2017", award: true }, { text: "B.P.I. Virtual Institute — Awarded at Zilla ICT Project Fair 2017", award: true }, { text: "Easy C IDE — Lightweight C compiler IDE with auto-save feature", award: false }, { text: "B.P.I. Innovation Lab — Hardware, software & network setup at BPI", award: false }] },
    { degree: "S.S.C. (Vocational, ICT)", school: "Naogaon Technical School & College", year: "2013", grade: "GPA: 4.88 / 5.00", gradeValue: 4.88, gradeMax: 5, location: "Naogaon", icon: "school", skills: ["Computer Application", "ICT", "Programming Basics", "Hardware Fundamentals"], achievements: [{ text: "ICT Lab Installation — PC setup & network config for Naogaon Technical School", award: false }, { text: "Practical training in MS Office, Computer Applications & Hardware", award: false }, { text: "GPA 4.88 / 5.00 — Outstanding academic performance", award: true }] }
  ],
  training: [
    { title: "Web Design & Development", topics: ["WordPress", "PHP", "MySQL", "HTML", "CSS", "JavaScript", "Bootstrap", "jQuery"], institution: "Bangladesh IT Institute, Dhaka", year: "2017", duration: "3 months", icon: "web" },
    { title: "Software Development", topics: ["Win-Forms", "C#.NET", "SQL Server"], institution: "Smart Softwares & Training Center, Bogura", year: "2016", duration: "6 months", icon: "code" },
    { title: "Graphics Design", topics: ["Photoshop", "Illustrator"], institution: "Rahim IT Solutions, Bogura", year: "2015", duration: "3 months", icon: "palette" },
    { title: "CompTIA A+", topics: ["Hardware", "Software", "IT-ICT", "MS Office"], institution: "Opurbo Computers & Training Center, Naogaon", year: "2013", duration: "6 months", icon: "settings" }
  ],
  achievementCategories: [
    { title: "Technical Impact", icon: "rocket_launch", color: "var(--primary)", items: [{ title: "YAOHUA Scale Desktop App", description: "Developed a desktop app for YAOHUA digital scale integration, reducing packing production time by 60% and tripling bundle QR label output from 2.5K to 8K+ daily." }, { title: "15+ Websites Built", description: "Developed 15+ responsive websites and e-commerce platforms using WordPress + Elementor." }, { title: "E-Commerce Listings Management", description: "Managed 200+ SEO-optimized product listings for Amazon, eBay, and WooCommerce." }] },
    { title: "Training & Leadership", icon: "school", color: "var(--accent-emerald)", items: [{ title: "ERP Module Training", description: "Administered and trained 30+ users on ERP modules including HR, Payroll, Store, Inventory." }, { title: "Student IT Education", description: "Delivered IT training to 80+ students on MS Office and system troubleshooting during session." }] },
    { title: "Awards & Recognition", icon: "emoji_events", color: "var(--accent-amber)", items: [{ title: "Res-Q — Champion", description: "BPI College Projects Fair 2017 — IoT-based rescue car for multi-sector demo missions." }, { title: "BPI Virtual Institute — Champion", description: "ICT Fair 2017, Bogura District & Rajshahi Division Level." }] }
  ],
  references: [
    { name: "Md. Mamunur Rashid", title: "Manager (IT, G-Pro)", company: "Keya Knit Composite Ltd.", phone: "01906-472201" },
    { name: "Md. Al Amin", title: "Sr. Officer (IT, G-Pro)", company: "Keya Knit Composite Ltd.", phone: "01521-447631" },
    { name: "Md. Abdur Rahim", title: "Head of Sales & Marketing", company: "Alpha.Net.Bd", phone: "01712-685203" },
    { name: "Md. Sagar Islam", title: "Production Coordinator", company: "Casual Garments Ltd.", phone: "01727-831168" },
    { name: "Md. Mamunur Rashid", title: "Manager (IT, G-Pro)", company: "Keya Knit Composite Ltd.", phone: "01906-472201" },
    { name: "Md. Al Amin", title: "Sr. Officer (IT, G-Pro)", company: "Keya Knit Composite Ltd.", phone: "01521-447631" },
    { name: "Md. Abdur Rahim", title: "Head of Sales & Marketing", company: "Alpha.Net.Bd", phone: "01712-685203" },
    { name: "Md. Sagar Islam", title: "Production Coordinator", company: "Casual Garments Ltd.", phone: "01727-831168" }
  ],
  media: {
    channelUrl: "https://www.youtube.com/@aminur670",
    channelHandle: "@aminur670",
    channelName: "Aminur670",
    channelAvatar: "https://yt3.ggpht.com/cNVM5rkUOhCpTkvrrF956fjyQB6eqlmLLP1Yt1kAiKKa64RGL9s6TUx-RjwgQOJ-jw7Bj25qHw=s88-c-k-c0x00ffffff-no-rj",
    description: "Creative content, tech projects, and more.",
    playlist: { id: "UU9ndhDLZxczY17jgLdDlx4g", title: "Channel Uploads" },
    featuredVideoId: "W3YmvF_gh8Q",
    links: [
      { title: "YouTube Channel", url: "https://www.youtube.com/@aminur670", icon: "smart_display" },
      { title: "Google Drive Portfolio", url: "#", icon: "cloud" }
    ]
  },
  menuItems: [
    { path: "/", label: "Home", icon: "home" },
    { path: "/about", label: "About", icon: "person" },
    { path: "/skills", label: "Skills", icon: "settings" },
    { path: "/experience", label: "Experience", icon: "work" },
    { path: "/education", label: "Education", icon: "school" },
    { path: "/projects", label: "Projects", icon: "folder_open" },
    { path: "/multimedia-works", label: "Multimedia Works", icon: "smart_display" },
    { path: "/achievements", label: "Achievements", icon: "emoji_events" },
    { path: "/services", label: "Services", icon: "handyman" },
    { path: "/contact", label: "Contact", icon: "email" }
  ],
  projectCategories: [
    { name: "Software Development", key: "software", icon: "laptop_mac", items: [
      { id: "weight-checker", title: "Aluminum Bundle Weight Checker V3/V4", tech: "C#.NET, Serial Port, ERP Automation", description: "Desktop application for automated bundle weight checking with serial port scale integration and ERP label printing.", date: "2026-04-01" },
      { id: "weight-scale", title: "YAOHUA Digital Weight Scale Integration", tech: "RS232, Serial Port, Hardware Integration", description: "Industrial hardware-software bridge connecting YAOHUA XK3190-D# weight indicators to LightHouse ERP.", date: "2025-02-01" },
      { id: "tuition-management", title: "Tuition Management System", tech: "C# & SQL Server Local DB", description: "Students information, fee management, batch management desktop application.", date: "2016-09-01" },
      { id: "tic-warehouse", title: "TIC Warehouse App", tech: "PHP & MySQL", description: "Basic Warehouse Inventory management software.", date: "2020-06-01" },
      { id: "auto-bell", title: "Auto Bell 2.0", tech: "VB.net & MS-AccessDB", description: "Automated bell system with Text-to-Speech for schools.", date: "2017-04-01" },
      { id: "easy-c-ide", title: "Easy C IDE", tech: "VB.net & Compiler", description: "Lightweight C IDE with auto-save feature.", date: "2016-03-01" },
      { id: "resq-remote", title: "Res-Q & Remote Control", tech: "C/C++, Arduino & C#", description: "Robotic car firmware and control desktop app. Champion at BPI College Projects Fair 2017.", date: "2017-03-01" },
      { id: "tasbih", title: "Tasbih - Digital Prayer Counter", tech: "MIT App Inventor", description: "Android app for digital tasbih (prayer bead) counting with multiple counter profiles and history tracking.", date: "2024-10-01" },
      { id: "zenbreaths", title: "ZenBreaths - Guided Breathing App", tech: "HTML, Tailwind CSS, Vue 3, Nuxt, Capacitor", description: "Meditation and guided breathing exercise app with customizable session durations and visual cues.", date: "2024-12-01" },
      { id: "dtl-google-chrome", title: "DTL - Portable Google Chrome (No CORS)", tech: "Portable Chrome, Batch Scripting, CORS Bypass", description: "Configured a portable Google Chrome browser with custom user data directory enabling no-CORS development/testing environment for internal web applications.", date: "2026-05-01" }
    ]},
    { name: "Web & E-Commerce", key: "web", icon: "language", items: [
      { id: "faith-it", title: "Faith IT - Agency Portfolio", tech: "WordPress, Elementor", description: "Agency Portfolio website for Faith Media Ltd.", date: "2020-02-01" },
      { id: "gontobbo-express", title: "Gontobbo Express", tech: "WordPress, WooCommerce", description: "Logistics platform implementation.", date: "2021-01-01" },
      { id: "chembynavid", title: "ChemByNavid", tech: "WordPress, WooCommerce, LMS", description: "Payment, LMS, Content Update integration.", date: "2021-02-15" },
      { id: "rapid-supplies", title: "Rapid Supplies Inc.", tech: "WordPress, WooCommerce", description: "Tech e-commerce for TIC Accessories.", date: "2020-07-01" },
      { id: "tic-website", title: "TIC Accessories - Main Company Website", tech: "WordPress, Elementor, WooCommerce", description: "Full WordPress company website with product catalog, service pages, and contact system for TIC Accessories Inc.", date: "2020-03-01" },
      { id: "different-cafe", title: "DifferentCafeBD", tech: "WordPress, Elementor", description: "Cafe brand website with menu, online ordering & local SEO.", date: "2021-02-20" },
      { id: "realcafe-bd", title: "RealCafeBd", tech: "WordPress, Elementor", description: "Cafe brand website with menu, online ordering & local SEO.", date: "2021-02-26" },
      { id: "cosmicshopbd", title: "CosmicShopBd", tech: "WordPress, WooCommerce, Android, Java, REST API", description: "Retail/wholesale online store with Android app.", date: "2024-09-01" },
      { id: "hakimadapp-website", title: "Hakimadapp.github.io - Religious Website", tech: "HTML, CSS, JavaScript, GitHub Pages", description: "Faith-based religious website hosted on GitHub Pages.", date: "2026-03-01" }
    ]},
    { name: "IT Support & Maintenance", key: "it", icon: "build", items: [
      { id: "dhakathai-it", title: "DhakaThai Alcomaxx PLC", tech: "IT Support, OS, Barcode ERP", description: "IT Support, OS, Barcode ERP, Maintenance, Tools Development - full IT operations for aluminum manufacturing plant.", date: "2023-08-01" },
      { id: "keya-group-it", title: "Keya Group [IT-GPRO]", tech: "GPRO ERP, IT Support, RFID", description: "IT Support, OS, ERP, Maintenance, RJ-6 MOXA Network & Devices Management - GPRO ERP administration across all modules, IT support for 30+ production floor workstations.", date: "2022-05-22" },
      { id: "tic-accessories", title: "TIC Accessories Inc. - Full-Spectrum Support", tech: "WordPress, E-Commerce, IT Support", description: "Remote IT support, WordPress website, WooCommerce e-commerce, Amazon/eBay listings, product photography, infographics, and digital operations for New-York based tech accessories company.", date: "2020-02-01" },
      { id: "bpi-lab", title: "B. P. I. Innovation Lab", tech: "Hardware, Software, Network Setup", description: "Software, hardware, and network setup for college innovation lab.", date: "2018-03-01" },
      { id: "naogaon-lab", title: "Naogaon Tech. School Lab", tech: "PC Assembly, OS Install", description: "PC software/hardware setup and ICT lab installation for technical school.", date: "2012-09-01" }
    ]},
    { name: "Graphics & Design", key: "design", icon: "palette", items: [
      { id: "amazon-ebay-listings", title: "Amazon/eBay Product Listings (200+ Listings)", tech: "Photoshop, Illustrator, SEO, Amazon Seller Central", description: "Designed and optimized 200+ SEO-friendly product listings for Amazon and eBay marketplaces.", date: "2020-01-01" },
      { id: "infographic-banner", title: "Infographic & Banner Design", tech: "Photoshop, Illustrator, Canva, Filmora", description: "Created sales banners, promotional infographics, and social media visuals for e-commerce brands.", date: "2020-04-01" },
      { id: "label-packaging", title: "Product Label & Packaging Design", tech: "Photoshop, Illustrator, Barcode Systems", description: "Designed product labels, barcode labels, and packaging materials for industrial and retail products.", date: "2025-10-01" },
      { id: "barcode-label-system", title: "Barcode & QR Label Systems", tech: "Label Design, ERP Integration, Barcode Printers", description: "Designed and implemented barcode and QR label systems for ERP-integrated production and warehouse workflows.", date: "2025-10-01" }
    ]}
  ],
  featuredProject: { id: "weight-checker", title: "Digital Weight Scale & Weight Checker App", company: "DhakaThai AlcoMaxx PLC", tech: "C#.NET, Serial Port Integration, ERP Automation", description: "Designed and developed a custom desktop application to integrate physical weight meters/scales with LightHouse ERP at the Packing Section.", images: ["assets/images/projects/weight-checker/weight_checker_v4.png", "assets/images/projects/weight-checker/weight_checker_v4.4.png", "assets/images/projects/weight-checker/weight_scale.png"], details: ["Integrated physical weight meters with LightHouse ERP via Serial Port communication", "Automated bundle packing workflow, reducing packing time by 60%", "Scaled daily label output from 2,500 to 8,000+ labels", "Delivered robust solution improving operational efficiency and minimizing manual errors"], date: "2025-06-01" },
  projectDetails: {
    "weight-checker": { title: "Aluminum Bundle Weight Checker V3.0", subtitle: "Industrial Integration Suite & ERP Sync Solution", company: "DhakaThai AlcoMaxx PLC", developer: "Md. Asaduzzaman (Aminur)", tech: ["C#.NET", "Serial Port Integration", "ERP Automation", "RS232 Protocol", "CSV Data Engine"], images: ["assets/images/projects/weight-checker/weight_checker_v4.png", "assets/images/projects/weight-checker/weight_checker_v4.4.png", "assets/images/projects/weight-checker/weight_scale.png"], metrics: [{ value: "70%", label: "Reduced Time Bottlenecks" }, { value: "8,000+", label: "Daily Bundle Labels" }, { value: "Real-time", label: "RS232 → ERP" }, { value: "100%", label: "Correct Weight in ERP" }], abstract: "Designed and developed a console-based high-precision automation suite for industrial aluminum production.", flow: [{ icon: "storage", title: "System Initialization", text: "The engine dynamically parses WEIGHT_CHART_MASTER.csv into a high-speed memory dictionary for O(1) instant lookup of 1,500+ Die profiles." }, { icon: "memory", title: "Industrial Scale Bridge", text: "Implements a 200ms polling cycle on Scale I/O file X:\\wbdata1.wbg. Filters raw RS232 noise ensuring only stable weight signals are captured." }, { icon: "calculate", title: "Algorithm & Adjustment", text: "Automatically calculates per-piece net weight. Applies dynamic ADJ tolerance logic." }, { icon: "lan", title: "ERP Bridge Automation", text: "Pushes 100% correct bundle weight directly into LightHouse ERP, reducing 500-700 minutes of daily manual data entry." }], details: ["Integrated physical weight meters with LightHouse ERP via Serial Port communication", "Automated bundle packing workflow, reducing packing time by 60%", "Scaled daily label output from 2,500 to 8,000+ labels", "Delivered robust solution improving operational efficiency and minimizing manual errors"], date: "2026-04-01" },
    "weight-scale": { title: "YAOHUA Digital Weight Scale Integration", subtitle: "RS232 Hardware-to-ERP Bridge", company: "DhakaThai AlcoMaxx PLC", developer: "Md. Asaduzzaman (Aminur)", featured: true, tech: ["RS232 Protocol", "Serial Port Communication", "Hardware Integration", "ERP Bridge", "Signal Processing"], images: ["assets/images/projects/weight-scale/scale-hardware.jpg", "assets/images/projects/weight-scale/weight-scale-0.png", "assets/images/projects/weight-scale/weight-scale-ui-2.png", "assets/images/projects/weight-scale/weight-scale-api-1.png", "assets/images/projects/weight-scale/weight-scale-api-2.png", "assets/images/projects/weight-scale/weight-scale-api-3.png"], metrics: [{ value: "RS232", label: "Real-time Data Bridge" }, { value: "200ms", label: "Polling Cycle" }, { value: "1,500+", label: "Die Profiles" }, { value: "100%", label: "Accurate ERP Push" }], abstract: "Industrial hardware integration project connecting YAOHUA XK3190-D# digital weight indicators to LightHouse ERP via RS232 serial communication.", flow: [{ icon: "hardware", title: "Hardware Setup", text: "Configured YAOHUA XK3190-D# weight indicators with RS232 serial communication." }, { icon: "graphic_eq", title: "Signal Processing", text: "Implemented 200ms polling cycle on scale I/O, filtering raw RS232 noise." }, { icon: "memory", title: "Data Validation", text: "Validated captured weights against 1,500+ master die profiles." }, { icon: "lan", title: "ERP Push", text: "Pushed 100% accurate bundle weights directly into LightHouse ERP." }], details: ["RS232 serial communication with YAOHUA XK3190-D# digital weight indicators", "200ms polling cycle with noise filtering for stable weight capture", "Validation against 1,500+ master die profiles", "Automatic ERP data push eliminating manual entry", "Reduced daily data entry bottlenecks by 500-700 minutes"], date: "2025-02-01" },
    "tuition-management": { title: "Tuition Management System", subtitle: "Student & Fee Management Desktop App", company: "Personal Project", developer: "Md. Asaduzzaman (Aminur)", tech: ["C#", "SQL Server Local DB", "Windows Forms"], images: ["assets/images/placeholder.png"], metrics: [{ value: "3+", label: "Modules" }, { value: "Easy", label: "Batch Management" }], abstract: "A desktop application for managing tuition center operations including student information, fee collection, and batch management.", flow: [{ icon: "person", title: "Student Management", text: "Add, edit, and manage student profiles." }, { icon: "payments", title: "Fee Management", text: "Track monthly fee collections, generate receipts." }, { icon: "groups", title: "Batch Management", text: "Organize students into batches." }], details: ["Complete CRUD operations for student records", "Automated fee tracking with due date alerts", "Search and filter", "Export reports to Excel"], date: "2016-09-01" },
    "auto-bell": { title: "Auto Bell 2.0", subtitle: "Automated School Bell System with TTS", company: "Personal Project", developer: "Md. Asaduzzaman (Aminur)", tech: ["VB.net", "MS Access DB", "Text-to-Speech"], images: ["assets/images/placeholder.png"], metrics: [{ value: "Auto", label: "Schedule-based" }, { value: "TTS", label: "Voice Announcements" }], abstract: "An automated bell system for schools that rings bells and makes voice announcements based on predefined schedules.", flow: [{ icon: "schedule", title: "Schedule Management", text: "Configure bell schedules." }, { icon: "record_voice_over", title: "Text-to-Speech", text: "Announce class changes using TTS." }], details: ["Customizable bell schedules", "Voice announcements", "Manual override", "System tray operation"], date: "2017-04-01" },
    "tic-warehouse": { title: "TIC Warehouse App", subtitle: "Inventory Management System", company: "TIC Accessories Inc.", developer: "Md. Asaduzzaman (Aminur)", tech: ["PHP", "MySQL", "Bootstrap", "jQuery"], images: ["assets/images/placeholder.png"], metrics: [{ value: "Inventory", label: "Real-time Tracking" }, { value: "Web-based", label: "Cloud Access" }], abstract: "A web-based warehouse inventory management system for TIC Accessories Inc.", flow: [{ icon: "inventory_2", title: "Stock Management", text: "Track inventory items." }, { icon: "receipt_long", title: "Purchase Orders", text: "Generate and manage POs." }, { icon: "assessment", title: "Reports", text: "View inventory reports." }], details: ["Complete CRUD for inventory", "Real-time stock tracking", "Purchase order generation", "Responsive web interface"], date: "2020-06-01" },
    "easy-c-ide": { title: "Easy C IDE", subtitle: "Lightweight C Compiler IDE with Auto-Save", company: "Personal Project", developer: "Md. Asaduzzaman (Aminur)", tech: ["VB.net", "C Compiler Integration", "Windows Forms"], images: ["assets/images/placeholder.png"], metrics: [{ value: "Lightweight", label: "< 5 MB" }, { value: "Auto-save", label: "Built-in" }], abstract: "A lightweight C programming IDE with integrated C compiler.", flow: [{ icon: "edit_note", title: "Code Editor", text: "Write C code." }, { icon: "terminal", title: "Compiler Integration", text: "Compile and run." }, { icon: "save", title: "Auto-Save", text: "Auto-saves periodically." }], details: ["Integrated C compiler", "Auto-save feature", "Lightweight (< 5 MB)", "Beginner-friendly"], date: "2016-03-01" },
    "resq-remote": { title: "Res-Q Robotic Car & Remote Control", subtitle: "Robotic Car with Desktop Control Application", company: "BPI College Projects Fair 2017 - Champion", developer: "Md. Asaduzzaman (Aminur)", tech: ["C/C++", "Arduino", "C#", "Serial Communication", "Firmware Development"], images: ["assets/images/placeholder.png"], metrics: [{ value: "Champion", label: "BPI Projects Fair 2017" }, { value: "Dual", label: "Firmware + Desktop App" }], abstract: "An award-winning robotic car project that won Champion at BPI College Projects Fair 2017.", flow: [{ icon: "memory", title: "Arduino Firmware", text: "C/C++ firmware on Arduino." }, { icon: "desktop_windows", title: "Desktop Controller", text: "C# Windows Forms application." }, { icon: "bluetooth", title: "Communication", text: "Wireless serial communication." }], details: ["Arduino-based robotic car", "C# desktop controller", "Wireless communication", "Champion award BPI 2017"], date: "2017-03-01" },
    "faith-it": { title: "Faith IT - Agency Portfolio", subtitle: "Corporate Agency Website", company: "Faith Media Ltd.", developer: "Md. Asaduzzaman (Aminur)", tech: ["WordPress", "Elementor", "WooCommerce", "SEO"], images: ["assets/images/placeholder.png"], metrics: [{ value: "Live", label: "faithmedia.com" }, { value: "Agency", label: "Portfolio Site" }], abstract: "A professional agency portfolio website for Faith Media Ltd.", flow: [{ icon: "web", title: "Portfolio Showcase", text: "Visually rich portfolio." }, { icon: "search", title: "SEO Optimization", text: "On-page SEO." }, { icon: "devices", title: "Responsive Design", text: "Optimized for all devices." }], details: ["WordPress + Elementor", "Portfolio showcase", "SEO-optimized", "Contact form"], date: "2020-02-01" },
    "gontobbo-express": { title: "Gontobbo Express", subtitle: "Logistics Platform Implementation", company: "Freelance Project", developer: "Md. Asaduzzaman (Aminur)", tech: ["WordPress", "WooCommerce", "Custom Plugins", "Logistics API"], images: ["assets/images/placeholder.png"], metrics: [{ value: "Logistics", label: "Delivery Platform" }, { value: "Integrated", label: "Payment + Tracking" }], abstract: "Implementation of a logistics platform for managing deliveries.", flow: [{ icon: "local_shipping", title: "Delivery Management", text: "End-to-end delivery management." }, { icon: "track_changes", title: "Shipment Tracking", text: "Real-time tracking." }, { icon: "payments", title: "Payment Integration", text: "Integrated payment gateway." }], details: ["WooCommerce logistics", "Real-time tracking", "Payment gateway", "Admin dashboard"], date: "2021-01-01" },
    "chembynavid": { title: "ChemByNavid", subtitle: "E-Commerce & LMS Integration", company: "Freelance Project", developer: "Md. Asaduzzaman (Aminur)", tech: ["WordPress", "WooCommerce", "LMS Plugin", "Content Management"], images: ["assets/images/placeholder.png"], metrics: [{ value: "E-Commerce", label: "Online Store" }, { value: "LMS", label: "Course Platform" }], abstract: "A combined e-commerce and learning management system.", flow: [{ icon: "shopping_cart", title: "E-Commerce", text: "WooCommerce store." }, { icon: "school", title: "LMS Integration", text: "Course creation." }, { icon: "sync", title: "Content Updates", text: "Content updates." }], details: ["WooCommerce e-commerce", "LMS integration", "Payment gateway", "Content maintenance"], date: "2021-02-15" },
    "rapid-supplies": { title: "Rapid Supplies Inc.", subtitle: "Tech E-Commerce Store", company: "TIC Accessories Inc.", developer: "Md. Asaduzzaman (Aminur)", tech: ["WordPress", "WooCommerce", "Product Management", "SEO"], images: ["assets/images/placeholder.png"], metrics: [{ value: "B2B", label: "Wholesale Platform" }, { value: "Tech", label: "Accessories Store" }], abstract: "A B2B/B2C e-commerce platform for TIC Accessories Inc.", flow: [{ icon: "category", title: "Product Catalog", text: "Organized product listings." }, { icon: "inventory", title: "Inventory Sync", text: "Real-time inventory." }, { icon: "local_shipping", title: "Order Fulfillment", text: "Automated order processing." }], details: ["WooCommerce store", "B2B bulk ordering", "Real-time inventory", "SEO-optimized"], date: "2020-07-01" },
    "different-cafe": { title: "DifferentCafeBD", subtitle: "Cafe Brand Website", company: "Freelance Project", developer: "Md. Asaduzzaman (Aminur)", url: "https://differentcafebd.com", tech: ["WordPress", "Elementor", "Branding", "Local Business SEO"], images: ["assets/images/placeholder.png"], metrics: [{ value: "Cafe", label: "Brand Website" }, { value: "Local SEO", label: "Google Maps Ready" }], abstract: "A cafe brand website for DifferentCafeBD.", flow: [{ icon: "restaurant_menu", title: "Menu Display", text: "Digital menu." }, { icon: "location_on", title: "Location & Hours", text: "Store locations." }, { icon: "shopping_bag", title: "Online Ordering", text: "Online ordering system." }], details: ["Elementor responsive design", "Digital menu with ordering", "Local SEO", "Contact info with maps"], date: "2021-02-20" },
    "realcafe-bd": { title: "RealCafeBd", subtitle: "Cafe Brand Website", company: "Freelance Project", developer: "Md. Asaduzzaman (Aminur)", url: "https://realcafebd.com", tech: ["WordPress", "Elementor", "Branding", "Local Business SEO"], images: ["assets/images/placeholder.png"], metrics: [{ value: "Cafe", label: "Brand Website" }, { value: "Local SEO", label: "Google Maps Ready" }], abstract: "A cafe brand website for RealCafeBd.", flow: [{ icon: "restaurant_menu", title: "Menu Display", text: "Digital menu." }, { icon: "location_on", title: "Location & Hours", text: "Store locations." }, { icon: "shopping_bag", title: "Online Ordering", text: "Online ordering system." }], details: ["Elementor responsive design", "Digital menu with ordering", "Local SEO", "Contact info with maps"], date: "2021-02-26" },
    "cosmicshopbd": { title: "CosmicShopBd", subtitle: "Website + Android E-Commerce App", company: "Freelance Project", developer: "Md. Asaduzzaman (Aminur)", tech: ["WordPress", "WooCommerce", "Android", "Java", "REST API", "Multi-price", "Inventory"], images: ["assets/images/placeholder.png"], metrics: [{ value: "Website", label: "WooCommerce Store" }, { value: "Android", label: "Native Shopping App" }], abstract: "A full-stack e-commerce solution combining WooCommerce website with native Android app.", flow: [{ icon: "store", title: "Retail Storefront", text: "Standard retail shopping." }, { icon: "warehouse", title: "Wholesale Portal", text: "Bulk ordering with tiered pricing." }, { icon: "price_change", title: "Multi-Price System", text: "Role-based price switching." }, { icon: "storefront", title: "Android App Browsing", text: "Browse products on mobile." }, { icon: "shopping_cart", title: "Android App Checkout", text: "Cart management and checkout." }, { icon: "sync", title: "API Integration", text: "Real-time data sync via REST API." }], details: ["WordPress + WooCommerce dual-mode retail/wholesale", "Native Android app with Material Design", "Multi-tier pricing", "Seamless website-app sync"], date: "2024-09-01" },
    "amazon-ebay-listings": { title: "Amazon/eBay Product Listing Suite", subtitle: "200+ SEO-Optimized E-Commerce Listings", company: "TIC Accessories Inc.", developer: "Md. Asaduzzaman (Aminur)", tech: ["Photoshop", "Illustrator", "Amazon Seller Central", "eBay Seller Hub", "SEO", "Keyword Research"], images: ["assets/images/placeholder.png"], metrics: [{ value: "200+", label: "Products Listed" }, { value: "SEO", label: "Optimized Content" }, { value: "B2B/B2C", label: "Dual Marketplace" }], abstract: "Managed and optimized 200+ product listings across Amazon and eBay.", flow: [{ icon: "photo_camera", title: "Product Photography", text: "Professional photos for marketplace." }, { icon: "edit", title: "Listing Content", text: "SEO-optimized titles and descriptions." }, { icon: "trending_up", title: "Performance", text: "Monitor and optimize analytics." }], details: ["200+ listings on Amazon and eBay", "SEO-optimized content", "Professional photography", "Competitive pricing analysis"], date: "2020-01-01" },
    "infographic-banner": { title: "E-Commerce Infographic & Banner Portfolio", subtitle: "Promotional & Social Media Visuals", company: "TIC Accessories Inc. / Freelance", developer: "Md. Asaduzzaman (Aminur)", tech: ["Photoshop", "Illustrator", "Canva", "Filmora", "Social Media Design"], images: ["assets/images/placeholder.png"], metrics: [{ value: "50+", label: "Banners Created" }, { value: "Multi-brand", label: "Design Systems" }], abstract: "Designed infographics, banners, social media visuals, and email graphics.", flow: [{ icon: "lightbulb", title: "Concept", text: "Brand guidelines and goals." }, { icon: "brush", title: "Design", text: "Create with Photoshop/Illustrator." }, { icon: "campaign", title: "Delivery", text: "Multi-format delivery." }], details: ["Sale banners and promotions", "Product comparison infographics", "Social media visuals", "Email marketing graphics"], date: "2020-04-01" },
    "label-packaging": { title: "Product Label & Barcode Print", subtitle: "Industrial & Retail Label Solutions", company: "DhakaThai AlcoMaxx PLC / TIC Accessories Inc.", developer: "Md. Asaduzzaman (Aminur)", tech: ["Photoshop", "Illustrator", "Label Design", "Barcode Systems", "Print Production"], images: ["assets/images/placeholder.png"], metrics: [{ value: "50+", label: "Label Designs" }, { value: "8,000/day", label: "Label Output" }], abstract: "Designed product labels for industrial and retail products.", flow: [{ icon: "straighten", title: "Label Layout", text: "Design with barcodes and QR." }, { icon: "print", title: "Print Production", text: "Print-ready files." }, { icon: "inventory", title: "System Integration", text: "ERP-integrated templates." }], details: ["Labels with barcodes and QR", "Shipping and warehouse labels", "Packaging design", "ERP-integrated templates"], date: "2025-10-01" },
    "barcode-label-system": { title: "Barcode & QR Label Systems", subtitle: "ERP-Integrated Label Workflows", company: "DhakaThai AlcoMaxx PLC / Keya Group", developer: "Md. Asaduzzaman (Aminur)", tech: ["Barcode Design", "QR Code Systems", "ERP Integration", "Label Printers", "RFID Tags"], images: ["assets/images/placeholder.png"], metrics: [{ value: "8,000+/day", label: "QR Labels Scaled" }, { value: "60%", label: "Speed Increase" }], abstract: "Designed barcode and QR label systems integrated with ERP workflows.", flow: [{ icon: "qr_code_scanner", title: "Label Generation", text: "Automated from ERP data." }, { icon: "sync", title: "ERP Bridge", text: "Real-time data from ERP." }, { icon: "print", title: "High-Volume Printing", text: "Continuous high-speed output." }], details: ["Scaled from 2,500 to 8,000+ daily", "Integrated with LightHouse ERP", "RFID tag generation", "Bundle QR tracking"], date: "2025-10-01" },
    "tic-accessories": { title: "TIC Accessories Inc. - Full-Spectrum Digital Operations", subtitle: "IT Support, Web Dev, E-Commerce, Design & Listings", company: "TIC Accessories Inc. (New York, USA)", developer: "Md. Asaduzzaman (Aminur)", tech: ["WordPress", "WooCommerce", "Amazon Seller Central", "eBay", "Photoshop", "Illustrator", "Remote IT Support", "SEO", "Inventory Management"], images: ["assets/images/placeholder.png"], metrics: [{ value: "200+", label: "Product Listings" }, { value: "Full Stack", label: "Design + Dev + IT" }], abstract: "Comprehensive digital operations support for a New York-based tech accessories company.", flow: [{ icon: "support_agent", title: "Remote IT Support", text: "Via Anydesk and TeamViewer." }, { icon: "web", title: "Website Management", text: "WordPress + WooCommerce." }, { icon: "shopping_cart", title: "E-Commerce Operations", text: "Amazon + eBay management." }, { icon: "palette", title: "Design & Photography", text: "Infographics and product photos." }, { icon: "assignment", title: "Operations", text: "Excel reports and email campaigns." }], details: ["Remote IT support for NY office", "WordPress/WooCommerce website", "200+ Amazon/eBay listings", "Infographic and banner design", "Product photography editing", "Excel automation and email marketing"], date: "2020-02-01" },
    "tic-website": { title: "TIC Accessories - Corporate Website", subtitle: "WordPress Company Site with WooCommerce", company: "TIC Accessories Inc.", developer: "Md. Asaduzzaman (Aminur)", tech: ["WordPress", "Elementor", "WooCommerce", "Product Management", "Contact System"], images: ["assets/images/placeholder.png"], metrics: [{ value: "Corporate", label: "Brand Presence" }, { value: "E-Commerce", label: "Integrated Store" }], abstract: "Main company website for TIC Accessories Inc. on WordPress with Elementor.", flow: [{ icon: "web", title: "Site Architecture", text: "Responsive WordPress site." }, { icon: "category", title: "Product Catalog", text: "Organized product catalog." }, { icon: "shopping_cart", title: "WooCommerce Store", text: "Integrated online store." }], details: ["WordPress + Elementor", "WooCommerce integration", "Product catalog with search", "Contact forms"], date: "2020-03-01" },
    "tasbih": { title: "Tasbih - Digital Prayer Counter", subtitle: "Android Tasbih Counting App", company: "Personal Project", developer: "Md. Asaduzzaman (Aminur)", tech: ["MIT App Inventor", "Android", "TinyDB"], images: ["assets/images/placeholder.png"], metrics: [{ value: "Android", label: "Mobile App" }, { value: "Offline", label: "No Internet Needed" }], abstract: "A digital tasbih (prayer bead) counter Android app.", flow: [{ icon: "touch_app", title: "Tap Counting", text: "Simple tap interface." }, { icon: "bookmark", title: "Multiple Profiles", text: "Different prayer counters." }, { icon: "history", title: "History Tracking", text: "Daily/weekly/monthly views." }], details: ["Material Design interface", "Multiple counter profiles", "Session history", "Offline operation"], date: "2024-10-01" },
    "zenbreaths": { title: "ZenBreaths - Guided Breathing App", subtitle: "Cross-Platform Mindfulness App", company: "Personal Project", developer: "Md. Asaduzzaman (Aminur)", tech: ["HTML", "Tailwind CSS", "Vue 3", "Nuxt", "Capacitor", "Android Studio"], images: ["assets/images/placeholder.png"], metrics: [{ value: "Guided", label: "Breathing Sessions" }, { value: "Custom", label: "Duration Settings" }], abstract: "A cross-platform guided breathing and meditation app.", flow: [{ icon: "air", title: "Breathing Exercises", text: "Visual inhale/hold/exhale." }, { icon: "timer", title: "Session Control", text: "Customizable duration." }, { icon: "music_note", title: "Ambient Sounds", text: "Optional background sounds." }], details: ["Visual breathing animation", "1-30 min session duration", "Ambient sounds", "Session history"], date: "2026-02-01" },
    "hakimadapp-website": { title: "Hakimadapp.github.io - Religious Website", subtitle: "Faith-Based Islamic Website", company: "Personal Project", developer: "Md. Asaduzzaman (Aminur)", tech: ["HTML", "CSS", "JavaScript", "GitHub Pages"], images: ["assets/images/placeholder.png"], metrics: [{ value: "Religious", label: "Faith Platform" }, { value: "Responsive", label: "All Devices" }], abstract: "A religious/faith-based website hosted on GitHub Pages.", flow: [{ icon: "menu_book", title: "Content Sections", text: "Organized religious content." }, { icon: "public", title: "Global Access", text: "GitHub Pages hosting." }, { icon: "devices", title: "Responsive Design", text: "Mobile, tablet, desktop." }], details: ["Faith-based content", "HTML/CSS/JS", "GitHub Pages", "Responsive design"], date: "2026-03-01" },
    "dhakathai-it": { title: "DhakaThai Alcomaxx PLC - IT Operations", subtitle: "Barcode Station Support for Aluminum Manufacturing Plant", company: "DhakaThai AlcoMaxx PLC", developer: "Md. Asaduzzaman (Aminur)", tech: ["IT Support", "OS Administration", "Barcode ERP", "System Maintenance", "Tools Development", "Network Setup"], images: ["assets/images/placeholder.png"], metrics: [{ value: "Plant-wide", label: "IT Operations" }, { value: "ERP", label: "Barcode Integration" }], abstract: "Managed Barcode Station operations at an aluminum manufacturing plant.", flow: [{ icon: "dns", title: "System Administration", text: "Windows/Linux systems." }, { icon: "inventory", title: "Barcode ERP", text: "Labeling ERP systems." }, { icon: "build", title: "Tools Development", text: "Utility tools for automation." }, { icon: "router", title: "Network & Hardware", text: "LAN, printers, peripherals." }], details: ["IT support for manufacturing plant", "OS administration", "Barcode ERP management", "Tool development", "Network configuration"], date: "2023-08-01" },
    "keya-group-it": { title: "Keya Group [IT-GPRO] - ERP Administration", subtitle: "IT Support Across 50+ Workstations", company: "Keya Knit Composite Ltd.", developer: "Md. Asaduzzaman (Aminur)", tech: ["GPRO ERP", "IT Support", "OS Administration", "RFID Systems", "Barcode Systems", "Network Maintenance", "User Training"], images: ["assets/images/placeholder.png"], metrics: [{ value: "50+", label: "Workstations Managed" }, { value: "20+", label: "Users Trained" }], abstract: "Administered IT operations at Gpro Section of Keya Group, a large RMG factory.", flow: [{ icon: "storage", title: "GPRO ERP", text: "Managed ERP modules." }, { icon: "desktop_windows", title: "Workstations", text: "50+ PCs and printers." }, { icon: "qr_code_scanner", title: "RFID & Barcode", text: "RFID tags and barcode systems." }, { icon: "school", title: "User Training", text: "Trained 20+ employees." }], details: ["GPRO ERP administration", "50+ workstation management", "RFID and barcode systems", "User training (20+ staff)"], date: "2022-06-01" },
    "bpi-lab": { title: "B. P. I. Innovation Lab", subtitle: "College Innovation Lab Setup & Support", company: "Bogura Polytechnic Institute", developer: "Md. Asaduzzaman (Aminur)", tech: ["Hardware Setup", "Software Installation", "Network Configuration", "Lab Maintenance"], images: ["assets/images/placeholder.png"], metrics: [{ value: "Lab Setup", label: "Full Installation" }, { value: "Multi-Use", label: "Software + Hardware" }], abstract: "Set up and maintained the Innovation Lab at Bogura Polytechnic Institute.", flow: [{ icon: "computer", title: "Hardware Setup", text: "Assembled computer systems." }, { icon: "code", title: "Software Installation", text: "Development tools and IDEs." }, { icon: "lan", title: "Network Configuration", text: "Local network with internet." }], details: ["Hardware setup and configuration", "Software installation", "Network setup", "Ongoing maintenance"], date: "2018-03-01" },
    "naogaon-lab": { title: "Naogaon Tech. School ICT Lab", subtitle: "Computer Lab Installation for Technical School", company: "Naogaon Technical School & College", developer: "Md. Asaduzzaman (Aminur)", tech: ["PC Assembly", "OS Installation", "Software Setup", "Hardware Diagnostics"], images: ["assets/images/placeholder.png"], metrics: [{ value: "Lab Setup", label: "Complete Installation" }, { value: "ICT", label: "Curriculum Ready" }], abstract: "Set up the ICT computer lab at Naogaon Technical School & College.", flow: [{ icon: "build", title: "PC Assembly", text: "Assembled from components." }, { icon: "desktop_windows", title: "OS & Software", text: "Windows and Linux install." }, { icon: "bug_report", title: "Diagnostics", text: "Hardware troubleshooting." }], details: ["PC assembly", "OS installation", "Educational software", "Hardware diagnostics"], date: "2012-09-01" },
    "dtl-google-chrome": { title: "DTL - Portable Google Chrome (No CORS)", subtitle: "Cross-Origin Development Environment", company: "DhakaThai AlcoMaxx PLC / TIC Accessories Inc.", developer: "Md. Asaduzzaman (Aminur)", tech: ["Portable Chrome", "Batch Scripting", "CORS Bypass Config", "User Data Management"], images: ["assets/images/projects/dtl-google-chrome/screenshot.png"], metrics: [{ value: "No CORS", label: "Dev Environment" }, { value: "Portable", label: "No Install Needed" }], abstract: "Configured a portable Google Chrome with custom user data directory disabling CORS.", flow: [{ icon: "public", title: "No-CORS Browsing", text: "Chrome with --disable-web-security." }, { icon: "usb", title: "Portable Setup", text: "Runs from USB drive." }, { icon: "terminal", title: "Batch Automation", text: "One-click launch script." }], details: ["Portable Chrome no-CORS", "Custom user data directory", "Batch script launcher", "No installation needed"], date: "2026-05-01" }
  },
  multimediaCategories: [
    { name: "Creative Services", key: "creative", icon: "auto_awesome", items: [
      { id: "custom-poetry-01", title: "Custom Poetry Composition", description: "Personalized poetry for events, presentations, and media projects.", date: "2026-05-01" },
      { id: "custom-song-01", title: "Original Song Production", description: "Custom song with personalized lyrics and AI-assisted composition.", date: "2026-04-15" },
      { id: "ai-video-01", title: "AI-Powered Promotional Video", description: "End-to-end video with AI-generated visuals and animation.", date: "2026-06-01" },
      { id: "pencil-portrait-01", title: "Pencil Portrait from Photo", description: "Hand-drawn realistic pencil portrait from reference photo.", date: "2026-03-10" },
      { id: "home-decor-01", title: "Custom Wall Art Design", description: "AI-designed wall-framed picture with personalized theme.", date: "2026-05-20" },
      { id: "brand-guide-01", title: "Brand Identity & Style Guide", description: "Complete brand identity package.", date: "2026-02-15" }
    ]},
    { name: "Graphics & Design", key: "design", icon: "palette", items: [
      { id: "amazon-listings", title: "Amazon/eBay Product Listings (200+)", description: "Designed 200+ SEO-friendly product listings.", date: "2020-01-01" },
      { id: "infographic-banners", title: "Infographic & Banner Design", description: "Sales banners and social media visuals.", date: "2020-04-01" },
      { id: "label-packaging", title: "Product Label & Packaging Design", description: "Labels and packaging for industrial products.", date: "2025-10-01" },
      { id: "barcode-label-system", title: "Barcode & QR Label Systems", description: "ERP-integrated barcode and QR label systems.", date: "2025-10-01" }
    ]},
    { name: "Video & Multimedia", key: "video", icon: "videocam", items: [
      { id: "weight-checker-video", title: "Weight Checker App Demo", description: "Demonstration of automated bundle weight checking system.", date: "2026-04-01" },
      { id: "wedding-slideshow", title: "Wedding Presentation Video", description: "Custom wedding presentation with photo montage.", date: "2026-05-15" },
      { id: "product-promo", title: "Product Promotional Reel", description: "Short-form promotional video for social media.", date: "2026-03-20" }
    ]},
    { name: "Photography", key: "photo", icon: "camera_alt", items: [
      { id: "product-photography", title: "E-Commerce Product Photography", description: "Professional product photography for marketplace listings.", date: "2020-03-01" },
      { id: "event-coverage", title: "Event Photography Coverage", description: "Event photography with editing and color grading.", date: "2025-12-01" }
    ]}
  ],
  servicesGroups: [
    { icon: "laptop_mac", title: "Web & App Development", bg: "var(--primary)", chipColor: "var(--primary-light)", borderLeft: "3px solid var(--primary)", items: [
      { icon: "web", title: "Web Development & CMS", description: "Custom WordPress, WooCommerce, Vue, and Laravel development.", highlights: ["WordPress, Elementor, WooCommerce", "Vue 3 SPA Development", "Laravel REST API & Backend", "Custom Theme & Plugin Development", "Payment Gateway Integration, LMS, ACF", "SEO Optimization & Performance Tuning"] },
      { icon: "important_devices", title: "Hybrid Mobile App (PWA, Web, Android)", description: "Cross-platform mobile solutions combining PWA and Capacitor.", highlights: ["Progressive Web App (PWA) Development", "Hybrid Android APK via Capacitor", "Vue 3 / React + Capacitor Integration", "Offline Mode, Push Notifications & Service Workers", "Play Store Deployment & App Updates", "Camera, GPS & Native Plugin Access"] },
      { icon: "code", title: "Custom Software & Tools Development", description: "Bespoke desktop applications, internal business tools, and automation scripts.", highlights: ["Bespoke Desktop Applications", "Internal Business & Productivity Tools", "Utility Software & CLI Tools", "Process Automation Scripts", "C# .NET WinForms & ADO.NET", "System Integration & Custom Reporting"] }
    ]},
    { icon: "support", title: "IT & Business Support", bg: "var(--primary)", chipColor: "var(--primary-light)", borderLeft: "3px solid var(--primary)", items: [
      { icon: "dns", title: "Software & Hardware Troubleshooting & IT Support", description: "Full-spectrum PC troubleshooting and IT support.", highlights: ["Windows OS Installation, Repair & Recovery", "Hardware Diagnostics: RAM, HDD/SSD, PSU, Motherboard", "Driver Conflict Resolution & Peripheral Setup", "Slow PC Optimization & Malware Removal", "Data Backup, Recovery & System Migration", "PC Assembly, Upgrade & Remote IT Support"] },
      { icon: "settings_applications", title: "ERP & Business Systems Administration", description: "Full-cycle ERP management including module configuration, data entry, payroll, inventory, POS.", highlights: ["ERP Module Configuration & Management", "Inventory, Payroll & Billing Operations", "POS Systems & Data Entry", "File Handling & Document Management", "ERP Install, Migration & Support", "Garments Systems & RFID Tag Generation"] },
      { icon: "lan", title: "Network Infrastructure & Security", description: "Basic network services — IP configuration, LAN/router setup, printer sharing, firewall.", highlights: ["Laptop / PC IP Configuration & Troubleshooting", "LAN / Router Setup & Network Configuration", "File & Printer Sharing Setup", "Firewall & Antivirus Deployment", "Network Device Diagnostics & Maintenance", "PC / Printer Network Troubleshooting"] }
    ]},
    { icon: "trending_up", title: "E-Commerce & Marketing", bg: "var(--primary)", chipColor: "var(--primary-light)", borderLeft: "3px solid var(--primary)", items: [
      { icon: "shopping_cart", title: "E-Commerce & Online Store Solutions", description: "Full WooCommerce store development on WordPress.", highlights: ["WooCommerce Store Development on WordPress", "Theme Customization & Product Catalog Setup", "Product Photography, Editing & Infographics", "Order, Shipping & Inventory Management", "Promotional Email Campaigns & Newsletters", "Store Maintenance & Performance Optimization"] },
      { icon: "campaign", title: "Email Marketing & Campaigns", description: "End-to-end email campaign management.", highlights: ["Campaign Setup & Automation", "Newsletter & Lead Nurture Sequences", "Bulk Mailing Tools (Mailchimp, SendGrid)", "Email Copywriting & Analytics", "Subscriber List Management & Segmentation", "A/B Testing & Performance Reporting"] },
      { icon: "webhook", title: "Email & Web Template Design", description: "Custom-coded HTML email templates and responsive web page templates.", highlights: ["HTML Email Template Design & Coding", "Responsive Email Layouts (Dark Mode Ready)", "Landing Page & Web Template Design", "Mailchimp / SendGrid Template Integration", "Brand-consistent Visual Email Design", "Cross-client Email Rendering Testing"] }
    ]},
    { icon: "auto_awesome", title: "Design & Multimedia", bg: "var(--primary)", chipColor: "var(--primary-light)", borderLeft: "3px solid var(--primary)", items: [
      { icon: "palette", title: "Graphic Design & Branding", description: "Professional print and digital design.", highlights: ["Business Cards, Flyers & Banners", "Social Media Posts & Cover Art", "Product Photography & Editing", "Infographics, Labels & Invoices", "Logo & Brand Identity Design", "Brochures, Menus & Print-ready Artwork"] },
      { icon: "videocam", title: "Video Editing", description: "Creative video editing for social media reels and promotional clips.", highlights: ["Short-form Reels & Social Media Clips", "Promotional & Corporate Video Editing", "Trimming, Transitions & Color Grading", "Text Overlays, Captions & Titles", "Background Music & Audio Sync", "CapCut & Mobile-first Video Optimization"] },
      { icon: "movie_creation", title: "AI-Powered Multimedia Production", description: "End-to-end multimedia content created with AI.", highlights: ["AI Comic Strip & Cartoon Generation", "AI Digital Art & Image Compositing", "AI Photo Retouching & Manipulation", "AI Audio Editing & Voiceover Production", "AI Music Composition & Background Scoring", "AI Animation & Motion Graphics"] }
    ]},
    { icon: "psychology", title: "AI Services", bg: "var(--primary)", chipColor: "var(--primary-light)", borderLeft: "3px solid var(--primary)", items: [
      { icon: "description", title: "AI Writing & Document Help", description: "Practical AI-powered writing for everyday needs.", highlights: ["Resume & Cover Letter Writing", "Official Email & Letter Drafting", "Job Application & Proposal Writing", "Report & Document Formatting", "Proofreading & Paraphrasing", "Multi-language Translation"] },
      { icon: "auto_awesome", title: "AI Image & Photo Services", description: "Real-world image solutions — product photos, portrait retouching.", highlights: ["Product Photo Editing & Retouching", "Background Removal & Replacement", "Old Photo Restoration & Colorization", "Passport & ID Photo Processing", "AI Portrait & Profile Picture Creation", "Social Media Visual & Thumbnail Design"] },
      { icon: "smart_toy", title: "AI Automation & Chatbot Setup", description: "Practical automation for small businesses.", highlights: ["AI Customer Reply Chatbot Setup", "Automated Email & Message Responses", "Data Entry & Spreadsheet Automation", "PDF Data Extraction & Processing", "Social Media Auto-Reply & Scheduling", "Simple n8n Workflow Automation"] }
    ]},
    { icon: "brush", title: "Creative Services — Powered by A.I.", note: "AI-assisted creative works — content, design, print, and branding deliverables.", bg: "var(--accent-purple)", chipColor: "var(--accent-purple)", borderLeft: "3px solid var(--accent-purple)", items: [
      { icon: "edit_note", title: "Custom Poetry & Voice", description: "Personalized poetry and spoken-word content.", highlights: ["Custom Poetry for Events & Occasions", "Voice-Recorded Spoken Word", "Presentation & Script Writing", "Multi-language Poetry Options", "Themed & Branded Content", "Quick Turnaround Delivery"] },
      { icon: "music_note", title: "Custom Songs & Music Production", description: "Original songs with personalized lyrics and AI-assisted composition.", highlights: ["Personalized Lyrics & Composition", "AI-Assisted Music Production", "Wedding & Event Presentation Songs", "Brand Campaign Audio Content", "Full Audio + Video Output", "Customizable Genre & Style"] },
      { icon: "videocam", title: "AI Video Content Creation", description: "Video content from concept to final edit with AI-powered visuals.", highlights: ["Content Planning & Storyboarding", "AI-Generated Visuals & Animation", "Photo Montage & Slideshow Videos", "Voiceover & Background Music Sync", "Social Media-Ready Short Clips", "Professional Editing & Color Grading"] },
      { icon: "gesture", title: "Pencil Sketch & Portrait Art", description: "Hand-drawn pencil portraits from reference photos.", highlights: ["Portrait Sketch from Photo Reference", "Realistic Pencil Drawing on Paper", "Custom Size & Framing Options", "Gift-Ready Packaged Artwork", "AI-Enhanced Photo Reference Prep", "Digital Scan Copy Included"] },
      { icon: "wallpaper", title: "AI Home Decor Design", description: "Custom wall art and decor designs created with AI.", highlights: ["Custom Wall-Framed Picture Design", "AI-Generated Canvas & Print Art", "Personalized Quote & Name Frames", "Custom Size & Aspect Ratio Options", "Theme-Based Decor Collections", "Printable & Ready-to-Frame Formats"] },
      { icon: "store", title: "Custom Stationery & Branding", description: "Bespoke stationery sets, t-shirt graphics, brand identity guides.", highlights: ["Custom Stationery Sets Design", "T-Shirt Graphics & Print-Ready Art", "Brand Identity & Style Guide Creation", "Logo, Business Card & Letterhead Sets", "Packaging & Label Design", "Full Merchandise Design Suite"] }
    ]},
    { icon: "precision_manufacturing", title: "Industrial & On-Site", note: "Specialized services for manufacturing environments — available for on-site work.", bg: "var(--accent-amber)", chipColor: "var(--accent-amber)", borderLeft: "3px solid var(--accent-amber)", items: [
      { icon: "storage", title: "Desktop Automation & Hardware Integration", description: "Custom C# .NET desktop applications integrated with industrial hardware.", highlights: ["C# .NET WinForms & ADO.NET Applications", "YAOHUA Digital Weight Scale Integration", "Automated Label & Barcode Printing Systems", "Serial Port & Hardware Communication", "Crystal Reports & Data Export Solutions", "Excel VBA Macros & Process Automation"] },
      { icon: "settings_ethernet", title: "Industrial RFID, Barcode & IoT Systems", description: "Production floor data collection infrastructure.", highlights: ["RFID NXP MCU Terminal Setup & Management", "MOXA Multiport Serial Card Configuration", "RJ-6 (RS-485) Cabling & Infrastructure", "Barcode Printer Configuration & Label Automation", "Production Floor RFID Checkpoints & Data Collection", "ERP-to-Floor Device Integration (MOXA / RFID)"] },
      { icon: "dns", title: "Production Floor IT & Systems Support", description: "IT support tailored for manufacturing environments.", highlights: ["PC / Printer Setup & Troubleshooting on Production Floor", "LAN, IP Config & Network Diagnostics", "ERP User Administration & Module Support", "File & Printer Sharing for Workshop Environments", "30+ Workstation & Device Management", "RJ-6 / MOXA Device Networking & Support"] }
    ]}
  ]
};

/* ===================================================
   tinyVue 1.0 � Application Components
   All 11 views + App root as defineComponent()
   =================================================== */
(function () {
const { defineComponent } = window.tinyVue;

// --- HOME VIEW ---
const HomeView = defineComponent({
  name: 'HomeView',
  template: [
    '<div class="hero-section">',
    '  <span class="section-tag">Since 2018 in IT</span>',
    '',
    '  <!-- Title + Image row -->',
    '  <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-4">',
    '    <div class="flex-1">',
    '      <h1 class="hero-title">{{ DATA.personal.name }} <br><span class="gradient-text">({{ DATA.personal.nickname }})</span></h1>',
    '    </div>',
    '    <div class="lg:shrink-0 w-full lg:w-48 xl:w-56">',
    '      <img :src="DATA.personal.photo" :alt="DATA.personal.name"',
    '        class="w-full h-auto rounded-2xl object-contain" loading="lazy"',
    '        style="box-shadow:0 8px 32px rgba(20,184,166,0.15);border:2px solid var(--border)">',
    '      <!-- Social Icons under image (desktop only) -->',
    '      <div class="hidden lg:flex flex-wrap justify-center gap-2 mt-3">',
    '        <a :href="\'https://\' + DATA.personal.linkedin" target="_blank" class="theme-toggle flex items-center justify-center" title="LinkedIn" style="width:36px;height:36px">',
    '          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68zm1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>',
    '        </a>',
    '        <a :href="DATA.personal.website" target="_blank" class="theme-toggle flex items-center justify-center" title="Portfolio" style="width:36px;height:36px">',
    '          <i class="material-icons" style="font-size:20px">language</i>',
    '        </a>',
    '        <a href="https://github.com/amin670bd" target="_blank" class="theme-toggle flex items-center justify-center" title="GitHub" style="width:36px;height:36px">',
    '          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>',
    '        </a>',
    '        <a href="https://www.youtube.com/@aminur670" target="_blank" class="theme-toggle flex items-center justify-center" title="YouTube" style="width:36px;height:36px">',
    '          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/></svg>',
    '        </a>',
    '        <a :href="\'https://wa.me/\' + DATA.personal.phone1.replace(/[^0-9]/g,\'\')" target="_blank" class="theme-toggle flex items-center justify-center" title="WhatsApp" style="width:36px;height:36px">',
    '          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 2.097.602 4.055 1.638 5.708L2 22l4.374-1.604C8.02 21.378 9.965 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.833 0-3.557-.58-4.973-1.573l-.357-.237-2.597.954.96-2.549-.255-.38A7.956 7.956 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.19-5.94c-.23-.115-1.36-.67-1.57-.746-.21-.077-.363-.115-.516.115-.153.23-.593.746-.727.899-.134.153-.268.172-.498.057-.23-.115-.972-.358-1.85-1.143-.684-.613-1.146-1.37-1.28-1.602-.134-.23-.014-.355.101-.47.103-.103.23-.268.345-.402.115-.134.153-.23.23-.383.077-.153.038-.287-.019-.402-.057-.115-.516-1.244-.707-1.704-.186-.45-.374-.372-.516-.372-.134 0-.287-.019-.44-.019-.153 0-.402.057-.612.287-.21.23-.802.784-.802 1.913s.82 2.22.935 2.373c.115.153 1.614 2.465 3.91 3.456.546.236.972.377 1.305.482.548.173 1.048.149 1.442.09.44-.066 1.36-.555 1.552-1.092.192-.537.192-.997.134-1.093-.057-.096-.21-.153-.44-.268z"/></svg>',
    '        </a>',
    '      </div>',
    '    </div>',
    '  </div>',
    '',
    '  <p class="hero-subtitle mt-4 mb-2" style="color:var(--text)">',
    '    <span>A unique fusion of </span>',
    '    <strong><span class="typewriter-cursor">{{ currentRole }}</span></strong>',
    '  </p>',
    '  <p class="text-base mb-8" style="color:var(--text)">',
    '    Dedicated to automating workflows, reducing production costs, and modernizing digital infrastructure.',
    '  </p>',
    '',
    '  <div class="flex flex-wrap gap-3 mb-10">',
    '    <button @click="toggleContactModal" class="hero-btn btn-shimmer inline-flex items-center gap-2 px-6 py-3 gradient-bg text-white font-semibold rounded-xl shadow-lg transition-all duration-300" style="box-shadow:0 4px 15px rgba(20,184,166,0.3);cursor:pointer">',
    '      <i class="material-icons text-lg">contact_phone</i> Contact',
    '    </button>',
    '    <a href="#/contact" class="hero-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300" style="border:1px solid var(--border);color:var(--text-heading);background:var(--bg-card)">',
    '      <i class="material-icons text-lg">send</i> Message',
    '    </a>',
    '    <a href="./assets/Aminur670_CV_2026.pdf" download class="hero-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300" style="border:1px solid var(--border);color:var(--text-heading);background:var(--bg-card)">',
    '      <i class="material-icons text-lg">download</i> Download CV',
    '    </a>',
    '    <a href="#/projects" class="hero-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300" style="border:1px solid var(--border);color:var(--text-heading);background:var(--bg-card)">',
    '      View Portfolio <i class="material-icons text-lg">arrow_forward</i>',
    '    </a>',
    '  </div>',
    '',
    '  <!-- Highlights -->',
    '  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">',
    '    <a v-for="(h,i) in highlights" :key="i" :href="\'#\' + h.link" class="card-glass--glass flex items-start gap-3 p-4 rounded-xl" style="text-decoration:none;display:flex">',
    '      <div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 gradient-bg" :style="{animation:\'float 3s ease-in-out infinite\',animationDelay: (i * 0.3) + \'s\'}">',
    '        <i class="material-icons text-white" style="font-size:20px">{{ h.icon }}</i>',
    '      </div>',
    '      <div>',
    '        <h4 class="font-semibold text-lg" style="color:var(--text-heading)">{{ h.title }}</h4>',
    '        <p class="text-md mt-0.5" style="color:var(--text)">{{ h.text }}</p>',
    '      </div>',
    '    </a>',
    '  </div>',
    '',
    '  <!-- Stats -->',
    '  <div class="hero-stats">',
    '    <div v-for="(s,i) in DATA.stats" :key="i" class="flex items-center gap-4">',
    '      <div class="text-center">',
    '        <div class="hero-stat-value">{{ s.value }}</div>',
    '        <div class="text-lg" style="color:var(--text-label)">{{ s.label }}</div>',
    '      </div>',
    '      <div v-if="i < DATA.stats.length-1" style="width:1px;height:40px;background:var(--border)"></div>',
    '    </div>',
    '  </div>',
    '',
    '  <!-- Social Icons (mobile/tablet only) -->',
    '  <div class="flex lg:hidden flex-wrap items-center justify-center gap-2 mt-8">',
    '    <a :href="\'https://\' + DATA.personal.linkedin" target="_blank" class="theme-toggle flex items-center justify-center" title="LinkedIn" style="width:36px;height:36px">',
    '      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68zm1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>',
    '    </a>',
    '    <a :href="DATA.personal.website" target="_blank" class="theme-toggle flex items-center justify-center" title="Portfolio" style="width:36px;height:36px">',
    '      <i class="material-icons" style="font-size:20px">language</i>',
    '    </a>',
    '    <a href="https://github.com/amin670bd" target="_blank" class="theme-toggle flex items-center justify-center" title="GitHub" style="width:36px;height:36px">',
    '      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>',
    '    </a>',
    '    <a href="https://www.youtube.com/@aminur670" target="_blank" class="theme-toggle flex items-center justify-center" title="YouTube" style="width:36px;height:36px">',
    '      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/></svg>',
    '    </a>',
    '    <a :href="\'https://wa.me/\' + DATA.personal.phone1.replace(/[^0-9]/g,\'\')" target="_blank" class="theme-toggle flex items-center justify-center" title="WhatsApp" style="width:36px;height:36px">',
    '      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 2.097.602 4.055 1.638 5.708L2 22l4.374-1.604C8.02 21.378 9.965 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.833 0-3.557-.58-4.973-1.573l-.357-.237-2.597.954.96-2.549-.255-.38A7.956 7.956 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.19-5.94c-.23-.115-1.36-.67-1.57-.746-.21-.077-.363-.115-.516.115-.153.23-.593.746-.727.899-.134.153-.268.172-.498.057-.23-.115-.972-.358-1.85-1.143-.684-.613-1.146-1.37-1.28-1.602-.134-.23-.014-.355.101-.47.103-.103.23-.268.345-.402.115-.134.153-.23.23-.383.077-.153.038-.287-.019-.402-.057-.115-.516-1.244-.707-1.704-.186-.45-.374-.372-.516-.372-.134 0-.287-.019-.44-.019-.153 0-.402.057-.612.287-.21.23-.802.784-.802 1.913s.82 2.22.935 2.373c.115.153 1.614 2.465 3.91 3.456.546.236.972.377 1.305.482.548.173 1.048.149 1.442.09.44-.066 1.36-.555 1.552-1.092.192-.537.192-.997.134-1.093-.057-.096-.21-.153-.44-.268z"/></svg>',
    '    </a>',
    '  </div>',
    '</div>'
  ].join('\n'),
  data() {
    return {
      DATA,
      typeInterval: null,
      roles: ['IT Support Specialist', 'ERP Systems Specialist', 'Web Developer', 'Digital Operations Expert', 'Systems Integrator'],
      currentRole: 'IT Support Specialist',
      roleIndex: 0,
      charIndex: 0,
      isDeleting: false,
      highlights: [
        { icon: 'speed', title: '60% Efficiency Boost', text: 'Reduced packing time with automated weight scale integration', link: '/projects' },
        { icon: 'web', title: '15+ Sites Built', text: 'WordPress, WooCommerce & custom web solutions', link: '/projects' },
        { icon: 'group', title: '100+ Users Managed', text: 'ERP training, IT support & system administration', link: '/experience' }
      ]
    };
  },
  mounted() {
    this.startTypewriter();
  },
  unmounted() {
    if (this.typeInterval) clearInterval(this.typeInterval);
  },
  methods: {
    toggleContactModal() {
      window.__toggleContactModal();
    },
    startTypewriter() {
      this.typeInterval = setInterval(() => {
        const full = this.roles[this.roleIndex];
        if (this.isDeleting) {
          this.charIndex--;
          this.currentRole = full.substring(0, this.charIndex);
          if (this.charIndex === 0) {
            this.isDeleting = false;
            this.roleIndex = (this.roleIndex + 1) % this.roles.length;
          }
        } else {
          this.charIndex++;
          this.currentRole = full.substring(0, this.charIndex);
          if (this.charIndex === full.length) {
            setTimeout(() => { this.isDeleting = true; }, 1500);
          }
        }
      }, 80);
    }
  }
});

// --- ABOUT VIEW ---
const AboutView = defineComponent({
  name: 'AboutView',
  template: [
    '<div class=\"section\">',
    '  <span class=\"section-tag\">About Me</span>',
    '  <h1 class=\"section-title\">Who I Am</h1>',
    '',
    '  <!-- Full-width Visiting Card -->',
    '  <div class=\"card-glass p-6 mb-6\">',
    '    <div class=\"flex flex-col sm:flex-row items-start gap-5\">',
    '      <div class=\"w-full sm:w-44 md:w-52 lg:w-60 shrink-0 rounded-2xl overflow-hidden\" style=\"border:3px solid rgba(20,184,166,0.3)\">',
    '        <img :src=\"DATA.personal.photo\" :alt=\"DATA.personal.name\" class=\"w-full h-auto object-contain\" loading=\"lazy\">',
    '      </div>',
    '      <div class=\"min-w-0 flex-1\">',
    '        <h3 class=\"text-xl font-bold\" style=\"color:var(--text-heading)\">{{ DATA.personal.name }}</h3>',
    '        <p class=\"text-lg font-medium\" style=\"color:var(--primary)\">({{ DATA.personal.nickname }})</p>',
    '        <p class=\"text-base mt-1 font-medium\" style=\"color:var(--text)\">{{ DATA.personal.title }}</p>',
    '        <hr class=\"my-4\" style=\"border-color:var(--border)\">',
    '        <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-base\">',
    '          <div class=\"flex items-center gap-3\">',
    '            <i class=\"material-icons\" style=\"color:var(--primary);font-size:20px\">phone</i>',
    '            <span style=\"color:var(--text)\">{{ DATA.personal.phone1 }} / {{ DATA.personal.phone2 }}</span>',
    '          </div>',
    '          <div class=\"flex items-center gap-3\">',
    '            <i class=\"material-icons\" style=\"color:var(--primary);font-size:20px\">email</i>',
    '            <span style=\"color:var(--text)\">{{ DATA.personal.email }}</span>',
    '          </div>',
    '          <div class=\"flex items-center gap-3\">',
    '            <i class=\"material-icons\" style=\"color:var(--primary);font-size:20px\">location_on</i>',
    '            <span style=\"color:var(--text)\">{{ DATA.personal.location }}</span>',
    '          </div>',
    '          <div class=\"flex items-center gap-3\">',
    '            <svg viewBox=\"0 0 24 24\" width=\"20\" height=\"20\" fill=\"currentColor\" style=\"color:var(--primary)\"><path d=\"M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68zm1.39 9.94v-8.37H5.5v8.37h2.77z\"/></svg>',
    '            <a :href=\"\'https://\' + DATA.personal.linkedin\" target=\"_blank\" style=\"color:var(--primary)\">{{ DATA.personal.linkedin }}</a>',
    '          </div>',
    '          <div class=\"flex items-center gap-3\">',
    '            <i class=\"material-icons\" style=\"color:var(--primary);font-size:20px\">language</i>',
    '            <a :href=\"DATA.personal.website\" target=\"_blank\" style=\"color:var(--primary)\">amin670bd.github.io</a>',
    '          </div>',
    '        </div>',
    '        <div class=\"flex flex-wrap items-center gap-2 mt-4 pt-3\" style=\"border-top:1px solid var(--border)\">',
    '          <a :href=\"\'https://\' + DATA.personal.linkedin\" target=\"_blank\" class=\"theme-toggle flex items-center justify-center\" title=\"LinkedIn\" style=\"width:36px;height:36px\">',
    '            <svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"currentColor\"><path d=\"M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68zm1.39 9.94v-8.37H5.5v8.37h2.77z\"/></svg>',
    '          </a>',
    '          <a :href=\"DATA.personal.website\" target=\"_blank\" class=\"theme-toggle flex items-center justify-center\" title=\"Portfolio\" style=\"width:36px;height:36px\">',
    '            <i class=\"material-icons\" style=\"font-size:20px\">language</i>',
    '          </a>',
    '          <a href=\"https://github.com/amin670bd\" target=\"_blank\" class=\"theme-toggle flex items-center justify-center\" title=\"GitHub\" style=\"width:36px;height:36px\">',
    '            <svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"currentColor\"><path d=\"M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z\"/></svg>',
    '          </a>',
    '          <a href=\"https://www.youtube.com/@aminur670\" target=\"_blank\" class=\"theme-toggle flex items-center justify-center\" title=\"YouTube\" style=\"width:36px;height:36px\">',
    '            <svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"currentColor\"><path d=\"M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z\"/></svg>',
    '          </a>',
    '          <a :href=\"\'https://wa.me/\' + DATA.personal.phone1.replace(/[^0-9]/g,\'\')\" target=\"_blank\" class=\"theme-toggle flex items-center justify-center\" title=\"WhatsApp\" style=\"width:36px;height:36px\">',
    '            <svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"currentColor\"><path d=\"M12 2C6.477 2 2 6.477 2 12c0 2.097.602 4.055 1.638 5.708L2 22l4.374-1.604C8.02 21.378 9.965 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.833 0-3.557-.58-4.973-1.573l-.357-.237-2.597.954.96-2.549-.255-.38A7.956 7.956 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.19-5.94c-.23-.115-1.36-.67-1.57-.746-.21-.077-.363-.115-.516.115-.153.23-.593.746-.727.899-.134.153-.268.172-.498.057-.23-.115-.972-.358-1.85-1.143-.684-.613-1.146-1.37-1.28-1.602-.134-.23-.014-.355.101-.47.103-.103.23-.268.345-.402.115-.134.153-.23.23-.383.077-.153.038-.287-.019-.402-.057-.115-.516-1.244-.707-1.704-.186-.45-.374-.372-.516-.372-.134 0-.287-.019-.44-.019-.153 0-.402.057-.612.287-.21.23-.802.784-.802 1.913s.82 2.22.935 2.373c.115.153 1.614 2.465 3.91 3.456.546.236.972.377 1.305.482.548.173 1.048.149 1.442.09.44-.066 1.36-.555 1.552-1.092.192-.537.192-.997.134-1.093-.057-.096-.21-.153-.44-.268z\"/></svg>',
    '          </a>',
    '        </div>',
    '      </div>',
    '    </div>',
    '  </div>',
    '',
    '  <div class=\"grid grid-cols-1 lg:grid-cols-5 gap-6\">',
    '',
    '    <!-- Left Column -->',
    '    <div class=\"lg:col-span-2 space-y-5\">',
    '',
    '      <!-- Personal Details -->',
    '      <div class=\"card-glass p-6\">',
    '        <h4 class=\"text-lg font-bold mb-3 flex items-center gap-2\" style=\"color:var(--text-heading)\"><i class=\"material-icons\" style=\"color:var(--primary);font-size:18px\">badge</i> Personal Details</h4>',
    '        <div class=\"space-y-2\">',
    '          <div class=\"flex justify-between py-1\" style=\"border-bottom:1px solid var(--border)\"><span class=\"text-sm\" style=\"color:var(--text-label)\">Date of Birth</span><span class=\"font-medium\" style=\"color:var(--text-heading)\">{{ DATA.personal.dob }}</span></div>',
    '          <div class=\"flex justify-between py-1\" style=\"border-bottom:1px solid var(--border)\"><span class=\"text-sm\" style=\"color:var(--text-label)\">Blood Group</span><span class=\"font-medium\" style=\"color:var(--text-heading)\">{{ DATA.personal.blood }}</span></div>',
    '          <div class=\"flex justify-between py-1\" style=\"border-bottom:1px solid var(--border)\"><span class=\"text-sm\" style=\"color:var(--text-label)\">Religion</span><span class=\"font-medium\" style=\"color:var(--text-heading)\">{{ DATA.personal.religion }}</span></div>',
    '        </div>',
    '      </div>',
    '',
    '      <!-- Languages -->',
    '      <div class=\"card-glass p-6\">',
    '        <h4 class=\"text-lg font-bold mb-3 flex items-center gap-2\" style=\"color:var(--text-heading)\"><i class=\"material-icons\" style=\"color:var(--primary);font-size:18px\">translate</i> Languages</h4>',
    '        <div class=\"space-y-3\">',
    '          <div v-for=\"l in DATA.languages\" :key=\"l.name\">',
    '            <div class=\"flex justify-between mb-1\"><span>{{ l.name }}</span><span class=\"text-sm\" style=\"color:var(--text-label)\">{{ l.level }}</span></div>',
    '            <div class=\"skill-bar-track\"><div class=\"skill-bar-fill\" :style=\"{ width: l.pct + \'%\' }\"></div></div>',
    '          </div>',
    '        </div>',
    '      </div>',
    '',
    '      <!-- Employment Details -->',
    '      <div class=\"card-glass p-6\">',
    '        <h4 class=\"text-lg font-bold mb-3 flex items-center gap-2\" style=\"color:var(--text-heading)\"><i class=\"material-icons\" style=\"color:var(--primary);font-size:18px\">work</i> Employment Details</h4>',
    '        <div class=\"space-y-2\">',
    '          <div class=\"flex justify-between py-1\" style=\"border-bottom:1px solid var(--border)\"><span class=\"text-sm\" style=\"color:var(--text-label)\">Available</span><span class=\"font-medium\" style=\"color:var(--text-heading)\">{{ DATA.personal.available }}</span></div>',
    '          <div class=\"flex justify-between py-1\"><span class=\"text-sm\" style=\"color:var(--text-label)\">Location</span><span class=\"font-medium\" style=\"color:var(--text-heading)\">{{ DATA.personal.location }}</span></div>',
    '        </div>',
    '      </div>',
    '',
    '    </div>',
    '',
    '    <!-- Right Column -->',
    '    <div class=\"lg:col-span-3 space-y-5\">',
    '',
    '      <!-- Objective -->',
    '      <div class=\"card-glass p-6\">',
    '        <h3 class=\"text-lg font-bold mb-4 flex items-center gap-3\" style=\"color:var(--text-heading)\"><i class=\"material-icons\" style=\"color:var(--primary)\">psychology</i> Career Objective</h3>',
    '        <p class=\"text-base leading-relaxed\" style=\"color:var(--text)\">{{ DATA.objective }}</p>',
    '      </div>',
    '',
    '      <!-- Professional Summary + Stats -->',
    '      <div class=\"card-glass p-6\">',
    '        <h3 class=\"text-lg font-bold mb-4 flex items-center gap-3\" style=\"color:var(--text-heading)\"><i class=\"material-icons\" style=\"color:var(--primary)\">assignment</i> Professional Summary</h3>',
    '        <p class=\"text-base leading-relaxed mb-5\" style=\"color:var(--text)\">{{ DATA.summary }}</p>',
    '        <div class=\"grid grid-cols-3 gap-3\">',
    '          <div v-for=\"s in DATA.stats\" :key=\"s.label\" class=\"text-center py-4 rounded-xl\" style=\"background:rgba(20,184,166,0.06);border:1px solid rgba(20,184,166,0.1)\">',
    '            <div class=\"text-2xl font-extrabold gradient-text\">{{ s.value }}</div>',
    '            <div class=\"text-md font-medium mt-1\" style=\"color:var(--text-label)\">{{ s.label }}</div>',
    '          </div>',
    '        </div>',
    '      </div>',
    '',
    '    </div>',
    '  </div>',
    '</div>'
  ].join('\n'),
  data() { return { DATA }; },
  mounted() {
    // fade handled by Vue transition
  }
});

// --- SKILLS VIEW ---
const SkillsView = defineComponent({
  name: 'SkillsView',
  template: [
    '<div class=\"section\">',
    '  <span class=\"section-tag\">Tech Stack Matrix</span>',
    '  <h1 class=\"section-title\">Technical & Creative Inventory</h1>',
    '  <div class=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5\">',
    '    <div v-for=\"(skill,i) in DATA.skills\" :key=\"i\" class=\"card-glass p-5\">',
    '      <h3 class=\"text-lg font-bold mb-4 flex items-center gap-2\" style=\"color:var(--text-heading)\">',
    '        <i class=\"material-icons text-lg\" style=\"color:var(--primary)\">{{ skill.icon }}</i> {{ skill.title }}',
    '      </h3>',
    '      <div class=\"flex flex-wrap\">',
    '        <span v-for=\"(item,j) in skill.items\" :key=\"j\" class=\"skill-pill\">{{ item }}</span>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join('\n'),
  data() { return { DATA }; },
  mounted() {
    // fade handled by Vue transition
  }
});

// --- EXPERIENCE VIEW ---
const ExperienceView = defineComponent({
  name: 'ExperienceView',
  template: [
    '<div class=\"section\">',
    '  <span class=\"section-tag\">Career Trajectory</span>',
    '  <h1 class=\"section-title\">Employment History</h1>',
    '  <div class=\"timeline \">',
    '    <div v-for=\"(exp,i) in DATA.experience\" :key=\"i\" class=\"timeline-item\">',
    '      <div class=\"timeline-dot\"></div>',
    '      <span class=\"timeline-date\">{{ exp.period }}</span>',
    '      <h3 class=\"text-lg font-bold\" style=\"color:var(--text-heading)\">{{ exp.title }}</h3>',
    '      <p class=\"text-base sm:text-lg font-medium mb-2\" style=\"color:var(--primary)\">{{ exp.company }} <span style=\"color:var(--text-label)\">| {{ exp.location }}</span></p>',
    '      <ul class=\"space-y-1 text-md\" style=\"color:var(--text)\">',
    '        <li v-for=\"(h,j) in exp.highlights\" :key=\"j\" class=\"flex items-start gap-2 text-base\">',
    '          <i class=\"material-icons\" style=\"font-size:10px;color:var(--primary);margin-top:7px;line-height:1\">circle</i>',
    '          <span>{{ h }}</span>',
    '        </li>',
    '      </ul>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join('\n'),
  data() { return { DATA }; },
  mounted() {
    // fade handled by Vue transition
  }
});

// --- EDUCATION VIEW ---
const EducationView = defineComponent({
  name: 'EducationView',
  template: [
    '<div class=\"section\">',
    '  <span class=\"section-tag\">Knowledge Base</span>',
    '  <h1 class=\"section-title\">Education &amp; Certifications</h1>',
    '',
    '  <h3 class=\"text-lg font-bold mb-4 flex items-center gap-3\" style=\"color:var(--text-heading)\">',
    '    <i class=\"material-icons\" style=\"color:var(--primary)\">school</i> Education',
    '  </h3>',
    '  <div class=\"timeline\">',
    '    <div v-for=\"(e,i) in DATA.education\" :key=\"i\" class=\"timeline-item\">',
    '      <div class=\"timeline-dot\"></div>',
    '',
    '      <!-- Degree Header -->',
    '      <div class=\"flex items-start gap-4\">',
    '        <h4 class=\"font-semibold text-lg flex items-center gap-2\" style=\"color:var(--text-heading)\">',
    '          <i class=\"material-icons\" style=\"color:var(--primary);font-size:22px\">{{ e.icon }}</i> {{ e.degree }}',
    '        </h4>',
    '        <span class=\"timeline-date shrink-0\">{{ e.year }}</span>',
    '      </div>',
    '      <p class=\"text-base mt-0.5\" style=\"color:var(--text)\">{{ e.school }}<span style=\"color:var(--text-label)\"> � {{ e.location }}</span></p>',
    '',
    '      <!-- Academic Performance -->',
    '      <div class=\"mt-4\">',
    '        <p class=\"text-base font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5\" style=\"color:var(--text-label)\"><i class=\"material-icons\" style=\"font-size:16px\">bar_chart</i> Academic Performance</p>',
    '        <div class=\"flex items-center gap-3\">',
    '          <div class=\"flex-1 max-w-[220px]\">',
    '            <div class=\"skill-bar-track\"><div class=\"skill-bar-fill\" :style=\"{ width: ((e.gradeValue/e.gradeMax)*100) + \'%\' }\"></div></div>',
    '          </div>',
    '          <span class=\"text-sm font-semibold\" style=\"color:var(--primary)\">{{ Math.round((e.gradeValue/e.gradeMax)*100) }}%</span>',
    '          <span class=\"text-sm font-medium\" style=\"color:var(--text-label)\">{{ e.grade }}</span>',
    '        </div>',
    '      </div>',
    '',
    '      <!-- Core Skills -->',
    '      <div class=\"mt-4\">',
    '        <p class=\"text-base font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5\" style=\"color:var(--text-label)\"><i class=\"material-icons\" style=\"font-size:16px\">build</i> Core Skills Acquired</p>',
    '        <div class=\"flex flex-wrap gap-1.5\">',
    '          <span v-for=\"skill in e.skills\" :key=\"skill\" class=\"skill-pill\">{{ skill }}</span>',
    '        </div>',
    '      </div>',
    '',
    '      <!-- Key Projects & Achievements -->',
    '      <div class=\"mt-4\">',
    '        <p class=\"text-base font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5\" style=\"color:var(--text-label)\"><i class=\"material-icons\" style=\"font-size:16px\">emoji_events</i> Key Projects & Achievements</p>',
    '        <ul class=\"space-y-1.5\">',
    '          <li v-for=\"(a,j) in e.achievements\" :key=\"j\" class=\"flex items-start gap-2 text-base\" style=\"color:var(--text)\">',
    '            <span v-if=\"a.award\" style=\"color:#f59e0b;margin-top:2px;flex-shrink:0\">??</span>',
    '            <span v-else style=\"color:var(--primary);margin-top:7px;flex-shrink:0;line-height:1\"><span class=\"material-icons\" style=\"font-size:10px\">circle</span></span>',
    '            <span>{{ a.text }}</span>',
    '          </li>',
    '        </ul>',
    '      </div>',
    '    </div>',
    '  </div>',
    '',
    '  <h3 class=\"text-lg font-bold mt-10 mb-4 flex items-center gap-3\" style=\"color:var(--text-heading)\">',
    '    <i class=\"material-icons\" style=\"color:var(--primary)\">verified</i> Training &amp; Certifications',
    '  </h3>',
    '  <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4\">',
    '    <div v-for=\"(t,i) in DATA.training\" :key=\"i\" class=\"card-glass p-5\">',
    '      <h4 class=\"font-semibold text-lg flex items-center gap-2\" style=\"color:var(--text-heading)\">',
    '        <i class=\"material-icons\" style=\"color:var(--primary);font-size:20px\">{{ t.icon }}</i> {{ t.title }}',
    '      </h4>',
    '      <div class=\"flex flex-wrap gap-1.5 mt-2\">',
    '        <span v-for=\"topic in t.topics\" :key=\"topic\" class=\"skill-pill\">{{ topic }}</span>',
    '      </div>',
    '      <div class=\"flex items-center gap-3 mt-3 text-sm\" style=\"color:var(--text-label)\">',
    '        <span class=\"flex items-center gap-1\"><i class=\"material-icons\" style=\"font-size:14px\">business</i> {{ t.institution }}</span>',
    '        <span class=\"flex items-center gap-1\"><i class=\"material-icons\" style=\"font-size:14px\">schedule</i> {{ t.duration }}</span>',
    '        <span class=\"flex items-center gap-1\"><i class=\"material-icons\" style=\"font-size:14px\">calendar_today</i> {{ t.year }}</span>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join('\n'),
  data() { return { DATA }; },
  mounted() {
    // fade handled by Vue transition
  }
});

// --- PROJECTS VIEW ---
const ProjectsView = defineComponent({
  name: 'ProjectsView',
  data() {
    return {
      DATA,
      activeFilter: 'all',
      selectedYear: 'all',
      featSlide: 0,
      featImages: null,
      featProjectMeta: null,
      featSlideTimer: null
    };
  },
  computed: {
    allProjects() {
      const items = [];
      this.DATA.projectCategories.forEach(cat => {
        cat.items.forEach(item => {
          items.push({ ...item, categoryKey: cat.key, categoryName: cat.name, categoryIcon: cat.icon });
        });
      });
      return items;
    },
    availableYears() {
      const years = new Set();
      this.allProjects.forEach(p => { if (p.date) years.add(p.date.substring(0,4)); });
      return [...years].sort().reverse();
    },
    filteredProjects() {
      let items = this.activeFilter === 'all' ? this.allProjects : this.allProjects.filter(p => p.categoryKey === this.activeFilter);
      if (this.selectedYear !== 'all') items = items.filter(p => p.date && p.date.startsWith(this.selectedYear));
      return items;
    },
    featSlideImages() {
      if (this.featImages) return this.featImages;
      const fallback = this.DATA.featuredProject.images || [];
      return fallback.map(f => typeof f === 'string' ? { src: f, title: '', desc: '' } : f);
    }
  },
  methods: {
    setFilter(key) { this.activeFilter = key; },
    setYear(year) { this.selectedYear = year; },
    prevFeat() { this.featSlide = this.featSlide > 0 ? this.featSlide - 1 : this.featSlideImages.length - 1; this.stopFeatSlide(); this.startFeatSlide(); },
    nextFeat() { this.featSlide = this.featSlide < this.featSlideImages.length - 1 ? this.featSlide + 1 : 0; this.stopFeatSlide(); this.startFeatSlide(); },
    goFeat(i) { this.featSlide = i; this.stopFeatSlide(); this.startFeatSlide(); },
    startFeatSlide() { if (this.featSlideTimer) clearInterval(this.featSlideTimer); this.featSlideTimer = setInterval(this.nextFeat, 3000); },
    stopFeatSlide() { if (this.featSlideTimer) { clearInterval(this.featSlideTimer); this.featSlideTimer = null; } }
  },
  mounted() {
    const id = this.DATA.featuredProject.id;
    if (!id) return;
    fetch('assets/images/projects/' + id + '/project-image.json')
      .then(r => r.ok ? r.json() : { images: [] })
      .then(data => {
        if (data.images && data.images.length) this.featImages = data.images.map(f => typeof f === 'string' ? { src: 'assets/images/projects/' + id + '/' + f, title: '', desc: '' } : { ...f, src: 'assets/images/projects/' + id + '/' + f.src });
        if (data.title) this.featProjectMeta = { title: data.title, company: data.company, tech: data.tech, description: data.description };
        this.startFeatSlide();
      })
      .catch(() => { this.startFeatSlide(); });
  },
  unmounted() { this.stopFeatSlide(); },
  template: [
    '<div class=\"section\">',
    '  <span class=\"section-tag\">Case Studies</span>',
    '  <h1 class=\"section-title\">Key Projects & Recent Works</h1>',
    '',
    '  <!-- Featured Project -->',
    '  <div v-if=\"DATA.featuredProject.title\" class=\"card-glass-alt p-6 lg:p-8 mb-10\">',
    '    <span class=\"inline-block text-md font-bold px-3 py-1 rounded-full mb-4 gradient-bg text-white\">?? Top Achievement</span>',
    '    <h3 class=\"text-xl lg:text-2xl font-extrabold mb-4\" style=\"color:var(--sidebar-heading)\">{{ DATA.featuredProject.title }}</h3>',
    '    <div v-if=\"featSlideImages.length\" class=\"relative rounded-xl overflow-hidden\" style=\"border:1px solid var(--sidebar-divider);aspect-ratio:16/9;background:var(--bg-card)\" @mouseenter=\"stopFeatSlide\" @mouseleave=\"startFeatSlide\">',
    '      <img :src=\"typeof featSlideImages[featSlide] === \'string\' ? featSlideImages[featSlide] : featSlideImages[featSlide].src\" :alt=\"DATA.featuredProject.title + \' screenshot\'\" class=\"w-full h-full\" style=\"object-fit:contain\" loading=\"lazy\">',
    '    </div>',
    '    <!-- Text above mini gallery -->',
    '    <div class=\"mt-2 mb-3\" style=\"background:var(--bg-card);padding:8px 14px;border-radius:8px;border:1px solid var(--border)\">',
    '      <h4 class=\"text-lg font-bold\" style=\"color:var(--text-heading)\">{{ typeof featSlideImages[featSlide] !== \'string\' && featSlideImages[featSlide].title ? featSlideImages[featSlide].title : featProjectMeta?.title || DATA.featuredProject.title }}</h4>',
    '      <p class=\"text-base mt-1\" style=\"color:var(--text-label)\">{{ typeof featSlideImages[featSlide] !== \'string\' && featSlideImages[featSlide].desc ? featSlideImages[featSlide].desc : featProjectMeta?.description || DATA.featuredProject.description }}</p>',
    '    </div>',
    '    <!-- Mini Gallery + Controls -->',
    '    <div v-if=\"featSlideImages.length > 1\" class=\"flex items-center gap-2 mt-2 mb-6\">',
    '      <button @click=\"prevFeat\" aria-label=\"Previous slide\" class=\"flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110\" style=\"background:var(--bg-card);color:var(--text-heading);border:1px solid var(--border);cursor:pointer\">',
    '        <i class=\"material-icons\" style=\"font-size:18px\">chevron_left</i>',
    '      </button>',
    '      <div class=\"flex items-center gap-2 overflow-x-auto pb-1 flex-1\" style=\"scrollbar-width:thin\">',
    '        <button v-for=\"(img,i) in featSlideImages\" :key=\"i\" @click=\"goFeat(i)\" :aria-label=\"\'Go to slide \' + (i+1)\" class=\"flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300\" :style=\"{border:i===featSlide?\'2px solid var(--primary)\':\'2px solid transparent\',opacity:i===featSlide?1:0.5,cursor:\'pointer\',padding:0,background:\'var(--bg-card)\'}\">',
    '          <img :src=\"typeof img === \'string\' ? img : img.src\" :alt=\"DATA.featuredProject.title + \' thumbnail\'\" style=\"width:80px;height:60px;object-fit:cover;display:block\" loading=\"lazy\">',
    '        </button>',
    '      </div>',
    '      <button @click=\"nextFeat\" aria-label=\"Next slide\" class=\"flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110\" style=\"background:var(--bg-card);color:var(--text-heading);border:1px solid var(--border);cursor:pointer\">',
    '        <i class=\"material-icons\" style=\"font-size:18px\">chevron_right</i>',
    '      </button>',
    '    </div>',
    '    <!-- Project info loaded from project-image.json -->',
    '    <div v-if=\"featProjectMeta\" class=\"card-glass p-4 rounded-xl mb-4\">',
    '      <h4 class=\"text-sm font-extrabold gradient-text mb-1\">{{ featProjectMeta.title }}</h4>',
    '      <p class=\"text-xs\" style=\"color:var(--text-label)\" v-if=\"featProjectMeta.company\">{{ featProjectMeta.company }}</p>',
    '      <p class=\"text-xs\" style=\"color:var(--primary)\" v-if=\"featProjectMeta.tech\">{{ featProjectMeta.tech }}</p>',
    '      <p class=\"text-xs mt-1\" style=\"color:var(--text)\" v-if=\"featProjectMeta.description\">{{ featProjectMeta.description }}</p>',
    '    </div>',
    '    <p class=\"text-md mb-2\" v-if=\"DATA.featuredProject.tech\"><span class=\"font-semibold\">Technologies:</span> {{ DATA.featuredProject.tech }}</p>',
    '    <p class=\"text-md mb-4\" v-if=\"DATA.featuredProject.company\"><span class=\"font-semibold\">Company:</span> {{ DATA.featuredProject.company }}</p>',
    '    <ul class=\"space-y-2 text-md mb-5\" v-if=\"DATA.featuredProject.details\">',
    '      <li v-for=\"(d,i) in DATA.featuredProject.details\" :key=\"i\" class=\"flex items-start gap-2\">',
    '        <i class=\"material-icons\" style=\"color:var(--primary-light);font-size:18px;margin-top:3px\">check_circle</i>',
    '        <span>{{ d }}</span>',
    '      </li>',
    '    </ul>',
    '    <a :href=\"\'#/project/\' + DATA.featuredProject.id\" class=\"inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-bg text-white text-lg font-semibold transition\" v-if=\"DATA.featuredProject.id\">',
    '      Project Details <i class=\"material-icons\" style=\"font-size:14px\">open_in_new</i>',
    '    </a>',
    '  </div>',
    '',
    '  <!-- All Projects Grid -->',
    '  <span class=\"section-tag\">All Works</span>',
    '  <h2 class=\"section-title\">Projects & Client Works</h2>',
    '  <div class=\"sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 mb-6 pt-4 pb-3 -mx-6 px-6\" style=\"background:var(--bg);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid var(--border)\" v-if=\"allProjects.length\">',
    '    <div class=\"flex flex-wrap gap-2 items-center\">',
    '      <button v-for=\"cat in [{key:\'all\',label:\'All\'}].concat(DATA.projectCategories.map(c=>({key:c.key,label:c.name})))\" :key=\"cat.key\"',
    '        @click=\"setFilter(cat.key)\"',
    '        class=\"project-filter-btn\" :class=\"{ active: activeFilter === cat.key }\">',
    '        {{ cat.label }}',
    '      </button>',
    '    </div>',
    '    <div class=\"flex items-center gap-1.5 shrink-0\">',
    '      <span class=\"text-sm font-medium\" style=\"color:var(--text-label)\">Year:</span>',
    '      <select v-model=\"selectedYear\" @change=\"setYear(selectedYear)\" class=\"text-sm font-medium px-2 py-1 rounded-lg\" style=\"background:var(--bg-card);color:var(--text-heading);border:1px solid var(--border);cursor:pointer;outline:none\">',
    '        <option value=\"all\">All</option>',
    '        <option v-for=\"y in availableYears\" :key=\"y\" :value=\"y\">{{ y }}</option>',
    '      </select>',
    '    </div>',
    '  </div>',
    '  <div',
    '    :key=\"activeFilter + \'-\' + selectedYear\"',
    '    class=\"grid grid-cols-1 sm:grid-cols-2 gap-6\"',
    '    v-if=\"filteredProjects.length\"',
    '  >',
    '    <div',
    '      v-for=\"(project, i) in filteredProjects\"',
    '      :key=\"project.id || i\"',
    '      class=\"project-card-item rounded-xl p-5 flex flex-col\"',
    '    >',
    '      <div class=\"flex items-center justify-between mb-3\">',
    '        <span',
    '          class=\"project-cat-tag text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1\"',
    '        >',
    '          <i class=\"material-icons text-xs\">{{ project.categoryIcon }}</i>',
    '          {{ project.categoryName }}',
    '        </span>',
    '        <div class=\"flex items-center gap-2 min-w-0\">',
    '          <span',
    '            v-if=\"project.date\"',
    '            class=\"text-xs font-medium px-2 py-0.5 rounded shrink-0\"',
    '            style=\"background:rgba(20,184,166,0.12);color:var(--primary-light)\"',
    '          >',
    '            {{ project.date.substring(0,4) }}',
    '          </span>',
    '          <span',
    '            v-if=\"project.tech\"',
    '            class=\"text-xs truncate\"',
    '            style=\"color:var(--text-label)\"',
    '          >',
    '            {{ project.tech }}',
    '          </span>',
    '        </div>',
    '      </div>',
    '',
    '      <a',
    '        v-if=\"project.id\"',
    '        :href=\"\'#/project/\' + project.id\"',
    '        class=\"project-title-link font-semibold text-base\"',
    '      >',
    '        {{ project.title }}',
    '      </a>',
    '      <span',
    '        v-else',
    '        class=\"font-semibold text-base\"',
    '        style=\"color:var(--text-heading)\"',
    '      >',
    '        {{ project.title }}',
    '      </span>',
    '',
    '      <p',
    '        class=\"text-base mt-2 mb-4 leading-relaxed\"',
    '        style=\"color:var(--text)\"',
    '      >',
    '        {{ project.description }}',
    '      </p>',
    '',
    '      <a',
    '        v-if=\"project.id\"',
    '        :href=\"\'#/project/\' + project.id\"',
    '        class=\"btn-outline self-start mt-auto\"',
    '      >',
    '        View Details',
    '        <i class=\"material-icons text-xs\">arrow_forward</i>',
    '      </a>',
    '    </div>',
    '  </div>',
    '',
    '  <div v-if=\"!allProjects.length && !DATA.featuredProject.title\" class=\"text-center py-8\" style=\"color:var(--text-muted)\">',
    '    Loading projects...',
    '  </div>',
    '</div>'
  ].join('\n'),
  mounted() {
    // fade handled by Vue transition
  }
});

// --- PROJECT DETAIL VIEW ---
const ProjectDetailView = defineComponent({
  name: 'ProjectDetailView',
  data() {
    return { DATA, currentSlide: 0, projectImages: null, projectMeta: null, slideTimer: null };
  },
  computed: {
    project() {
      const id = this.$route.params.id;
      return this.DATA.projectDetails[id] || null;
    },
    slideImages() {
      if (this.projectImages) return this.projectImages;
      const fallback = this.project?.images || [];
      return fallback.map(f => typeof f === 'string' ? { src: f, title: '', desc: '' } : f);
    }
  },
  methods: {
    placeholderImg(e) {
      e.target.style.display = 'none';
      const parent = e.target.parentElement;
      const ph = document.createElement('div');
      ph.className = 'img-placeholder';
      parent.appendChild(ph);
    },
    prevSlide() {
      this.currentSlide = this.currentSlide > 0 ? this.currentSlide - 1 : this.slideImages.length - 1;
      this.stopAutoSlide(); this.startAutoSlide();
    },
    nextSlide() {
      this.currentSlide = this.currentSlide < this.slideImages.length - 1 ? this.currentSlide + 1 : 0;
      this.stopAutoSlide(); this.startAutoSlide();
    },
    goToSlide(i) { this.currentSlide = i; this.stopAutoSlide(); this.startAutoSlide(); },
    startAutoSlide() { if (this.slideTimer) clearInterval(this.slideTimer); if (this.slideImages.length > 1) this.slideTimer = setInterval(this.nextSlide, 3000); },
    stopAutoSlide() { if (this.slideTimer) { clearInterval(this.slideTimer); this.slideTimer = null; } },
    loadProjectImages() {
      const id = this.$route.params.id;
      if (!id) return;
      this.currentSlide = 0;
      this.projectImages = null;
      this.projectMeta = null;
      fetch('assets/images/projects/' + id + '/project-image.json')
        .then(r => r.ok ? r.json() : { images: [] })
        .then(data => {
          if (data.images && data.images.length) this.projectImages = data.images.map(f => typeof f === 'string' ? { src: 'assets/images/projects/' + id + '/' + f, title: '', desc: '' } : { ...f, src: 'assets/images/projects/' + id + '/' + f.src });
          if (data.title) this.projectMeta = { title: data.title, company: data.company, tech: data.tech, description: data.description };
          this.startAutoSlide();
        })
        .catch(() => { this.startAutoSlide(); });
    }
  },
  mounted() {
    this.loadProjectImages();
  },
  unmounted() { this.stopAutoSlide(); },
  template: [
    '<div v-if=\"project\">',
    '  <!-- Breadcrumb Nav (desktop/tablet only) -->',
    '  <div class=\"hidden lg:flex items-center gap-2 text-sm font-medium px-6 py-3 sticky top-0 z-20\" style=\"background:var(--bg);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid var(--border);color:var(--text-label)\">',
    '    <a href=\"#/\" style=\"color:var(--primary)\" class=\"hover:underline\">Home</a>',
    '    <i class=\"material-icons\" style=\"font-size:14px\">chevron_right</i>',
    '    <a href=\"#/projects\" style=\"color:var(--primary)\" class=\"hover:underline\">Projects</a>',
    '    <i class=\"material-icons\" style=\"font-size:14px\">chevron_right</i>',
    '    <span class=\"truncate max-w-xs\" style=\"color:var(--text-heading)\">{{ project.title }}</span>',
    '  </div>',
    '  <!-- Hero Glass Card -->',
    '  <div class=\"px-4 sm:px-8 lg:px-16 mb-6 project-detail-hero\">',
    '    <div class=\"rounded-xl\" style=\"background:var(--bg-card);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid var(--border);padding:clamp(20px,4vw,36px);margin-top:clamp(16px,3vw,32px)\">',
    '      <div class=\"flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3\">',
    '        <div class=\"flex-1 min-w-0\">',
    '          <span v-if=\"project.id === DATA.featuredProject.id || project.featured\" class=\"inline-block text-xs font-bold px-3 py-1 rounded-full mb-3\" style=\"background:rgba(20,184,166,0.15);color:var(--primary-light)\">TOP ACHIEVEMENT</span>',
    '          <h1 class=\"font-extrabold gradient-text\" style=\"font-size:clamp(1.5rem,4vw,2.2rem);line-height:1.2\">{{ project.title }}</h1>',
    '          <p class=\"text-sm sm:text-base mt-1\" style=\"color:var(--text-label)\">{{ project.subtitle }}</p>',
    '        </div>',
    '        <div class=\"flex-shrink-0 sm:text-right flex flex-col items-end gap-3\" v-if=\"project.company || project.date\">',
    '          <div v-if=\"project.date\" class=\"sm:text-right\">',
    '            <small style=\"opacity:0.5;display:block;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.5px\">Year</small>',
    '            <strong style=\"color:var(--text-heading);font-size:clamp(0.95rem,2vw,1.15rem)\">{{ project.date.substring(0,4) }}</strong>',
    '          </div>',
    '          <div v-if=\"project.company\" class=\"sm:text-right\">',
    '            <small style=\"opacity:0.5;display:block;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.5px\">Company</small>',
    '            <strong style=\"color:var(--text-heading);font-size:clamp(0.95rem,2vw,1.15rem)\">{{ project.company }}</strong>',
    '          </div>',
    '        </div>',
    '      </div>',
    '      <div v-if=\"projectMeta\" class=\"mt-5 pt-4\" style=\"border-top:1px solid var(--border)\">',
    '        <div class=\"flex flex-wrap items-center gap-2 mb-3\" v-if=\"projectMeta.tech\">',
    '          <span v-for=\"t in projectMeta.tech.split(\',\').map(s=>s.trim())\" :key=\"t\" class=\"text-xs font-medium px-3 py-1 rounded-full\" style=\"background:rgba(20,184,166,0.12);color:var(--primary-light)\">{{ t }}</span>',
    '        </div>',
    '        <p style=\"color:var(--text);font-size:clamp(0.85rem,1.5vw,0.95rem);line-height:1.7\" v-if=\"projectMeta.description\">{{ projectMeta.description }}</p>',
    '      </div>',
    '    </div>',
    '  </div>',
    '',
    '  <!-- Featured Image / Slider -->',
    '  <div v-if=\"slideImages.length\" class=\"px-4 sm:px-8 lg:px-16 mb-6\">',
    '    <div class=\"relative rounded-xl overflow-hidden\" style=\"border:1px solid var(--border);box-shadow:var(--shadow-lg);aspect-ratio:16/9;background:var(--bg-card)\" @mouseenter=\"stopAutoSlide\" @mouseleave=\"startAutoSlide\">',
    '      <img :src=\"typeof slideImages[currentSlide] === \'string\' ? slideImages[currentSlide] : slideImages[currentSlide].src\" :alt=\"project.title + \' screenshot\'\" @error=\"placeholderImg\" class=\"w-full h-full\" style=\"object-fit:contain\" loading=\"lazy\">',
    '    </div>',
    '    <!-- Text above mini gallery -->',
    '    <div class=\"mt-2 mb-3\" style=\"background:var(--bg-card);padding:8px 14px;border-radius:8px;border:1px solid var(--border)\">',
    '      <h4 class=\"text-lg font-bold\" style=\"color:var(--text-heading)\">{{ typeof slideImages[currentSlide] !== \'string\' && slideImages[currentSlide].title ? slideImages[currentSlide].title : projectMeta?.title || project.title }}</h4>',
    '      <p class=\"text-base mt-1\" style=\"color:var(--text-label)\">{{ typeof slideImages[currentSlide] !== \'string\' && slideImages[currentSlide].desc ? slideImages[currentSlide].desc : projectMeta?.description || project.abstract }}</p>',
    '    </div>',
    '    <!-- Mini Gallery + Controls -->',
    '    <div v-if=\"slideImages.length > 1\" class=\"flex items-center gap-2 mt-2\">',
    '      <button @click=\"prevSlide\" aria-label=\"Previous slide\" class=\"flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110\" style=\"background:var(--bg-card);color:var(--text-heading);border:1px solid var(--border);cursor:pointer\">',
    '        <i class=\"material-icons\" style=\"font-size:18px\">chevron_left</i>',
    '      </button>',
    '      <div class=\"flex items-center gap-2 overflow-x-auto pb-1 flex-1\" style=\"scrollbar-width:thin\">',
    '        <button v-for=\"(img,i) in slideImages\" :key=\"i\" @click=\"goToSlide(i)\" :aria-label=\"\'Go to slide \' + (i+1)\" class=\"flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300\" :style=\"{border:i===currentSlide?\'2px solid var(--primary)\':\'2px solid transparent\',opacity:i===currentSlide?1:0.5,cursor:\'pointer\',padding:0,background:\'var(--bg-card)\'}\">',
    '          <img :src=\"typeof img === \'string\' ? img : img.src\" :alt=\"project.title + \' thumbnail\'\" style=\"width:80px;height:60px;object-fit:cover;display:block\" loading=\"lazy\">',
    '        </button>',
    '      </div>',
    '      <button @click=\"nextSlide\" aria-label=\"Next slide\" class=\"flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110\" style=\"background:var(--bg-card);color:var(--text-heading);border:1px solid var(--border);cursor:pointer\">',
    '        <i class=\"material-icons\" style=\"font-size:18px\">chevron_right</i>',
    '      </button>',
    '    </div>',
    '  </div>',
    '  <div v-else class=\"px-4 sm:px-8 lg:px-16 mb-6\" style=\"height:200px\">',
    '    <div class=\"rounded-xl img-placeholder\" style=\"height:100%\"></div>',
    '  </div>',
    '',
    '  <!-- Metrics -->',
    '  <div class=\"px-4 sm:px-8 lg:px-16 mb-8\">',
    '    <div class=\"grid grid-cols-2 lg:grid-cols-4 gap-4\">',
    '      <div v-for=\"m in project.metrics\" :key=\"m.label\" class=\"card-glass text-center py-5 px-5\">',
    '        <div class=\"text-3xl font-extrabold gradient-text\">{{ m.value }}</div>',
    '        <div class=\"text-md font-medium mt-1\" style=\"color:var(--text-label)\">{{ m.label }}</div>',
    '      </div>',
    '    </div>',
    '  </div>',
    '',
    '  <!-- Content -->',
    '  <div class=\"px-4 sm:px-8 lg:px-16 pb-10\">',
    '    <div class=\"grid grid-cols-1 lg:grid-cols-3 gap-8\">',
    '      <div class=\"lg:col-span-2 space-y-6\">',
    '        <div class=\"card-glass p-6\">',
    '          <h2 class=\"text-lg font-bold mb-4 flex items-center gap-3\" style=\"border-left:4px solid var(--primary);padding-left:12px\">System Abstract & Objective</h2>',
    '          <p style=\"color:var(--text)\">{{ project.abstract }}</p>',
    '        </div>',
    '        <div class=\"card-glass p-6\">',
    '          <h2 class=\"text-lg font-bold mb-4 flex items-center gap-3\" style=\"border-left:4px solid var(--primary);padding-left:12px\">Precision Engineering & Program Flow</h2>',
    '          <div v-for=\"(step,i) in project.flow\" :key=\"i\" class=\"flex gap-3 mb-4\">',
    '            <div class=\"w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white flex-shrink-0\">',
    '              <i class=\"material-icons\" style=\"font-size:20px\">{{ step.icon }}</i>',
    '            </div>',
    '            <div>',
    '              <h4 class=\"font-bold text-lg\" style=\"color:var(--text-heading)\">{{ step.title }}</h4>',
    '              <p class=\"text-md mt-1\" style=\"color:var(--text)\">{{ step.text }}</p>',
    '            </div>',
    '          </div>',
    '        </div>',
    '        <div class=\"card-glass p-6\">',
    '          <h2 class=\"text-lg font-bold mb-4 flex items-center gap-3\" style=\"border-left:4px solid var(--primary);padding-left:12px\">Key Achievements</h2>',
    '          <ul class=\"space-y-2\">',
    '            <li v-for=\"(d,i) in project.details\" :key=\"i\" class=\"flex items-start gap-2 text-md\">',
    '              <i class=\"material-icons\" style=\"color:var(--primary);font-size:18px;margin-top:3px\">check_circle</i>',
    '              <span>{{ d }}</span>',
    '            </li>',
    '          </ul>',
    '        </div>',
    '      </div>',
    '      <div class=\"space-y-4\">',
    '        <div class=\"card-glass p-6\">',
    '          <span class=\"text-md font-bold uppercase tracking-wider\" style=\"color:var(--primary)\">Tech Stack</span>',
    '          <div class=\"flex flex-wrap gap-2 mt-3\">',
    '            <span v-for=\"t in project.tech\" :key=\"t\" class=\"skill-pill\">{{ t }}</span>',
    '          </div>',
    '        </div>',
    '        <div class=\"card-glass p-6\" style=\"background:var(--sidebar-bg);color:var(--sidebar-text)\">',
    '          <h4 class=\"font-bold text-lg mb-3\" style=\"color:var(--sidebar-heading)\">Need Something Similar?</h4>',
    '          <p class=\"text-md mb-4\">I build specialized industrial digital solutions, ERP integrations, and automation tools.</p>',
    '          <a href=\"#/contact\" class=\"inline-block w-full py-2.5 text-center text-lg font-semibold rounded-xl gradient-bg text-white transition\">',
    '            Hire Me for This Project',
    '          </a>',
    '        </div>',
    '        <a href=\"#/projects\" class=\"inline-flex items-center gap-2 text-lg font-medium hover:underline\" style=\"color:var(--primary)\">',
    '          <i class=\"material-icons\" style=\"font-size:16px\">arrow_back</i> Back to Projects',
    '        </a>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</div>',
    '<div v-else class=\"section text-center\">',
    '  <p>Project not found.</p>',
    '  <a href=\"#/projects\" style=\"color:var(--primary)\">Back to Projects</a>',
    '</div>'
  ].join('\n')
});

// --- ACHIEVEMENTS VIEW ---
const AchievementsView = defineComponent({
  name: 'AchievementsView',
  data() {
    return { DATA };
  },
  template: [
    '<div class=\"section\">',
    '  <span class=\"section-tag\">Recognitions</span>',
    '  <h1 class=\"section-title\">Professional Achievements</h1>',
    '  <div v-for=\"(cat,ci) in DATA.achievementCategories\" :key=\"ci\" class=\"mb-8 last:mb-0\">',
    '    <h3 class=\"text-lg font-bold mb-4 flex items-center gap-2\" :style=\"{ color: cat.color }\">',
    '      <i class=\"material-icons\">{{ cat.icon }}</i> {{ cat.title }}',
    '    </h3>',
    '    <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4\">',
    '      <div v-for=\"(a,ai) in cat.items\" :key=\"ai\" class=\"achievement-card\" :style=\"{ borderLeftColor: cat.color }\">',
    '        <div class=\"flex items-start gap-3\">',
    '          <i class=\"material-icons\" :style=\"{ color: cat.color, fontSize: \'22px\', marginTop: \'3px\' }\">check_circle</i>',
    '          <div>',
    '            <h4 class=\"font-semibold text-base\" style=\"color:var(--text-heading)\">{{ a.title }}</h4>',
    '            <p class=\"text-base leading-relaxed mt-1\" style=\"color:var(--text)\">{{ a.description }}</p>',
    '          </div>',
    '        </div>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join('\n'),
  mounted() {
    // fade handled by Vue transition
  }
});

// --- SERVICES VIEW ---
const ServicesView = defineComponent({
  name: 'ServicesView',
  data() {
    return { DATA };
  },
  template: [
    '<div class=\"section\">',
    '  <span class=\"section-tag\">What I Offer</span>',
    '  <h1 class=\"section-title\">Professional Services</h1>',
    '  <p class=\"text-base mb-2 leading-relaxed\" style=\"color:var(--text);max-width:720px\">',
    '    I deliver web, software, e-commerce, design, and industrial automation solutions � from remote freelance projects to on-site production floor integrations.',
    '  </p>',
    '',
    '  <!-- Section renderer -->',
    '  <template v-for=\"(group,gi) in DATA.servicesGroups ?? []\" :key=\"gi\">',
    '    <div class=\"flex items-center gap-3 mb-4\" style=\"margin-top:5rem\">',
    '      <div class=\"w-9 h-9 rounded-lg flex items-center justify-center shrink-0\" :style=\"{background: group.bg}\">',
    '        <i class=\"material-icons text-white\" style=\"font-size:20px\">{{ group.icon }}</i>',
    '      </div>',
    '      <div>',
    '        <h3 class=\"text-lg font-bold\" style=\"color:var(--text-heading)\">{{ group.title }}</h3>',
    '        <p v-if=\"group.note\" class=\"text-sm\" style=\"color:var(--text-label)\">{{ group.note }}</p>',
    '      </div>',
    '    </div>',
    '    <div class=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8\">',
    '      <div v-for=\"(s,i) in group.items\" :key=\"i\"',
    '        class=\"card-glass p-5 flex flex-col\"',
    '        :style=\"{borderLeft: group.borderLeft || \'3px solid var(--primary)\'}\">',
    '        <div class=\"flex items-center gap-3 mb-3\">',
    '          <div class=\"w-10 h-10 rounded-lg flex items-center justify-center shrink-0\" :style=\"{background: group.bg}\">',
    '            <i class=\"material-icons text-white\" style=\"font-size:20px\">{{ s.icon }}</i>',
    '          </div>',
    '          <h3 class=\"font-bold\" style=\"font-size:0.95rem;color:var(--text-heading)\">{{ s.title }}</h3>',
    '        </div>',
    '        <p class=\"text-base mb-3 leading-relaxed\" style=\"color:var(--text)\">{{ s.description }}</p>',
    '        <ul class=\"space-y-2 mt-auto pt-3\">',
    '          <li v-for=\"(h,j) in s.highlights\" :key=\"j\"',
    '            class=\"text-sm flex items-center gap-2\"',
    '            style=\"color:var(--text)\">',
    '            <i class=\"material-icons text-sm shrink-0 leading-none\" :style=\"{color: group.chipColor}\">check_circle</i>',
    '            <span class=\"leading-relaxed\" style=\"color:var(--text)\">{{ h }}</span>',
    '          </li>',
    '        </ul>',
    '      </div>',
    '    </div>',
    '  </template>',
    '</div>'
  ].join('\n'),
  mounted() {
    // fade handled by Vue transition
  }
});

// --- MULTIMEDIA WORKS VIEW ---
const MultimediaWorksView = defineComponent({
  name: 'MultimediaWorksView',
  data() {
    return {
      DATA,
      activeFilter: 'all',
      selectedYear: 'all',
      selectedMonth: 'all'
    };
  },
  computed: {
    allItems() {
      const items = [];
      this.DATA.multimediaCategories.forEach(cat => {
        cat.items.forEach(item => {
          items.push({ ...item, categoryKey: cat.key, categoryName: cat.name, categoryIcon: cat.icon });
        });
      });
      return items;
    },
    availableYears() {
      const years = new Set();
      this.allItems.forEach(p => { if (p.date) years.add(p.date.substring(0,4)); });
      return [...years].sort().reverse();
    },
    availableMonths() {
      const months = new Set();
      this.allItems
        .filter(p => this.selectedYear === 'all' || (p.date && p.date.startsWith(this.selectedYear)))
        .forEach(p => { if (p.date) months.add(p.date.substring(0,7)); });
      return [...months].sort().reverse();
    },
    filteredItems() {
      let items = this.allItems;
      if (this.activeFilter !== 'all') items = items.filter(p => p.categoryKey === this.activeFilter);
      if (this.selectedYear !== 'all') items = items.filter(p => p.date && p.date.startsWith(this.selectedYear));
      if (this.selectedMonth !== 'all') items = items.filter(p => p.date && p.date.startsWith(this.selectedMonth));
      return items;
    }
  },
  methods: {
    setFilter(key) { this.activeFilter = key; },
    setYear(year) { this.selectedYear = year; this.selectedMonth = 'all'; },
    setMonth(month) { this.selectedMonth = month; },
    getMonthName(ym) {
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      return months[parseInt(ym.substring(5,7)) - 1] + ' ' + ym.substring(0,4);
    }
  },
  mounted() {
    // fade handled by Vue transition
  },
  template: [
    '<div class=\"section\">',
    '  <span class=\"section-tag\">Multimedia Works</span>',
    '  <h1 class=\"section-title\">Media & Videos</h1>',
    '  <p class=\"text-base mb-4 leading-relaxed\" style=\"color:var(--text);max-width:720px\">',
    '    Browse my YouTube channel, creative projects, and delivered multimedia works.',
    '  </p>',
    '',
    '  <!-- Links Bar -->',
    '  <div class=\"flex flex-wrap gap-3 mb-6\" v-if=\"DATA.media?.links?.length\">',
    '    <a v-for=\"(link,i) in DATA.media.links\" :key=\"i\"',
    '      :href=\"link.url\" target=\"_blank\"',
    '      class=\"inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all\"',
    '      style=\"border:1px solid var(--border);color:var(--text);text-decoration:none\">',
    '      <i class=\"material-icons\" style=\"font-size:18px;color:var(--primary)\">{{ link.icon }}</i>',
    '      {{ link.title }}',
    '      <i class=\"material-icons\" style=\"font-size:14px\">open_in_new</i>',
    '    </a>',
    '  </div>',
    '',
    '  <!-- Channel Profile -->',
    '  <div class=\"card-glass p-5 sm:p-6 mb-8 flex flex-col sm:flex-row items-center gap-5\">',
    '    <div class=\"w-20 h-20 rounded-full overflow-hidden shrink-0\" style=\"min-width:80px;border:3px solid var(--primary)\">',
    '      <img :src=\"DATA.media?.channelAvatar\" :alt=\"DATA.media?.channelName\" class=\"w-full h-full object-cover\"',
    '        loading=\"lazy\"',
    '        onerror=\"this.style.display=\'none\';this.parentElement.innerHTML=\'<div class=\\\\\'w-full h-full flex items-center justify-center text-white text-2xl font-bold\\\\\' style=\\\\\'background:linear-gradient(135deg,#c00,#ff4444)\\\\\'>A</div>\'\">',
    '    </div>',
    '    <div class=\"text-center sm:text-left flex-1\">',
    '      <h2 class=\"text-xl font-bold\" style=\"color:var(--text-heading)\">{{ DATA.media?.channelName }}</h2>',
    '      <p class=\"text-sm mt-0.5\" style=\"color:var(--text-muted)\">{{ DATA.media?.channelHandle }}</p>',
    '      <p class=\"text-sm mt-2 leading-relaxed\" style=\"color:var(--text-muted)\">{{ DATA.media?.description }}</p>',
    '      <div class=\"flex flex-wrap gap-2 mt-3 justify-center sm:justify-start\">',
    '        <a :href=\"(DATA.media?.channelUrl || \'\') + \'?sub_confirmation=1\'\" target=\"_blank\"',
    '          class=\"inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white font-semibold\"',
    '          style=\"background:#c00;font-size:0.85rem\">',
    '          <svg viewBox=\"0 0 24 24\" width=\"16\" height=\"16\" fill=\"currentColor\"><path d=\"M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z\"/></svg>',
    '          Subscribe',
    '        </a>',
    '        <a :href=\"DATA.media?.channelUrl\" target=\"_blank\"',
    '          class=\"inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-semibold transition-all\"',
    '          style=\"font-size:0.85rem;border:1px solid var(--border);color:var(--text)\">',
    '          <i class=\"material-icons\" style=\"font-size:16px\">open_in_new</i> Visit Channel',
    '        </a>',
    '      </div>',
    '    </div>',
    '  </div>',
    '',
    '  <!-- Playlist Player -->',
    '  <div v-if=\"DATA.media?.playlist?.id\" class=\"card-glass p-5 mb-6\">',
    '    <div class=\"flex items-center gap-3 mb-4\">',
    '      <i class=\"material-icons\" style=\"color:var(--primary);font-size:24px\">playlist_play</i>',
    '      <h2 class=\"text-lg font-bold\" style=\"color:var(--text-heading)\">{{ DATA.media?.playlist?.title }}</h2>',
    '    </div>',
    '    <div class=\"aspect-video rounded-xl overflow-hidden\" style=\"background:var(--border)\">',
    '      <iframe width=\"100%\" height=\"100%\"',
    '        :src=\"\'https://www.youtube.com/embed/videoseries?list=\' + DATA.media?.playlist?.id\"',
    '        frameborder=\"0\"',
    '        allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\"',
    '        allowfullscreen',
    '        style=\"border-radius:12px\">',
    '      </iframe>',
    '    </div>',
    '  </div>',
    '',
    '  <!-- Featured Video -->',
    '  <div class=\"card-glass p-5 mb-6\">',
    '    <div class=\"flex items-center gap-3 mb-4\">',
    '      <i class=\"material-icons\" style=\"color:var(--primary);font-size:24px\">featured_video</i>',
    '      <h2 class=\"text-lg font-bold\" style=\"color:var(--text-heading)\">Featured Video</h2>',
    '    </div>',
    '    <div class=\"aspect-video rounded-xl overflow-hidden\" style=\"background:var(--border)\">',
    '      <iframe width=\"100%\" height=\"100%\"',
    '        :src=\"\'https://www.youtube.com/embed/\' + (DATA.media?.featuredVideoId || \'\')\"',
    '        frameborder=\"0\"',
    '        allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\"',
    '        allowfullscreen',
    '        style=\"border-radius:12px\">',
    '      </iframe>',
    '    </div>',
    '  </div>',
    '',
    '  <!-- All Multimedia Works Filter + Grid -->',
    '  <span class=\"section-tag\">All Works</span>',
    '  <h2 class=\"section-title\">Multimedia Portfolio</h2>',
    '',
    '  <!-- Filter Bar -->',
    '  <div class=\"sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 mb-6 pt-4 pb-3 -mx-6 px-6\"',
    '    style=\"background:var(--bg);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid var(--border)\"',
    '    v-if=\"allItems.length\">',
    '    <div class=\"flex flex-wrap gap-2 items-center\">',
    '      <button v-for=\"cat in [{key:\'all\',label:\'All\'}].concat(DATA.multimediaCategories.map(c=>({key:c.key,label:c.name})))\" :key=\"cat.key\"',
    '        @click=\"setFilter(cat.key)\"',
    '        class=\"project-filter-btn\" :class=\"{ active: activeFilter === cat.key }\">',
    '        {{ cat.label }}',
    '      </button>',
    '    </div>',
    '    <div class=\"flex items-center gap-3 shrink-0\">',
    '      <div class=\"flex items-center gap-1.5\">',
    '        <span class=\"text-sm font-medium\" style=\"color:var(--text-label)\">Year:</span>',
    '        <select v-model=\"selectedYear\" @change=\"setYear(selectedYear)\" class=\"text-sm font-medium px-2 py-1 rounded-lg\" style=\"background:var(--bg-card);color:var(--text-heading);border:1px solid var(--border);cursor:pointer;outline:none\">',
    '          <option value=\"all\">All</option>',
    '          <option v-for=\"y in availableYears\" :key=\"y\" :value=\"y\">{{ y }}</option>',
    '        </select>',
    '      </div>',
    '      <div class=\"flex items-center gap-1.5\" v-if=\"availableMonths.length\">',
    '        <span class=\"text-sm font-medium\" style=\"color:var(--text-label)\">Month:</span>',
    '        <select v-model=\"selectedMonth\" @change=\"setMonth(selectedMonth)\" class=\"text-sm font-medium px-2 py-1 rounded-lg\" style=\"background:var(--bg-card);color:var(--text-heading);border:1px solid var(--border);cursor:pointer;outline:none\">',
    '          <option value=\"all\">All</option>',
    '          <option v-for=\"m in availableMonths\" :key=\"m\" :value=\"m\">{{ getMonthName(m) }}</option>',
    '        </select>',
    '      </div>',
    '    </div>',
    '  </div>',
    '',
    '  <!-- Grid -->',
    '  <div',
    '    :key=\"activeFilter + \'-\' + selectedYear + \'-\' + selectedMonth\"',
    '    class=\"grid grid-cols-1 sm:grid-cols-2 gap-6\"',
    '    v-if=\"filteredItems.length\">',
    '    <div v-for=\"(item,i) in filteredItems\" :key=\"item.id || i\"',
    '      class=\"project-card-item rounded-xl p-5 flex flex-col\">',
    '      <div class=\"flex items-center justify-between mb-3\">',
    '        <span class=\"project-cat-tag text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1\">',
    '          <i class=\"material-icons text-xs\">{{ item.categoryIcon }}</i>',
    '          {{ item.categoryName }}',
    '        </span>',
    '        <span v-if=\"item.date\" class=\"text-xs font-medium px-2 py-0.5 rounded shrink-0\"',
    '          style=\"background:rgba(20,184,166,0.12);color:var(--primary-light)\">',
    '          {{ item.date.substring(0,7) }}',
    '        </span>',
    '      </div>',
    '      <h3 class=\"font-semibold text-base\" style=\"color:var(--text-heading)\">{{ item.title }}</h3>',
    '      <p class=\"text-base mt-2 mb-4 leading-relaxed\" style=\"color:var(--text)\">',
    '        {{ item.description }}',
    '      </p>',
    '    </div>',
    '  </div>',
    '',
    '  <div v-if=\"filteredItems.length === 0 && allItems.length\" class=\"text-center py-8\" style=\"color:var(--text-muted)\">',
    '    No works found for the selected filters.',
    '  </div>',
    '</div>'
  ].join('\n')
});

// --- CONTACT VIEW ---
const ContactView = defineComponent({
  name: 'ContactView',
  data() {
    return {
      DATA,
      form: { name: '', email: '', message: '' },
      submitted: false,
      showSuccess: false,
      showError: false,
      errorMessage: '',
      formError: { name: false, email: false, message: false },
      formSuccess: { name: false, email: false, message: false }
    };
  },
  methods: {
    validateField(field) {
      if (this.form[field].trim()) {
        this.formError[field] = false;
        this.formSuccess[field] = true;
      } else {
        this.formError[field] = true;
        this.formSuccess[field] = false;
      }
    },
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) return 'Please enter a valid email address.';
      const [local, domain] = email.split('@');
      if (local.length > 64) return 'Email username is too long.';
      if (domain.length > 255) return 'Email domain is too long.';
      const fakePatterns = ['test@', 'asdf@', '123@', 'abc@', 'qwerty@', 'example@', 'user@', 'admin@'];
      if (fakePatterns.some(p => email.toLowerCase().startsWith(p))) return 'Please use a real email address.';
      const tld = domain.split('.').pop().toLowerCase();
      const fakeTlds = ['localhost', 'test', 'example', 'invalid', 'fake', 'local'];
      if (fakeTlds.includes(tld)) return 'Please use a real email address.';
      const DISPOSABLE_DOMAINS = ['mailinator.com','guerrillamail.com','tempmail.com','throwaway.com','yopmail.com','10minutemail.com','trashmail.com','sharklasers.com','maildrop.cc','getairmail.com','temp-mail.org','fakeinbox.com','dispostable.com','mailcatch.com','spambox.us','mailexpire.com','mintemail.com','spamgourmet.com','spamfree24.org','wh4f.org'];
      if (DISPOSABLE_DOMAINS.includes(domain.toLowerCase())) return 'Temporary email addresses are not allowed. Please use a permanent email.';
      const TYPO_DOMAINS = {'gamil.com':'gmail.com','gmial.com':'gmail.com','gmal.com':'gmail.com','yaho.com':'yahoo.com','yahooo.com':'yahoo.com','hotmal.com':'hotmail.com','hotnail.com':'hotmail.com','hotmil.com':'hotmail.com','outlok.com':'outlook.com','outllok.com':'outlook.com','protonmil.com':'protonmail.com','protonmal.com':'protonmail.com'};
      if (TYPO_DOMAINS[domain.toLowerCase()]) return 'Did you mean ' + TYPO_DOMAINS[domain.toLowerCase()] + '? (You typed: ' + domain + ')';
      return null;
    },
    submitForm() {
      ['name', 'email', 'message'].forEach(f => this.validateField(f));
      if (this.form.name && this.form.email && this.form.message) {
        const emailErr = this.validateEmail(this.form.email);
        if (emailErr) {
          this.formError.email = true;
          this.showError = true;
          this.errorMessage = emailErr;
          return;
        }
        this.submitted = true;
        const formData = new FormData();
        formData.append('access_key', '10c1a904-df2c-4b15-8e7c-6407e5ae6943');
        formData.append('name', this.form.name);
        formData.append('email', this.form.email);
        formData.append('message', this.form.message);
        fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              this.showSuccess = true;
            } else {
              this.showError = true;
              this.errorMessage = data.message || 'Failed to send message. Please try again later.';
              this.submitted = false;
            }
          })
          .catch(() => {
            this.showError = true;
            this.errorMessage = 'Network error: Could not reach the mail server. Please check your connection and try again.';
            this.submitted = false;
          });
      }
    },
    closeModal() {
      const wasError = this.showError;
      this.showSuccess = false;
      this.showError = false;
      this.errorMessage = '';
      this.submitted = false;
      if (wasError) {
        Object.keys(this.formError).forEach(k => this.formError[k] = false);
        Object.keys(this.formSuccess).forEach(k => this.formSuccess[k] = false);
      } else {
        this.form = { name: '', email: '', message: '' };
        Object.keys(this.formError).forEach(k => this.formError[k] = false);
        Object.keys(this.formSuccess).forEach(k => this.formSuccess[k] = false);
      }
    }
  },
  template: [
    '<div class=\"section\">',
    '  <span class=\"section-tag\">Get In Touch</span>',
    '  <h1 class=\"section-title\">Contact Me</h1>',
    '  <div class=\"grid grid-cols-1 lg:grid-cols-5 gap-8\">',
    '    <!-- Info -->',
    '    <div class=\"lg:col-span-2 space-y-5\">',
    '      <div class=\"card-glass p-6 contact-info\">',
    '        <div class=\"space-y-3 text-lg\">',
    '          <div class=\"flex items-center gap-3\"><i class=\"material-icons\" style=\"color:var(--primary);font-size:18px\">phone</i><div><div class=\"font-medium\" style=\"color:var(--text-heading)\">{{ DATA.personal.phone1 }}</div><div class=\"font-medium\" style=\"color:var(--text-heading)\">{{ DATA.personal.phone2 }}</div></div></div>',
    '          <div class=\"flex items-center gap-3\"><i class=\"material-icons\" style=\"color:var(--primary);font-size:18px\">email</i><div><div class=\"font-medium\" style=\"color:var(--text-heading)\">{{ DATA.personal.email }}</div><div class=\"font-medium\" style=\"color:var(--text-heading)\">{{ DATA.personal.email2 }}</div></div></div>',
    '          <div class=\"flex items-center gap-3\"><i class=\"material-icons\" style=\"color:var(--primary);font-size:18px\">location_on</i><span>{{ DATA.personal.location }}</span></div>',
    '          <div class=\"flex items-center gap-3\"><svg viewBox=\"0 0 24 24\" width=\"18\" height=\"18\" fill=\"currentColor\" style=\"color:var(--primary)\"><path d=\"M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68zm1.39 9.94v-8.37H5.5v8.37h2.77z\"/></svg><a :href=\"\'https://\' + DATA.personal.linkedin\" target=\"_blank\" class=\"hover:underline\">{{ DATA.personal.linkedin }}</a></div>',
    '          <div class=\"flex items-center gap-3\"><i class=\"material-icons\" style=\"color:var(--primary);font-size:18px\">language</i><a :href=\"DATA.personal.website\" target=\"_blank\" class=\"hover:underline\">{{ DATA.personal.website }}</a></div>',
    '        </div>',
    '      </div>',
    '',
    '      <div class=\"card-glass p-6\">',
    '        <h3 class=\"text-lg font-bold mb-3\" style=\"color:var(--text-heading)\"><i class=\"material-icons\" style=\"color:var(--primary);font-size:18px\">info</i>Availability</h3>',
    '        <div class=\"space-y-2 text-lg\">',
    '          <div class=\"flex justify-between\"><span style=\"color:var(--text-label)\">Available</span><span class=\"font-medium\" style=\"color:var(--text-heading)\">{{ DATA.personal.available }}</span></div>',
    '          <div class=\"flex justify-between\"><span style=\"color:var(--text-label)\">Relocation</span><span class=\"font-medium\" style=\"color:var(--text-heading)\">Yes</span></div>',
    '        </div>',
    '      </div>',
    '',
    '      <div class=\"card-glass p-6\">',
    '        <h3 class=\"text-lg font-bold mb-3\" style=\"color:var(--text-heading)\"><i class=\"material-icons\" style=\"color:var(--primary);font-size:18px\">location_on</i>Location</h3>',
    '        <div class=\"card-glass--glass flex items-start gap-3 p-4 rounded-xl mb-3\" style=\"display:flex\">',
    '          <div class=\"w-8 h-8 rounded-lg flex items-center justify-center shrink-0 gradient-bg\">',
    '            <i class=\"material-icons text-white\" style=\"font-size:16px\">location_on</i>',
    '          </div>',
    '          <div>',
    '            <h4 class=\"font-semibold text-sm\" style=\"color:var(--text-heading)\">{{ DATA.personal.location }}</h4>',
    '            <p class=\"text-xs mt-0.5\" style=\"color:var(--text)\">Current Location</p>',
    '          </div>',
    '        </div>',
    '        <a :href=\"\'https://www.google.com/maps/search/?api=1&query=\' + encodeURIComponent(DATA.personal.location)\" target=\"_blank\" class=\"card-glass--glass flex items-start gap-3 p-4 rounded-xl\" style=\"text-decoration:none;display:flex\">',
    '          <div class=\"w-8 h-8 rounded-lg flex items-center justify-center shrink-0 gradient-bg\">',
    '            <i class=\"material-icons text-white\" style=\"font-size:16px\">map</i>',
    '          </div>',
    '          <div>',
    '            <h4 class=\"font-semibold text-sm\" style=\"color:var(--primary)\">View on Google Maps</h4>',
    '            <p class=\"text-xs mt-0.5\" style=\"color:var(--text)\">Open in Google Maps</p>',
    '          </div>',
    '        </a>',
    '      </div>',
    '    </div>',
    '',
    '    <!-- Form -->',
    '    <div class=\"lg:col-span-3\">',
    '      <div class=\"card-glass p-6\">',
    '        <h3 class=\"text-lg font-bold mb-4 flex items-center gap-3\" style=\"color:var(--text-heading)\"><i class=\"material-icons\" style=\"color:var(--primary);font-size:18px\">send</i>Send a Message</h3>',
    '        <form @submit.prevent=\"submitForm\" class=\"space-y-4\">',
    '          <div>',
    '            <label class=\"text-md font-medium mb-1 block\" style=\"color:var(--text-label)\">Your Name</label>',
    '            <input v-model=\"form.name\" type=\"text\" class=\"contact-input w-full px-4 py-2.5 rounded-xl\" style=\"background:var(--bg-card);border:1px solid var(--border);color:var(--text)\" placeholder=\"John Doe\">',
    '',
    '            <label class=\"text-md font-medium mb-1 block\" style=\"color:var(--text-label)\">Your Email</label>',
    '            <input v-model=\"form.email\" type=\"email\" class=\"contact-input w-full px-4 py-2.5 rounded-xl\" style=\"background:var(--bg-card);border:1px solid var(--border);color:var(--text)\" placeholder=\"john@example.com\">',
    '',
    '            <label class=\"text-md font-medium mb-1 block\" style=\"color:var(--text-label)\">Message</label>',
    '            <textarea v-model=\"form.message\" required class=\"contact-input\" :class=\"{ error: formError.message, success: formSuccess.message }\" placeholder=\"Write your message...\" @blur=\"validateField(\'message\')\"></textarea>',
    '          </div>',
    '          <button type=\"submit\" :disabled=\"submitted\" class=\"btn-shimmer w-full py-3 px-6 gradient-bg text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2\" :style=\"{opacity: submitted ? 0.7 : 1}\">',
    '            <i class=\"material-icons\" :class=\"{ \'animate-spin\': submitted }\">{{ submitted ? \'sync\' : \'send\' }}</i> {{ submitted ? \'Sending...\' : \'Send Message\' }}',
    '          </button>',
    '        </form>',
    '      </div>',
    '    </div>',
    '  </div>',
    '',
    '  <!-- Success Modal -->',
    '  <div v-if=\"showSuccess\" class=\"success-overlay\" @click.self=\"closeModal\">',
    '    <div class=\"success-card\">',
    '      <div class=\"success-check\">',
    '        <svg viewBox=\"0 0 24 24\">',
    '          <polyline points=\"4,13 9,18 20,6\" />',
    '        </svg>',
    '      </div>',
    '      <span class=\"success-tag\">Success</span>',
    '      <h3 class=\"success-title\">Message Sent!</h3>',
    '      <p class=\"success-text\">',
    '        Thank you for reaching out. Your message has been routed to',
    '        <strong>Md. Asaduzzaman (Aminur)</strong>.',
    '        You can expect a response within 24 hours.',
    '      </p>',
    '      <button @click=\"closeModal\" class=\"success-btn\">OK</button>',
    '    </div>',
    '  </div>',
    '',
    '  <!-- Error Modal -->',
    '  <div v-if=\"showError\" class=\"success-overlay\" @click.self=\"closeModal\">',
    '    <div class=\"success-card error-card\">',
    '      <div class=\"success-check error-check\">',
    '        <svg viewBox=\"0 0 24 24\">',
    '          <line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\" stroke-width=\"4\" stroke-linecap=\"round\" />',
    '          <line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\" stroke-width=\"4\" stroke-linecap=\"round\" />',
    '        </svg>',
    '      </div>',
    '      <span class=\"success-tag error-tag\">Failed</span>',
    '      <h3 class=\"success-title error-title\">Message Not Sent</h3>',
    '      <p class=\"success-text error-text\">{{ errorMessage }}</p>',
    '      <button @click=\"closeModal\" class=\"success-btn error-btn\">OK</button>',
    '    </div>',
    '  </div>'
  ].join('\n'),
  mounted() {
  }
});

// --- APP ---
const App = defineComponent({
  name: 'App',
  data() {
    return {
      DATA,
      darkMode: false,
      mobileMenuOpen: false,
      showContactModal: false,
      showScrollTop: false,
      particleAnimId: null
    };
  },
  computed: {
    menuItems() { return this.DATA.menuItems; }
  },
  mounted() {
    const saved = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'true' || (saved === null && prefersDark)) {
      this.darkMode = true;
      document.documentElement.classList.add('dark');
    }
    window.__toggleContactModal = this.toggleContactModal;
    window.addEventListener('scroll', this.handleScroll);
    this.observeSkillBars();
    setTimeout(() => this.initParticles(), 0);
  },
  unmounted() {
    if (this.particleAnimId) cancelAnimationFrame(this.particleAnimId);
    window.removeEventListener('scroll', this.handleScroll);
    delete window.__toggleContactModal;
  },
  methods: {
    toggleDark() {
      this.darkMode = !this.darkMode;
      document.documentElement.classList.toggle('dark', this.darkMode);
      localStorage.setItem('darkMode', this.darkMode);
    },
    toggleMobile() { this.mobileMenuOpen = !this.mobileMenuOpen; },
    closeMobile() { this.mobileMenuOpen = false; },
    toggleContactModal() { this.mobileMenuOpen = false; this.showContactModal = !this.showContactModal; },
    scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); },
    handleScroll() {
      this.showScrollTop = window.scrollY > 100;
    },
    getInitials(name) {
      return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    },
    observeSkillBars() {
      document.querySelectorAll('.skill-bar-track').forEach(el => {
        if (el._skillBarObserved) return;
        el._skillBarObserved = true;
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.querySelectorAll('.skill-bar-fill').forEach(function (el) {
                const w = el.style.width;
                el.style.width = '0';
                setTimeout(function () { el.style.width = w; }, 100);
              });
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.3 });
        observer.observe(el);
      });
    },
    initParticles() {
      const canvas = document.getElementById('particleCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let w, h, particles = [];
      const resize = () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
      };
      window.addEventListener('resize', resize);
      resize();
      const count = Math.min(120, Math.floor(w * h / 10000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          r: Math.random() * 2 + 1,
          a: Math.random() * 0.5 + 0.15
        });
      }
      const draw = () => {
        this.particleAnimId = requestAnimationFrame(draw);
        ctx.clearRect(0, 0, w, h);
        const isDark = document.documentElement.classList.contains('dark');
        const color = isDark ? '20,184,166' : '20,184,166';
        particles.forEach(p => {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + color + ',' + p.a + ')';
          ctx.fill();
        });
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = 'rgba(' + color + ',' + (0.12 * (1 - dist / 120)) + ')';
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
        }
      };
      draw();
    }
  },
  template: [
    '<div>',
    '  <canvas id="particleCanvas" class="particle-canvas"></canvas>',
    '  <!-- Mobile Nav -->',
    '  <nav class="mobile-nav">',
    '    <div class="flex items-center justify-between px-4 h-full">',
    '      <a href="#/" @click="closeMobile" class="text-xl font-extrabold tracking-tight gradient-text">Amin670BD</a>',
    '      <div class="flex items-center gap-1.5 shrink-0">',
    '        <a href="./assets/Aminur670_CV_2026.pdf" download',
    '          class="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all duration-300 shrink-0"',
    '          style="height:36px;border:1px solid var(--toggle-border);background:var(--toggle-bg);backdrop-filter:blur(6px);color:var(--text-heading)">',
    '          <i class="material-icons" style="font-size:20px">download</i>',
    '          <span class="download-cv-short">CV</span><span class="download-cv-full">Download CV</span>',
    '        </a>',
    '        <button @click="toggleContactModal" class="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all duration-300 shrink-0" style="height:36px;border:1px solid var(--toggle-border);background:var(--toggle-bg);backdrop-filter:blur(6px);color:var(--text-heading)">',
    '          <i class="material-icons" style="font-size:20px">contact_phone</i> <span class="download-cv-full">Contacts</span>',
    '        </button>',
    '        <button @click="toggleDark" aria-label="Toggle dark mode" class="theme-toggle flex items-center justify-center">',
    '          <i class="material-icons" style="font-size:20px">{{ darkMode ? \'light_mode\' : \'dark_mode\' }}</i>',
    '        </button>',
    '        <button @click="toggleMobile" :aria-label="mobileMenuOpen ? \'Close menu\' : \'Open menu\'" class="theme-toggle flex items-center justify-center">',
    '          <i class="material-icons" style="font-size:20px">{{ mobileMenuOpen ? \'close\' : \'menu\' }}</i>',
    '        </button>',
    '      </div>',
    '    </div>',
    '  </nav>',
    '',
    '  <!-- Offcanvas Backdrop -->',
    '  <div v-if="mobileMenuOpen" @click="closeMobile" class="fixed inset-0 z-40" style="background:rgba(0,0,0,0.4);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)"></div>',
    '',
    '  <!-- Offcanvas Sidebar (Mobile) -->',
    '  <aside v-if="mobileMenuOpen" class="fixed top-0 right-0 h-full w-72 z-50 offcanvas-mobile" style="display:flex;flex-direction:column">',
    '    <div class="flex-shrink-0">',
    '      <div class="flex items-start justify-between p-6">',
    '        <div class="text-center flex-1">',
    '          <h2 class="text-xl font-bold" style="color:var(--sidebar-heading)">{{ DATA.personal.name }}</h2>',
    '          <p class="text-lg font-medium" style="color:var(--primary)">({{ DATA.personal.nickname }})</p>',
    '          <p class="text-md mt-0.5" style="color:var(--sidebar-text)">{{ DATA.personal.title }}</p>',
    '        </div>',
    '        <button @click="closeMobile" aria-label="Close menu" class="theme-toggle flex items-center justify-center">',
    '          <i class="material-icons" style="font-size:18px">close</i>',
    '        </button>',
    '      </div>',
    '      <hr style="border-color:var(--sidebar-divider);margin:0 1.5rem">',
    '    </div>',
    '    <div class="px-6 py-3 space-y-0.5 flex-1 overflow-y-auto">',
    '      <a v-for="item in menuItems" :key="item.path"',
    '        @click="closeMobile" :href="\'#\' + item.path"',
    '        class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition"',
    '        :class="{ \'nav-link-active\': .path === item.path }">',
    '        <i class="material-icons w-4 text-center" style="font-size:18px">{{ item.icon }}</i>',
    '        <span>{{ item.label }}</span>',
    '      </a>',
    '    </div>',
    '    <div class="flex-shrink-0">',
    '      <hr style="border-color:var(--sidebar-divider);margin:0 1.5rem">',
    '      <div class="px-6 py-4 space-y-3">',
    '        <a href="./assets/Aminur670_CV_2026.pdf" download',
    '          class="btn-shimmer flex items-center justify-center gap-2 w-full py-2.5 px-4 text-white font-semibold rounded-xl gradient-bg transition-all duration-300"',
    '          style="box-shadow:0 4px 12px rgba(20,184,166,0.25)">',
    '          <i class="material-icons">download</i> Download CV',
    '        </a>',
    '        <div class="flex items-center justify-center gap-3 pt-1">',
    '          <a :href="\'https://\' + DATA.personal.linkedin" target="_blank" class="theme-toggle flex items-center justify-center" title="LinkedIn" style="width:36px;height:36px">',
    '            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68zm1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>',
    '          </a>',
    '          <a :href="DATA.personal.website" target="_blank" class="theme-toggle flex items-center justify-center" title="Portfolio" style="width:36px;height:36px">',
    '            <i class="material-icons" style="font-size:20px">language</i>',
    '          </a>',
    '          <a :href="\'https://github.com/amin670bd\'" target="_blank" class="theme-toggle flex items-center justify-center" title="GitHub" style="width:36px;height:36px">',
    '            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>',
    '          </a>',
    '          <a href="https://www.youtube.com/@aminur670" target="_blank" class="theme-toggle flex items-center justify-center" title="YouTube" style="width:36px;height:36px">',
    '            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/></svg>',
    '          </a>',
    '          <a :href="\'mailto:\' + DATA.personal.email" class="theme-toggle flex items-center justify-center" title="Email" style="width:36px;height:36px">',
    '            <i class="material-icons" style="font-size:20px">email</i>',
    '          </a>',
    '        </div>',
    '      </div>',
    '    </div>',
    '  </aside>',
    '',
    '  <!-- Contact Modal -->',
    '  <div v-if="showContactModal" @click.self="showContactModal = false" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style="background:rgba(0,0,0,0.65);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)">',
    '    <div class="w-full md:max-w-4xl flex flex-col overflow-hidden rounded-xl" style="max-height:85dvh;height:85dvh;background:var(--bg-card);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid var(--border)">',
    '      <div class="flex items-center justify-between px-4 py-3 shrink-0" style="border-bottom:1px solid var(--border)">',
    '        <h2 class="text-base font-bold flex items-center gap-1.5" style="color:var(--text-heading)">',
    '          <i class="material-icons" style="font-size:18px;color:var(--primary)">contact_phone</i> Contact',
    '        </h2>',
    '        <button @click="showContactModal = false" aria-label="Close contact modal" class="w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:bg-black/5" style="color:var(--text-label)">',
    '          <i class="material-icons" style="font-size:18px">close</i>',
    '        </button>',
    '      </div>',
    '      <div class="flex-1 min-h-0 overflow-y-auto" style="-webkit-overflow-scrolling:touch">',
    '        <div class="grid md:grid-cols-2 gap-3 p-4">',
    '          <div class="space-y-3">',
    '            <p class="text-[11px] font-semibold tracking-wider" style="color:var(--text-label)">WHATSAPP</p>',
    '            <a class="card-glass--glass flex flex-col items-center gap-3 p-4 rounded-xl" style="text-decoration:none" @click.stop>',
    '              <img src="assets/images/whatsapp_qr.png" alt="WhatsApp QR code for Md. Asaduzzaman (Aminur)" class="w-14 h-14 rounded-xl" style="border:2px solid var(--border);background:white">',
    '            </a>',
    '            <a :href="\'https://wa.me/\' + DATA.personal.phone1.replace(/[^0-9]/g,\'\')" target="_blank" class="card-glass--glass flex items-start gap-3 p-4 rounded-xl" style="text-decoration:none;display:flex" @click.stop>',
    '              <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 gradient-bg">',
    '                <svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M12 2C6.477 2 2 6.477 2 12c0 2.097.602 4.055 1.638 5.708L2 22l4.374-1.604C8.02 21.378 9.965 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.833 0-3.557-.58-4.973-1.573l-.357-.237-2.597.954.96-2.549-.255-.38A7.956 7.956 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.19-5.94c-.23-.115-1.36-.67-1.57-.746-.21-.077-.363-.115-.516.115-.153.23-.593.746-.727.899-.134.153-.268.172-.498.057-.23-.115-.972-.358-1.85-1.143-.684-.613-1.146-1.37-1.28-1.602-.134-.23-.014-.355.101-.47.103-.103.23-.268.345-.402.115-.134.153-.23.23-.383.077-.153.038-.287-.019-.402-.057-.115-.516-1.244-.707-1.704-.186-.45-.374-.372-.516-.372-.134 0-.287-.019-.44-.019-.153 0-.402.057-.612.287-.21.23-.802.784-.802 1.913s.82 2.22.935 2.373c.115.153 1.614 2.465 3.91 3.456.546.236.972.377 1.305.482.548.173 1.048.149 1.442.09.44-.066 1.36-.555 1.552-1.092.192-.537.192-.997.134-1.093-.057-.096-.21-.153-.44-.268z"/></svg>',
    '              </div>',
    '              <div>',
    '                <h4 class="font-semibold text-sm" style="color:#25D366">{{ DATA.personal.phone1 }}</h4>',
    '                <p class="text-xs mt-0.5" style="color:var(--text)">WhatsApp</p>',
    '              </div>',
    '            </a>',
    '            <a :href="\'https://wa.me/\' + DATA.personal.phone2.replace(/[^0-9]/g,\'\')" target="_blank" class="card-glass--glass flex items-start gap-3 p-4 rounded-xl" style="text-decoration:none;display:flex" @click.stop>',
    '              <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 gradient-bg">',
    '                <svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M12 2C6.477 2 2 6.477 2 12c0 2.097.602 4.055 1.638 5.708L2 22l4.374-1.604C8.02 21.378 9.965 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.833 0-3.557-.58-4.973-1.573l-.357-.237-2.597.954.96-2.549-.255-.38A7.956 7.956 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.19-5.94c-.23-.115-1.36-.67-1.57-.746-.21-.077-.363-.115-.516.115-.153.23-.593.746-.727.899-.134.153-.268.172-.498.057-.23-.115-.972-.358-1.85-1.143-.684-.613-1.146-1.37-1.28-1.602-.134-.23-.014-.355.101-.47.103-.103.23-.268.345-.402.115-.134.153-.23.23-.383.077-.153.038-.287-.019-.402-.057-.115-.516-1.244-.707-1.704-.186-.45-.374-.372-.516-.372-.134 0-.287-.019-.44-.019-.153 0-.402.057-.612.287-.21.23-.802.784-.802 1.913s.82 2.22.935 2.373c.115.153 1.614 2.465 3.91 3.456.546.236.972.377 1.305.482.548.173 1.048.149 1.442.09.44-.066 1.36-.555 1.552-1.092.192-.537.192-.997.134-1.093-.057-.096-.21-.153-.44-.268z"/></svg>',
    '              </div>',
    '              <div>',
    '                <h4 class="font-semibold text-sm" style="color:#25D366">{{ DATA.personal.phone2 }}</h4>',
    '                <p class="text-xs mt-0.5" style="color:var(--text)">WhatsApp</p>',
    '              </div>',
    '            </a>',
    '          </div>',
    '          <div class="space-y-3">',
    '            <p class="text-[11px] font-semibold tracking-wider" style="color:var(--text-label)">EMAIL</p>',
    '            <a :href="\'mailto:\' + DATA.personal.email" class="card-glass--glass flex items-start gap-3 p-4 rounded-xl" style="text-decoration:none;display:flex" @click.stop>',
    '              <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 gradient-bg">',
    '                <i class="material-icons text-white" style="font-size:16px">email</i>',
    '              </div>',
    '              <div>',
    '                <h4 class="font-semibold text-sm" style="color:var(--text-heading)">{{ DATA.personal.email }}</h4>',
    '                <p class="text-xs mt-0.5" style="color:var(--text)">Email Primary</p>',
    '              </div>',
    '            </a>',
    '            <a :href="\'mailto:\' + DATA.personal.email2" class="card-glass--glass flex items-start gap-3 p-4 rounded-xl" style="text-decoration:none;display:flex" @click.stop>',
    '              <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 gradient-bg">',
    '                <i class="material-icons text-white" style="font-size:16px">email</i>',
    '              </div>',
    '              <div>',
    '                <h4 class="font-semibold text-sm" style="color:var(--text-heading)">{{ DATA.personal.email2 }}</h4>',
    '                <p class="text-xs mt-0.5" style="color:var(--text)">Email Secondary</p>',
    '              </div>',
    '            </a>',
    '          </div>',
    '        </div>',
    '      </div>',
    '    </div>',
    '  </div>',
    '',
    '  <!-- Sidebar -->',
    '  <aside class=\"sidebar\">',
    '    <div class=\"sidebar-scroll\">',
    '      <div class=\"p-6 text-center\">',
    '        <div class=\"w-full sm:w-44 md:w-52 lg:w-60 mx-auto mb-4 rounded-2xl overflow-hidden\" style=\"border:3px solid rgba(20,184,166,0.3)\">',
    '          <img :src=\"DATA.personal.photo\" :alt=\"DATA.personal.name\" class=\"w-full h-auto object-contain\" loading=\"lazy\">',
    '        </div>',
    '        <h2 class=\"text-xl font-bold\" style=\"color:var(--sidebar-heading)\">{{ DATA.personal.name }}</h2>',
    '        <p class=\"text-lg font-medium\" style=\"color:var(--primary)\">({{ DATA.personal.nickname }})</p>',
    '        <p class=\"text-lg mt-0.5\" style=\"color:var(--sidebar-text)\">{{ DATA.personal.title }}</p>',
    '      </div>',
    '',
    '      <!-- Sidebar Nav -->',
    '      <div class=\"px-4 space-y-0.5\">',
    '        <a v-for=\"item in menuItems\" :key=\"item.path\"',
    '          :href=\"\'#\' + item.path\"',
    '          class=\"nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition\"',
    '          :class=\"{ \'nav-link-active\': \.path === item.path }\"',
    '          @click=\"closeMobile\">',
    '          <i class=\"material-icons w-4 text-center\" style=\"font-size:18px\">{{ item.icon }}</i>',
    '          <span>{{ item.label }}</span>',
    '        </a>',
    '      </div>',
    '',
    '    </div>',
    '',
    '    <!-- Download + Theme (fixed at bottom) -->',
    '    <div class=\"px-6 py-4 space-y-3\" style=\"border-top:1px solid var(--sidebar-divider)\">',
    '      <a href=\"./assets/Aminur670_CV_2026.pdf\" download',
    '        class=\"btn-shimmer flex items-center justify-center gap-2 w-full py-2.5 px-4 text-white font-semibold rounded-xl gradient-bg transition-all duration-300\"',
    '        style=\"box-shadow:0 4px 12px rgba(20,184,166,0.25)\">',
    '        <i class=\"material-icons\">download</i> Download CV',
    '      </a>',
    '      <div class=\"flex items-center justify-between\">',
    '        <span class=\"text-lg flex items-center gap-1.5\" style=\"color:var(--sidebar-text)\"><span class=\"w-1.5 h-1.5 rounded-full\" style=\"background:var(--accent-emerald);box-shadow:0 0 6px rgba(16,185,129,0.4)\"></span> Available</span>',
    '        <div class=\"flex items-center gap-2\">',
    '          <button @click=\"toggleContactModal\" class=\"flex items-center gap-1 px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-300\" style=\"border:1px solid var(--primary);color:var(--primary)\">',
    '            <i class=\"material-icons\" style=\"font-size:16px\">contact_phone</i> Contacts',
    '          </button>',
    '          <button @click=\"toggleDark\" aria-label=\"Toggle dark mode\" class=\"theme-toggle\">',
    '            <i class=\"material-icons\" style=\"transition:transform 0.3s ease\">{{ darkMode ? \'light_mode\' : \'dark_mode\' }}</i>',
    '          </button>',
    '        </div>',
    '      </div>',
    '    </div>',
    '  </aside>',
    '',
    '  <!-- Main Content -->',
    '  <main class=\"main-content\">',
    '    <div id=\"route-outlet\"></div>',
    '    <div class=\"footer\">',
    '      <p>&copy; 2026 Md. Asaduzzaman (Aminur). All rights reserved.</p>',
    '    </div>',
    '  </main>',
    '',
    '  <!-- Scroll to top -->',
    '  <button @click=\"scrollToTop\" aria-label=\"Scroll to top\" class=\"scroll-top gradient-bg\" :class=\"{ visible: showScrollTop }\" :style=\"{boxShadow: \'0 4px 15px rgba(20,184,166,0.4)\'}\">',
    '    <i class=\"material-icons\" style=\"transition:transform 0.3s ease\">arrow_upward</i>',
    '  </button>',
    '</div>'
  ].join('\n')
});

window.tinyVueComponents = {
  App,
  HomeView,
  AboutView,
  SkillsView,
  ExperienceView,
  EducationView,
  ProjectsView,
  ProjectDetailView,
  AchievementsView,
  ServicesView,
  MultimediaWorksView,
  ContactView
};
})();

/* ===================================================
   tinyVue 1.0 — App Bootstrap
   Router definitions + mount sequence
   =================================================== */
(function () {
const { createRouter, createApp, createComponentInstance, mountComponent } = window.tinyVue;
const { App, HomeView, AboutView, SkillsView, ExperienceView, EducationView,
        ProjectsView, ProjectDetailView, AchievementsView, ServicesView,
        MultimediaWorksView, ContactView } = window.tinyVueComponents;

const routes = [
  { path: '/', component: HomeView, meta: { title: 'Home' } },
  { path: '/about', component: AboutView, meta: { title: 'About' } },
  { path: '/skills', component: SkillsView, meta: { title: 'Skills' } },
  { path: '/experience', component: ExperienceView, meta: { title: 'Experience' } },
  { path: '/education', component: EducationView, meta: { title: 'Education' } },
  { path: '/projects', component: ProjectsView, meta: { title: 'Projects' } },
  { path: '/project/:id', component: ProjectDetailView, meta: { title: 'Project' } },
  { path: '/multimedia-works', component: MultimediaWorksView, meta: { title: 'Multimedia Works' } },
  { path: '/achievements', component: AchievementsView, meta: { title: 'Achievements' } },
  { path: '/services', component: ServicesView, meta: { title: 'Services' } },
  { path: '/contact', component: ContactView, meta: { title: 'Contact' } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  mode: 'hash',
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.path === '/projects') {
      const savedY = sessionStorage.getItem('projectsScrollY');
      if (savedY) {
        sessionStorage.removeItem('projectsScrollY');
        return { top: parseInt(savedY), behavior: 'smooth' };
      }
    }
    return { top: 0, behavior: 'smooth' };
  }
});

// Step 1: Mount App layout
const appEl = document.querySelector('#app');
const appInstance = createComponentInstance(App);
mountComponent(appInstance, appEl);

// Step 2: Init router inside route outlet
const outlet = document.getElementById('route-outlet');
if (outlet) {
  router.init(outlet);
}

if (window.tinyVue.SLIM_DEBUG) {
  console.log('[tinyVue] Bootstrapped', { routes: routes.length });
}
})();

