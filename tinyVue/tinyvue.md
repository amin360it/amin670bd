# tinyVue 1.0

Zero-dependency reactive frontend framework · Vue 3-compatible syntax · Fine-grained subscriptions (no virtual DOM)

## Architecture

```
index.html
  └─ tinyVue/framework.js      Core: reactivity, compiler, router, lifecycle
  └─ tinyVue/data.js            Inlined application data
  └─ tinyVue/components.js      All view components (defineComponent)
  └─ tinyVue/app-bootstrap.js   Routes + mount
```

**Loading order matters**: `framework → data → components → bootstrap`.

---

## Reactive System

All reactivity is global — no `import` needed. Access via `window.tinyVue.*` or destructure.

### `ref(initial)`
Creates a reactive reference. Access/set via `.value`.

```js
const count = ref(0);
count.value++;                    // triggers subscribers
console.log(count.value);         // 1
```

### `reactive(obj)`
Creates a deeply reactive proxy of a plain object. Nested objects are wrapped lazily.

```js
const state = reactive({ user: { name: 'Alice' }, items: [] });
state.user.name = 'Bob';         // triggers subscribers
state.items.push('x');           // Array mutations trigger via proxy set trap
```

**Note**: Arrays are NOT deeply proxied. Mutations via index assignment (`arr[0]=x`) are tracked; push/pop are NOT tracked. Prefer `ref` for arrays, or reassign the array.

### `computed(fn)`
Returns a read-only reactive ref that lazily evaluates `fn` and caches until dependencies change.

```js
const fullName = computed(() => `${first.value} ${last.value}`);
```

### `watch(source, callback, options?)`
Tracks changes to a reactive source. Returns an unwatch function.

```js
const stop = watch(() => state.count, (newVal, oldVal) => {
  console.log(`count changed from ${oldVal} to ${newVal}`);
}, { immediate: true, deep: false });
stop();  // manually stop watching
```

### `effect(fn)`
Runs `fn` immediately and re-runs whenever any reactive dependency changes. Returns a disposer.

```js
const dispose = effect(() => console.log(`count is ${count.value}`));
dispose();  // detach all subscriptions
```

### `untrack(fn)`
Temporarily suppress tracking inside `fn`.

```js
untrack(() => { count.value; /* not tracked */ });
```

### `nextTick(fn?)`
Schedule a callback after the current batch flush. Returns a Promise if no callback.

```js
await nextTick();
nextTick(() => { /* after DOM update */ });
```

---

## Component Engine

### `defineComponent(def)`
Identity function — returns `def` as-is. The definition object supports:

| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Component name (for debugging) |
| `template` | `string` | HTML template with Vue directives |
| `data()` | `() => object` | Returns initial reactive data |
| `computed` | `{ [key]: fn \| { get } }` | Computed properties |
| `methods` | `{ [key]: fn }` | Methods (bound to instance) |
| `setup()` | `(props) => object` | Composition API — merge return values into instance |
| `mounted()` | lifecycle | Called after DOM inserted |
| `unmounted()` | lifecycle | Called before DOM removed |
| `updated()` | lifecycle | Called after reactive update |
| `errorCaptured(err)` | lifecycle | Catch errors in child components |
| `beforeRouteLeave(to, from)` | guard | Return `false` to cancel navigation |

### Instance properties (available as `this.X` in methods/computed/lifecycle)

| Property | Description |
|----------|-------------|
| `this.$route` | Reactive `{ path, params, meta }` — updates on navigation |
| `this.$router` | Router instance (`push`, `replace`, `path`, `params`, `meta`) |
| `this.$root` | Self-reference (the instance itself) |
| `this.DATA` | Global data object (available because returned from `data()`) |

**Note**: `$route` is reactive — computed properties and template bindings referencing `$route.params.id` will update on navigation.

### Programmatic mounting

```js
const { createComponentInstance, mountComponent } = window.tinyVue;
const inst = createComponentInstance(MyComponent);
mountComponent(inst, document.querySelector('#container'));
// inst._el === root DOM node
// inst._subs === array of subscription update functions
```

---

## Template Syntax

### Text interpolation `{{ expr }}`

```html
<span>{{ count }} items</span>
<span>{{ user.name.toUpperCase() }}</span>
```

