import { _ as __nuxt_component_0 } from './nuxt-link-CyAuYzED.mjs';
import { u as useData } from './useData-h1AIsp2l.mjs';
import { s as setInterval } from './interval-CgcWAxhf.mjs';
import { mergeProps, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderStyle, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = {
  name: "HomeView",
  data() {
    return {
      DATA: useData(),
      typeInterval: null,
      roles: ["IT Support Specialist", "ERP Systems Specialist", "Web Developer", "Digital Operations Expert", "Systems Integrator"],
      currentRole: "IT Support Specialist",
      roleIndex: 0,
      charIndex: 0,
      isDeleting: false,
      highlights: [
        { icon: "speed", title: "60% Efficiency Boost", text: "Reduced packing time with automated weight scale integration", link: "/projects" },
        { icon: "web", title: "15+ Sites Built", text: "WordPress, WooCommerce & custom web solutions", link: "/projects" },
        { icon: "group", title: "100+ Users Managed", text: "ERP training, IT support & system administration", link: "/experience" }
      ]
    };
  },
  mounted() {
    this.startTypewriter();
  },
  beforeUnmount() {
    if (this.typeInterval) clearInterval(this.typeInterval);
  },
  methods: {
    toggleContactModal() {
      this.showContactModal = true;
    },
    startTypewriter() {
      this.typeInterval = setInterval();
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NuxtLink = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "hero-section" }, _attrs))}><span class="section-tag">Since 2018 in IT</span><div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-4"><div class="flex-1"><h1 class="hero-title">${ssrInterpolate($data.DATA.personal.name)} <br><span class="gradient-text">(${ssrInterpolate($data.DATA.personal.nickname)})</span></h1></div><div class="lg:shrink-0 w-full lg:w-48 xl:w-56"><img${ssrRenderAttr("src", $data.DATA.personal.photo)}${ssrRenderAttr("alt", $data.DATA.personal.name)} class="w-full h-auto rounded-2xl object-cover" loading="lazy" style="${ssrRenderStyle({ "box-shadow": "0 8px 32px rgba(20,184,166,0.15)", "border": "2px solid var(--border)" })}"><div class="hidden lg:flex flex-wrap justify-center gap-2 mt-3"><a${ssrRenderAttr("href", "https://" + $data.DATA.personal.linkedin)} target="_blank" class="theme-toggle flex items-center justify-center" title="LinkedIn" style="${ssrRenderStyle({ "width": "36px", "height": "36px" })}"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68zm1.39 9.94v-8.37H5.5v8.37h2.77z"></path></svg></a><a${ssrRenderAttr("href", $data.DATA.personal.website)} target="_blank" class="theme-toggle flex items-center justify-center" title="Portfolio" style="${ssrRenderStyle({ "width": "36px", "height": "36px" })}"><i class="material-icons" style="${ssrRenderStyle({ "font-size": "20px" })}">language</i></a><a href="https://github.com/amin670bd" target="_blank" class="theme-toggle flex items-center justify-center" title="GitHub" style="${ssrRenderStyle({ "width": "36px", "height": "36px" })}"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"></path></svg></a><a href="https://www.youtube.com/@aminur670" target="_blank" class="theme-toggle flex items-center justify-center" title="YouTube" style="${ssrRenderStyle({ "width": "36px", "height": "36px" })}"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"></path></svg></a><a${ssrRenderAttr("href", "https://wa.me/" + $data.DATA.personal.phone1.replace(/[^0-9]/g, ""))} target="_blank" class="theme-toggle flex items-center justify-center" title="WhatsApp" style="${ssrRenderStyle({ "width": "36px", "height": "36px" })}"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 2.097.602 4.055 1.638 5.708L2 22l4.374-1.604C8.02 21.378 9.965 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.833 0-3.557-.58-4.973-1.573l-.357-.237-2.597.954.96-2.549-.255-.38A7.956 7.956 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.19-5.94c-.23-.115-1.36-.67-1.57-.746-.21-.077-.363-.115-.516.115-.153.23-.593.746-.727.899-.134.153-.268.172-.498.057-.23-.115-.972-.358-1.85-1.143-.684-.613-1.146-1.37-1.28-1.602-.134-.23-.014-.355.101-.47.103-.103.23-.268.345-.402.115-.134.153-.23.23-.383.077-.153.038-.287-.019-.402-.057-.115-.516-1.244-.707-1.704-.186-.45-.374-.372-.516-.372-.134 0-.287-.019-.44-.019-.153 0-.402.057-.612.287-.21.23-.802.784-.802 1.913s.82 2.22.935 2.373c.115.153 1.614 2.465 3.91 3.456.546.236.972.377 1.305.482.548.173 1.048.149 1.442.09.44-.066 1.36-.555 1.552-1.092.192-.537.192-.997.134-1.093-.057-.096-.21-.153-.44-.268z"></path></svg></a></div></div></div><p class="hero-subtitle mt-4 mb-2" style="${ssrRenderStyle({ "color": "var(--text)" })}"><span>A unique fusion of </span><strong><span class="typewriter-cursor">${ssrInterpolate($data.currentRole)}</span></strong></p><p class="text-base mb-8" style="${ssrRenderStyle({ "color": "var(--text)" })}"> Dedicated to automating workflows, reducing production costs, and modernizing digital infrastructure. </p><div class="flex flex-wrap gap-3 mb-10"><button class="hero-btn btn-shimmer inline-flex items-center gap-2 px-6 py-3 gradient-bg text-white font-semibold rounded-xl shadow-lg transition-all duration-300" style="${ssrRenderStyle({ "box-shadow": "0 4px 15px rgba(20,184,166,0.3)", "cursor": "pointer" })}"><i class="material-icons text-lg">contact_phone</i> Contact </button>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/contact",
    class: "hero-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300",
    style: { "border": "1px solid var(--border)", "color": "var(--text-heading)", "background": "var(--bg-card)" }
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<i class="material-icons text-lg"${_scopeId}>send</i> Message `);
      } else {
        return [
          createVNode("i", { class: "material-icons text-lg" }, "send"),
          createTextVNode(" Message ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<a href="/cv.pdf" download class="hero-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300" style="${ssrRenderStyle({ "border": "1px solid var(--border)", "color": "var(--text-heading)", "background": "var(--bg-card)" })}"><i class="material-icons text-lg">download</i> Download CV </a>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/projects",
    class: "hero-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300",
    style: { "border": "1px solid var(--border)", "color": "var(--text-heading)", "background": "var(--bg-card)" }
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` View Portfolio <i class="material-icons text-lg"${_scopeId}>arrow_forward</i>`);
      } else {
        return [
          createTextVNode(" View Portfolio "),
          createVNode("i", { class: "material-icons text-lg" }, "arrow_forward")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"><!--[-->`);
  ssrRenderList($data.highlights, (h, i) => {
    _push(ssrRenderComponent(_component_NuxtLink, {
      key: i,
      to: h.link,
      class: "card-glass--glass flex items-start gap-3 p-4 rounded-xl",
      style: { "text-decoration": "none", "display": "flex" }
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 gradient-bg" style="${ssrRenderStyle({ animation: "float 3s ease-in-out infinite", animationDelay: i * 0.3 + "s" })}"${_scopeId}><i class="material-icons text-white" style="${ssrRenderStyle({ "font-size": "20px" })}"${_scopeId}>${ssrInterpolate(h.icon)}</i></div><div${_scopeId}><h4 class="font-semibold text-lg" style="${ssrRenderStyle({ "color": "var(--text-heading)" })}"${_scopeId}>${ssrInterpolate(h.title)}</h4><p class="text-md mt-0.5" style="${ssrRenderStyle({ "color": "var(--text)" })}"${_scopeId}>${ssrInterpolate(h.text)}</p></div>`);
        } else {
          return [
            createVNode("div", {
              class: "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 gradient-bg",
              style: { animation: "float 3s ease-in-out infinite", animationDelay: i * 0.3 + "s" }
            }, [
              createVNode("i", {
                class: "material-icons text-white",
                style: { "font-size": "20px" }
              }, toDisplayString(h.icon), 1)
            ], 4),
            createVNode("div", null, [
              createVNode("h4", {
                class: "font-semibold text-lg",
                style: { "color": "var(--text-heading)" }
              }, toDisplayString(h.title), 1),
              createVNode("p", {
                class: "text-md mt-0.5",
                style: { "color": "var(--text)" }
              }, toDisplayString(h.text), 1)
            ])
          ];
        }
      }),
      _: 2
    }, _parent));
  });
  _push(`<!--]--></div><div class="hero-stats"><!--[-->`);
  ssrRenderList($data.DATA.stats, (s, i) => {
    _push(`<div class="flex items-center gap-4"><div class="text-center"><div class="hero-stat-value">${ssrInterpolate(s.value)}</div><div class="text-lg" style="${ssrRenderStyle({ "color": "var(--text-label)" })}">${ssrInterpolate(s.label)}</div></div>`);
    if (i < $data.DATA.stats.length - 1) {
      _push(`<div style="${ssrRenderStyle({ "width": "1px", "height": "40px", "background": "var(--border)" })}"></div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div>`);
  });
  _push(`<!--]--></div><div class="flex lg:hidden flex-wrap items-center justify-center gap-2 mt-8"><a${ssrRenderAttr("href", "https://" + $data.DATA.personal.linkedin)} target="_blank" class="theme-toggle flex items-center justify-center" title="LinkedIn" style="${ssrRenderStyle({ "width": "36px", "height": "36px" })}"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68zm1.39 9.94v-8.37H5.5v8.37h2.77z"></path></svg></a><a${ssrRenderAttr("href", $data.DATA.personal.website)} target="_blank" class="theme-toggle flex items-center justify-center" title="Portfolio" style="${ssrRenderStyle({ "width": "36px", "height": "36px" })}"><i class="material-icons" style="${ssrRenderStyle({ "font-size": "20px" })}">language</i></a><a href="https://github.com/amin670bd" target="_blank" class="theme-toggle flex items-center justify-center" title="GitHub" style="${ssrRenderStyle({ "width": "36px", "height": "36px" })}"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"></path></svg></a><a href="https://www.youtube.com/@aminur670" target="_blank" class="theme-toggle flex items-center justify-center" title="YouTube" style="${ssrRenderStyle({ "width": "36px", "height": "36px" })}"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"></path></svg></a><a${ssrRenderAttr("href", "https://wa.me/" + $data.DATA.personal.phone1.replace(/[^0-9]/g, ""))} target="_blank" class="theme-toggle flex items-center justify-center" title="WhatsApp" style="${ssrRenderStyle({ "width": "36px", "height": "36px" })}"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 2.097.602 4.055 1.638 5.708L2 22l4.374-1.604C8.02 21.378 9.965 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.833 0-3.557-.58-4.973-1.573l-.357-.237-2.597.954.96-2.549-.255-.38A7.956 7.956 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.19-5.94c-.23-.115-1.36-.67-1.57-.746-.21-.077-.363-.115-.516.115-.153.23-.593.746-.727.899-.134.153-.268.172-.498.057-.23-.115-.972-.358-1.85-1.143-.684-.613-1.146-1.37-1.28-1.602-.134-.23-.014-.355.101-.47.103-.103.23-.268.345-.402.115-.134.153-.23.23-.383.077-.153.038-.287-.019-.402-.057-.115-.516-1.244-.707-1.704-.186-.45-.374-.372-.516-.372-.134 0-.287-.019-.44-.019-.153 0-.402.057-.612.287-.21.23-.802.784-.802 1.913s.82 2.22.935 2.373c.115.153 1.614 2.465 3.91 3.456.546.236.972.377 1.305.482.548.173 1.048.149 1.442.09.44-.066 1.36-.555 1.552-1.092.192-.537.192-.997.134-1.093-.057-.096-.21-.153-.44-.268z"></path></svg></a></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-CzWvaD0E.mjs.map