### Attribute interpolation `${...}` in string attributes

```html
<div class="user-${userId}-active">
<img :src="`${baseUrl}/img/${id}.png`">
```

### `v-if` / `v-else` / `v-else-if` / `v-show`

```html
<div v-if="visible">shown</div>
<div v-else>hidden</div>
<div v-show="loading">spinner</div>
```

`v-if` toggles DOM presence. `v-show` toggles `display`.

### `v-for`

```html
<div v-for="(item, index) in items" :key="item.id">{{ index }}: {{ item.name }}</div>
<div v-for="item in items">{{ item }}</div>
```

Supports `(item, index) in array`, `item in array`, and `(value, key) in object` syntax. Uses simple keyed diff via `_key` or index.

### `v-model`

```html
<input v-model="form.email">
<textarea v-model="form.message"></textarea>
<select v-model="form.country"><option...></select>
<input type="checkbox" v-model="form.agree">
```

Works with dot-separated paths (`form.email` maps to `ctx.form.email`). Checkbox uses `.checked`; number inputs respect `data-number` attribute.

### `:bind` — dynamic attributes

```html
<!-- class (supports string, array, object) -->
<div :class="{ active: isActive, disabled: !enabled }">
<div :class="['btn', typeClass]">
<div :class="dynamicString">

<!-- style (supports string or object) -->
<div :style="{ color: textColor, fontSize: size + 'px' }">
<div :style="'color:red;background:blue'">

<!-- other attributes -->
<img :src="imageUrl" :alt="altText">
<button :disabled="!canSubmit">
<div :data-id="itemId">

<!-- key (reserved for v-for) -->
<div :key="item.id">
```

### `@event` — event handlers

```html
<button @click="handleClick">
<form @submit.prevent="onSubmit">
<a @click.stop="doSomething">
<input @keyup.enter="submit">
```

**Supported modifiers**: `.prevent`, `.stop`, `.capture`, `.self`, `.enter`, `.tab`, `.delete`, `.esc`, `.space`, `.up`, `.down`, `.left`, `.right`.

Handler is called as `ctx[methodName](event)`. Parentheses are stripped automatically.

### `v-html`
```html
<div v-html="rawHtml"></div>
```

### `v-text`
```html
<div v-text="dynamicText"></div>
```

---

## Router

### `createRouter(config)`

```js
const router = createRouter({
  mode: 'hash',            // 'hash' or 'history'
  routes: [
    { path: '/', component: HomeView, meta: { title: 'Home' } },
    { path: '/project/:id', component: ProjectDetailView, props: true },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, behavior: 'smooth' };
  }
});
```

### Router instance

| Method / Property | Description |
|-------------------|-------------|
| `router.push(path)` | Navigate to path (pushes history) |
| `router.replace(path)` | Navigate to path (replaces history) |
| `router.path` | Current path (reactive via `$route.path`) |
| `router.params` | Current params (reactive via `$route.params`) |
| `router.meta` | Current route meta (reactive via `$route.meta`) |
| `router.beforeEach(fn)` | Navigation guard — return `false` to cancel |
| `router.afterEach(fn)` | Post-navigation hook |
| `router.init(el)` | Start listening to hash/popstate and render into `el` |
| `router.destroy()` | Remove listeners |

Navigation guards receive `(to, from)` where each is `{ path, route, params, meta }`.

### Route definition

```js
{ 
  path: '/user/:id',       // :param segments
  component: UserView,     // defineComponent() object
  meta: { title: 'User' },
  redirect: '/other',       // redirect to another path
  props: true               // pass route.params as component properties
}
```

### Hash mode URLs
Use `#/path/to/view` in `<a href>` tags. The router listens to `hashchange` events.

---

## App Bootstrap

### Standard pattern

```js
const app = createApp(RootComponent);
app.use(router);
app.mount('#app');
```

### Layout + router pattern (used in this project)

```js
// 1. Mount the App layout (sidebar, nav, etc.)
const appEl = document.querySelector('#app');
const appInstance = createComponentInstance(App);
mountComponent(appInstance, appEl);

// 2. Init router inside route-outlet
const outlet = document.getElementById('route-outlet');
router.init(outlet);
```

The App template contains `<div id="route-outlet"></div>` where route views are mounted.

---

## Transitions (CSS class-based)

Utility function `_applyTransition(el, name, action, done)` adds/removes CSS classes:
- **Enter**: `{name}-enter` → (next frame) → `{name}-enter-active` → (after transition) → remove
- **Leave**: `{name}-leave` → (next frame) → `{name}-leave-active` → (after transition) → remove

Duration is computed from `transition-duration` + `transition-delay`.

---

## Lifecycle Hooks (Composition API)

```js
import { onMounted, onUnmounted, onUpdated, onErrorCaptured, onBeforeRouteLeave } from window.tinyVue;

function setup() {
  onMounted(() => console.log('mounted'));
  onUnmounted(() => console.log('unmounted'));
  onBeforeRouteLeave((to, from) => { /* return false to cancel */ });
}
```

Hooks are registered per-effect context — only work inside `setup()` or `data()` that's called during instance creation.

---

## DevTools

Set `const SLIM_DEBUG = true` in `framework.js` to enable:

```js
window.__tinyVue = {
  version: '1.0',
  subscribers,        // Map of subscription sets
  batchQueue,         // Set of pending updates
  reactiveTargets,    // WeakMap of proxied objects
  effectStack,        // Active effect stack
  compiledExprCache   // Map of compiled expressions
};
```

---

## Config Constants

```js
SLIM_DEBUG    = false   // Toggle devtools console logging
ROUTER_MODE   = 'hash'  // Default routing mode
APP_ROOT      = '#app'  // Default mount selector
```

---

## Limitations

| Feature | Status | Notes |
|---------|--------|-------|
| Virtual DOM | Not implemented | Fine-grained subscriptions instead |
| Array reactivity | Partial | Index assignment works; push/pop don't trigger. Reassign the array or use ref |
| `<transition>` / `<transition-group>` | Not in template compiler | Use `v-if`/`v-show` directly, or call `_applyTransition` manually |
| `<component :is>` | Not implemented | Use `v-if` chains |
| `<slot>` / `<template>` | Not implemented | No slot distribution |
| Async components | Not implemented | Load synchronously |
| Nested `<router-view>` | Not implemented | Flat route structure only |
| `<keep-alive>` | Not implemented | Components are created/destroyed per route |
| Event modifier `.exact` | Not implemented | Standard modifiers only |
| `v-for` keyed diff | Simple | Uses `_key` property or index — no move detection |
| `v-once` / `v-memo` | Not implemented | Always reactive |

---

## File Structure Reference

```
tinyVue/
├── framework.js          ~1150 lines  — Core framework (9 modules)
│   ├── Module 1         Reactive system (ref, reactive, computed, watch, effect)
│   ├── Module 2         Expression evaluator (new Function with with($data))
│   ├── Module 3         Template compiler (string → DOM → directives)
│   ├── Module 4         Subscription engine (track/trigger, batch flushing)
│   ├── Module 5         Component engine (defineComponent, create/mount/unmount)
│   ├── Module 6         Router (hash/history, guards, scroll behavior)
│   ├── Module 7         Transitions (CSS class-based enter/leave)
│   ├── Module 8         App bootstrap (createApp)
│   └── Module 9         DevTools (window.__tinyVue)
├── data.js              ~250 lines   — Inlined DATA object
├── components.js        ~1660 lines  — 12 defineComponent() views
│   ├── HomeView                    Hero, typewriter, highlights, stats
│   ├── AboutView                   Visiting card, personal details, languages, objective
│   ├── SkillsView                  Skill categories (DATA.skills)
│   ├── ExperienceView              Timeline (DATA.experience)
│   ├── EducationView               Education timeline + training cards
│   ├── ProjectsView                Featured slider, filters, project grid
│   ├── ProjectDetailView           Breadcrumb, slider, metrics, flow, tech stack
│   ├── AchievementsView            Achievement categories
│   ├── ServicesView                Service groups (DATA.servicesGroups)
│   ├── MultimediaWorksView         YouTube embed, filters, item grid
│   ├── ContactView                 Form validation, success/error modals
│   └── App                         Particles, sidebar, nav, contact modal, footer
└── app-bootstrap.js     ~60 lines   — Route defs, mount App, init router in #route-outlet
```
