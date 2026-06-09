import { withCtx, createTextVNode, createVNode, toDisplayString, ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderSlot, ssrRenderClass } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-CyAuYzED.mjs';
import { u as useData } from './useData-h1AIsp2l.mjs';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue-router';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const useParticles = () => {
  let animId = null;
  let particles = [];
  let ctx = null;
  let w = 0, h = 0;
  let canvasRef = null;
  const resize = () => {
    if (!canvasRef) return;
    w = canvasRef.width = (void 0).innerWidth;
    h = canvasRef.height = (void 0).innerHeight;
  };
  const initParticles = (canvas) => {
    if (!canvas) return;
    canvasRef = canvas;
    ctx = canvas.getContext("2d");
    (void 0).addEventListener("resize", resize);
    resize();
    const count = Math.min(120, Math.floor(w * h / 1e4));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 2 + 1,
        a: Math.random() * 0.5 + 0.15
      });
    }
    draw();
  };
  const draw = () => {
    animId = requestAnimationFrame(draw);
    ctx.clearRect(0, 0, w, h);
    const isDark = (void 0).documentElement.classList.contains("dark");
    const color = isDark ? "20,184,166" : "20,184,166";
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},${p.a})`;
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
          ctx.strokeStyle = `rgba(${color},${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  };
  const destroyParticles = () => {
    if (animId) cancelAnimationFrame(animId);
    (void 0).removeEventListener("resize", resize);
  };
  return { initParticles, destroyParticles };
};
const _sfc_main$3 = {
  name: "ParticleCanvas",
  mounted() {
    const { initParticles, destroyParticles } = useParticles();
    this._destroy = destroyParticles;
    initParticles(this.$refs.canvas);
  },
  beforeUnmount() {
    if (this._destroy) this._destroy();
  }
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<canvas${ssrRenderAttrs(mergeProps({
    ref: "canvas",
    class: "particle-canvas"
  }, _attrs))}></canvas>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ParticleCanvas.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$3]]);
const _sfc_main$2 = {
  name: "ThemeToggle",
  inject: ["toggleDark"],
  data() {
    return {
      darkMode: true
    };
  },
  mounted() {
    const saved = localStorage.getItem("darkMode");
    const prefersDark = (void 0).matchMedia("(prefers-color-scheme: dark)").matches;
    this.darkMode = saved === "true" || saved === null && prefersDark;
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<button${ssrRenderAttrs(mergeProps({
    "aria-label": "Toggle dark mode",
    class: "theme-toggle flex items-center justify-center"
  }, _attrs))}><i class="material-icons" style="${ssrRenderStyle({ "font-size": "20px" })}">${ssrInterpolate($data.darkMode ? "light_mode" : "dark_mode")}</i></button>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ThemeToggle.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2]]);
const _imports_0 = publicAssetsURL("/images/whatsapp_qr.png");
const _sfc_main$1 = {
  name: "ContactModal",
  props: { show: Boolean },
  emits: ["close"],
  data() {
    return { DATA: useData() };
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  if ($props.show) {
    _push(`<div${ssrRenderAttrs(mergeProps({
      class: "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6",
      style: { "background": "rgba(0,0,0,0.65)", "backdrop-filter": "blur(16px)", "-webkit-backdrop-filter": "blur(16px)" }
    }, _attrs))}><div class="w-full md:max-w-4xl flex flex-col overflow-hidden rounded-xl" style="${ssrRenderStyle({ "max-height": "85dvh", "height": "85dvh", "background": "var(--bg-card)", "backdrop-filter": "blur(20px)", "-webkit-backdrop-filter": "blur(20px)", "border": "1px solid var(--border)" })}"><div class="flex items-center justify-between px-4 py-3 shrink-0" style="${ssrRenderStyle({ "border-bottom": "1px solid var(--border)" })}"><h2 class="text-base font-bold flex items-center gap-1.5" style="${ssrRenderStyle({ "color": "var(--text-heading)" })}"><i class="material-icons" style="${ssrRenderStyle({ "font-size": "18px", "color": "var(--primary)" })}">contact_phone</i> Contact </h2><button aria-label="Close contact modal" class="w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:bg-black/5" style="${ssrRenderStyle({ "color": "var(--text-label)" })}"><i class="material-icons" style="${ssrRenderStyle({ "font-size": "18px" })}">close</i></button></div><div class="flex-1 min-h-0 overflow-y-auto" style="${ssrRenderStyle({ "-webkit-overflow-scrolling": "touch" })}"><div class="grid md:grid-cols-2 gap-3 p-4"><div class="space-y-3"><p class="text-[11px] font-semibold tracking-wider" style="${ssrRenderStyle({ "color": "var(--text-label)" })}">WHATSAPP</p><a class="card-glass--glass flex flex-col items-center gap-3 p-4 rounded-xl" style="${ssrRenderStyle({ "text-decoration": "none" })}"><img${ssrRenderAttr("src", _imports_0)} alt="WhatsApp QR code for Md. Asaduzzaman (Aminur)" class="w-14 h-14 rounded-xl" style="${ssrRenderStyle({ "border": "2px solid var(--border)", "background": "white" })}"></a><a${ssrRenderAttr("href", "https://wa.me/" + $data.DATA.personal.phone1.replace(/[^0-9]/g, ""))} target="_blank" class="card-glass--glass flex items-start gap-3 p-4 rounded-xl" style="${ssrRenderStyle({ "text-decoration": "none", "display": "flex" })}"><div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 gradient-bg"><svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M12 2C6.477 2 2 6.477 2 12c0 2.097.602 4.055 1.638 5.708L2 22l4.374-1.604C8.02 21.378 9.965 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.833 0-3.557-.58-4.973-1.573l-.357-.237-2.597.954.96-2.549-.255-.38A7.956 7.956 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.19-5.94c-.23-.115-1.36-.67-1.57-.746-.21-.077-.363-.115-.516.115-.153.23-.593.746-.727.899-.134.153-.268.172-.498.057-.23-.115-.972-.358-1.85-1.143-.684-.613-1.146-1.37-1.28-1.602-.134-.23-.014-.355.101-.47.103-.103.23-.268.345-.402.115-.134.153-.23.23-.383.077-.153.038-.287-.019-.402-.057-.115-.516-1.244-.707-1.704-.186-.45-.374-.372-.516-.372-.134 0-.287-.019-.44-.019-.153 0-.402.057-.612.287-.21.23-.802.784-.802 1.913s.82 2.22.935 2.373c.115.153 1.614 2.465 3.91 3.456.546.236.972.377 1.305.482.548.173 1.048.149 1.442.09.44-.066 1.36-.555 1.552-1.092.192-.537.192-.997.134-1.093-.057-.096-.21-.153-.44-.268z"></path></svg></div><div><h4 class="font-semibold text-sm" style="${ssrRenderStyle({ "color": "#25D366" })}">${ssrInterpolate($data.DATA.personal.phone1)}</h4><p class="text-xs mt-0.5" style="${ssrRenderStyle({ "color": "var(--text)" })}">WhatsApp</p></div></a><a${ssrRenderAttr("href", "https://wa.me/" + $data.DATA.personal.phone2.replace(/[^0-9]/g, ""))} target="_blank" class="card-glass--glass flex items-start gap-3 p-4 rounded-xl" style="${ssrRenderStyle({ "text-decoration": "none", "display": "flex" })}"><div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 gradient-bg"><svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M12 2C6.477 2 2 6.477 2 12c0 2.097.602 4.055 1.638 5.708L2 22l4.374-1.604C8.02 21.378 9.965 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.833 0-3.557-.58-4.973-1.573l-.357-.237-2.597.954.96-2.549-.255-.38A7.956 7.956 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.19-5.94c-.23-.115-1.36-.67-1.57-.746-.21-.077-.363-.115-.516.115-.153.23-.593.746-.727.899-.134.153-.268.172-.498.057-.23-.115-.972-.358-1.85-1.143-.684-.613-1.146-1.37-1.28-1.602-.134-.23-.014-.355.101-.47.103-.103.23-.268.345-.402.115-.134.153-.23.23-.383.077-.153.038-.287-.019-.402-.057-.115-.516-1.244-.707-1.704-.186-.45-.374-.372-.516-.372-.134 0-.287-.019-.44-.019-.153 0-.402.057-.612.287-.21.23-.802.784-.802 1.913s.82 2.22.935 2.373c.115.153 1.614 2.465 3.91 3.456.546.236.972.377 1.305.482.548.173 1.048.149 1.442.09.44-.066 1.36-.555 1.552-1.092.192-.537.192-.997.134-1.093-.057-.096-.21-.153-.44-.268z"></path></svg></div><div><h4 class="font-semibold text-sm" style="${ssrRenderStyle({ "color": "#25D366" })}">${ssrInterpolate($data.DATA.personal.phone2)}</h4><p class="text-xs mt-0.5" style="${ssrRenderStyle({ "color": "var(--text)" })}">WhatsApp</p></div></a></div><div class="space-y-3"><p class="text-[11px] font-semibold tracking-wider" style="${ssrRenderStyle({ "color": "var(--text-label)" })}">EMAIL</p><a${ssrRenderAttr("href", "mailto:" + $data.DATA.personal.email)} class="card-glass--glass flex items-start gap-3 p-4 rounded-xl" style="${ssrRenderStyle({ "text-decoration": "none", "display": "flex" })}"><div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 gradient-bg"><i class="material-icons text-white" style="${ssrRenderStyle({ "font-size": "16px" })}">email</i></div><div><h4 class="font-semibold text-sm" style="${ssrRenderStyle({ "color": "var(--text-heading)" })}">${ssrInterpolate($data.DATA.personal.email)}</h4><p class="text-xs mt-0.5" style="${ssrRenderStyle({ "color": "var(--text)" })}">Email Primary</p></div></a><a${ssrRenderAttr("href", "mailto:" + $data.DATA.personal.email2)} class="card-glass--glass flex items-start gap-3 p-4 rounded-xl" style="${ssrRenderStyle({ "text-decoration": "none", "display": "flex" })}"><div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 gradient-bg"><i class="material-icons text-white" style="${ssrRenderStyle({ "font-size": "16px" })}">email</i></div><div><h4 class="font-semibold text-sm" style="${ssrRenderStyle({ "color": "var(--text-heading)" })}">${ssrInterpolate($data.DATA.personal.email2)}</h4><p class="text-xs mt-0.5" style="${ssrRenderStyle({ "color": "var(--text)" })}">Email Secondary</p></div></a></div></div></div></div></div>`);
  } else {
    _push(`<!---->`);
  }
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ContactModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]);
const useDarkMode = () => {
  const darkMode = ref(true);
  const toggleDark = () => {
    darkMode.value = !darkMode.value;
    (void 0).documentElement.classList.toggle("dark", darkMode.value);
    localStorage.setItem("darkMode", darkMode.value);
  };
  const initDarkMode = () => {
    const saved = localStorage.getItem("darkMode");
    const prefersDark = (void 0).matchMedia("(prefers-color-scheme: dark)").matches;
    darkMode.value = saved === "true" || saved === null && prefersDark;
    (void 0).documentElement.classList.toggle("dark", darkMode.value);
  };
  return { darkMode, toggleDark, initDarkMode };
};
const _sfc_main = {
  name: "AppLayout",
  provide() {
    return {
      toggleDark: this.toggleDark
    };
  },
  data() {
    return {
      DATA: useData(),
      mobileMenuOpen: false,
      showContactModal: false,
      showScrollTop: false,
      particleAnimId: null
    };
  },
  computed: {
    menuItems() {
      var _a;
      return ((_a = this.DATA) == null ? void 0 : _a.menuItems) || [];
    }
  },
  mounted() {
    const { toggleDark, initDarkMode } = useDarkMode();
    this.toggleDark = toggleDark;
    initDarkMode();
    (void 0).addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    (void 0).removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    toggleDark() {
    },
    closeMobile() {
      this.mobileMenuOpen = false;
    },
    scrollToTop() {
      (void 0).scrollTo({ top: 0, behavior: "smooth" });
    },
    handleScroll() {
      this.showScrollTop = (void 0).scrollY > 100;
    },
    getInitials(name) {
      return name == null ? void 0 : name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const _component_ParticleCanvas = __nuxt_component_0;
  const _component_NuxtLink = __nuxt_component_0$1;
  const _component_ThemeToggle = __nuxt_component_2;
  const _component_ContactModal = __nuxt_component_3;
  _push(`<div${ssrRenderAttrs(_attrs)}>`);
  _push(ssrRenderComponent(_component_ParticleCanvas, null, null, _parent));
  _push(`<nav class="mobile-nav"><div class="flex items-center justify-between px-4 h-full">`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/",
    onClick: $options.closeMobile,
    class: "text-xl font-extrabold tracking-tight gradient-text"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Amin670BD`);
      } else {
        return [
          createTextVNode("Amin670BD")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<div class="flex items-center gap-1.5 shrink-0"><a href="/cv.pdf" download class="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all duration-300 shrink-0" style="${ssrRenderStyle({ "height": "36px", "border": "1px solid var(--toggle-border)", "background": "var(--toggle-bg)", "backdrop-filter": "blur(6px)", "color": "var(--text-heading)" })}"><i class="material-icons" style="${ssrRenderStyle({ "font-size": "20px" })}">download</i><span class="download-cv-short">CV</span><span class="download-cv-full">Download CV</span></a><button class="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all duration-300 shrink-0" style="${ssrRenderStyle({ "height": "36px", "border": "1px solid var(--toggle-border)", "background": "var(--toggle-bg)", "backdrop-filter": "blur(6px)", "color": "var(--text-heading)" })}"><i class="material-icons" style="${ssrRenderStyle({ "font-size": "20px" })}">contact_phone</i> <span class="download-cv-full">Contacts</span></button>`);
  _push(ssrRenderComponent(_component_ThemeToggle, null, null, _parent));
  _push(`<button${ssrRenderAttr("aria-label", $data.mobileMenuOpen ? "Close menu" : "Open menu")} class="theme-toggle flex items-center justify-center"><i class="material-icons" style="${ssrRenderStyle({ "font-size": "20px" })}">${ssrInterpolate($data.mobileMenuOpen ? "close" : "menu")}</i></button></div></div></nav>`);
  if ($data.mobileMenuOpen) {
    _push(`<div class="fixed inset-0 z-40" style="${ssrRenderStyle({ "background": "rgba(0,0,0,0.4)", "backdrop-filter": "blur(4px)", "-webkit-backdrop-filter": "blur(4px)" })}"></div>`);
  } else {
    _push(`<!---->`);
  }
  if ($data.mobileMenuOpen) {
    _push(`<aside class="fixed top-0 right-0 h-full w-72 z-50 offcanvas-mobile" style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column" })}"><div class="flex-shrink-0"><div class="flex items-start justify-between p-6"><div class="text-center flex-1"><h2 class="text-xl font-bold" style="${ssrRenderStyle({ "color": "var(--sidebar-heading)" })}">${ssrInterpolate((_a = $data.DATA.personal) == null ? void 0 : _a.name)}</h2><p class="text-lg font-medium" style="${ssrRenderStyle({ "color": "var(--primary)" })}">(${ssrInterpolate((_b = $data.DATA.personal) == null ? void 0 : _b.nickname)})</p><p class="text-md mt-0.5" style="${ssrRenderStyle({ "color": "var(--sidebar-text)" })}">${ssrInterpolate((_c = $data.DATA.personal) == null ? void 0 : _c.title)}</p></div><button aria-label="Close menu" class="theme-toggle flex items-center justify-center"><i class="material-icons" style="${ssrRenderStyle({ "font-size": "18px" })}">close</i></button></div><hr style="${ssrRenderStyle({ "border-color": "var(--sidebar-divider)", "margin": "0 1.5rem" })}"></div><div class="px-6 py-3 space-y-0.5 flex-1 overflow-y-auto"><!--[-->`);
    ssrRenderList($options.menuItems, (item) => {
      _push(ssrRenderComponent(_component_NuxtLink, {
        key: item.path,
        onClick: $options.closeMobile,
        to: item.path,
        class: ["nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition", { "nav-link-active": _ctx.$route.path === item.path }]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="material-icons w-4 text-center" style="${ssrRenderStyle({ "font-size": "18px" })}"${_scopeId}>${ssrInterpolate(item.icon)}</i><span${_scopeId}>${ssrInterpolate(item.label)}</span>`);
          } else {
            return [
              createVNode("i", {
                class: "material-icons w-4 text-center",
                style: { "font-size": "18px" }
              }, toDisplayString(item.icon), 1),
              createVNode("span", null, toDisplayString(item.label), 1)
            ];
          }
        }),
        _: 2
      }, _parent));
    });
    _push(`<!--]--></div><div class="flex-shrink-0"><hr style="${ssrRenderStyle({ "border-color": "var(--sidebar-divider)", "margin": "0 1.5rem" })}"><div class="px-6 py-4 space-y-3"><a href="/cv.pdf" download class="btn-shimmer flex items-center justify-center gap-2 w-full py-2.5 px-4 text-white font-semibold rounded-xl gradient-bg transition-all duration-300" style="${ssrRenderStyle({ "box-shadow": "0 4px 12px rgba(20,184,166,0.25)" })}"><i class="material-icons">download</i> Download CV </a><div class="flex items-center justify-center gap-3 pt-1"><a${ssrRenderAttr("href", "https://" + ((_d = $data.DATA.personal) == null ? void 0 : _d.linkedin))} target="_blank" class="theme-toggle flex items-center justify-center" title="LinkedIn" style="${ssrRenderStyle({ "width": "36px", "height": "36px" })}"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68zm1.39 9.94v-8.37H5.5v8.37h2.77z"></path></svg></a><a${ssrRenderAttr("href", (_e = $data.DATA.personal) == null ? void 0 : _e.website)} target="_blank" class="theme-toggle flex items-center justify-center" title="Portfolio" style="${ssrRenderStyle({ "width": "36px", "height": "36px" })}"><i class="material-icons" style="${ssrRenderStyle({ "font-size": "20px" })}">language</i></a><a href="https://github.com/amin670bd" target="_blank" class="theme-toggle flex items-center justify-center" title="GitHub" style="${ssrRenderStyle({ "width": "36px", "height": "36px" })}"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"></path></svg></a><a href="https://www.youtube.com/@aminur670" target="_blank" class="theme-toggle flex items-center justify-center" title="YouTube" style="${ssrRenderStyle({ "width": "36px", "height": "36px" })}"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"></path></svg></a><a${ssrRenderAttr("href", "mailto:" + ((_f = $data.DATA.personal) == null ? void 0 : _f.email))} class="theme-toggle flex items-center justify-center" title="Email" style="${ssrRenderStyle({ "width": "36px", "height": "36px" })}"><i class="material-icons" style="${ssrRenderStyle({ "font-size": "20px" })}">email</i></a></div></div></div></aside>`);
  } else {
    _push(`<!---->`);
  }
  _push(ssrRenderComponent(_component_ContactModal, {
    show: $data.showContactModal,
    onClose: ($event) => $data.showContactModal = false
  }, null, _parent));
  _push(`<aside class="sidebar"><div class="sidebar-scroll"><div class="p-6 text-center"><div class="w-full sm:w-44 md:w-52 lg:w-60 mx-auto mb-4 rounded-2xl overflow-hidden aspect-square" style="${ssrRenderStyle({ "border": "3px solid rgba(20,184,166,0.3)" })}"><img${ssrRenderAttr("src", (_g = $data.DATA.personal) == null ? void 0 : _g.photo)}${ssrRenderAttr("alt", (_h = $data.DATA.personal) == null ? void 0 : _h.name)} class="w-full h-full object-cover" loading="lazy"></div><h2 class="text-xl font-bold" style="${ssrRenderStyle({ "color": "var(--sidebar-heading)" })}">${ssrInterpolate((_i = $data.DATA.personal) == null ? void 0 : _i.name)}</h2><p class="text-lg font-medium" style="${ssrRenderStyle({ "color": "var(--primary)" })}">(${ssrInterpolate((_j = $data.DATA.personal) == null ? void 0 : _j.nickname)})</p><p class="text-lg mt-0.5" style="${ssrRenderStyle({ "color": "var(--sidebar-text)" })}">${ssrInterpolate((_k = $data.DATA.personal) == null ? void 0 : _k.title)}</p></div><div class="px-4 space-y-0.5"><!--[-->`);
  ssrRenderList($options.menuItems, (item) => {
    _push(ssrRenderComponent(_component_NuxtLink, {
      key: item.path,
      to: item.path,
      class: ["nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition", { "nav-link-active": _ctx.$route.path === item.path }],
      onClick: $options.closeMobile
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<i class="material-icons w-4 text-center" style="${ssrRenderStyle({ "font-size": "18px" })}"${_scopeId}>${ssrInterpolate(item.icon)}</i><span${_scopeId}>${ssrInterpolate(item.label)}</span>`);
        } else {
          return [
            createVNode("i", {
              class: "material-icons w-4 text-center",
              style: { "font-size": "18px" }
            }, toDisplayString(item.icon), 1),
            createVNode("span", null, toDisplayString(item.label), 1)
          ];
        }
      }),
      _: 2
    }, _parent));
  });
  _push(`<!--]--></div></div><div class="px-6 py-4 space-y-3" style="${ssrRenderStyle({ "border-top": "1px solid var(--sidebar-divider)" })}"><a href="/cv.pdf" download class="btn-shimmer flex items-center justify-center gap-2 w-full py-2.5 px-4 text-white font-semibold rounded-xl gradient-bg transition-all duration-300" style="${ssrRenderStyle({ "box-shadow": "0 4px 12px rgba(20,184,166,0.25)" })}"><i class="material-icons">download</i> Download CV </a><div class="flex items-center justify-between"><span class="text-lg flex items-center gap-1.5" style="${ssrRenderStyle({ "color": "var(--sidebar-text)" })}"><span class="w-1.5 h-1.5 rounded-full" style="${ssrRenderStyle({ "background": "var(--accent-emerald)", "box-shadow": "0 0 6px rgba(16,185,129,0.4)" })}"></span> Available</span><div class="flex items-center gap-2"><button class="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-300" style="${ssrRenderStyle({ "border": "1px solid var(--primary)", "color": "var(--primary)" })}"><i class="material-icons" style="${ssrRenderStyle({ "font-size": "16px" })}">contact_phone</i> Contacts </button>`);
  _push(ssrRenderComponent(_component_ThemeToggle, null, null, _parent));
  _push(`</div></div></div></aside><main class="main-content">`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`<div class="footer"><p>\xA9 2026 Md. Asaduzzaman (Aminur). All rights reserved.</p></div></main><button aria-label="Scroll to top" class="${ssrRenderClass([{ visible: $data.showScrollTop }, "scroll-top gradient-bg"])}" style="${ssrRenderStyle({ boxShadow: "0 4px 15px rgba(20,184,166,0.4)" })}"><i class="material-icons" style="${ssrRenderStyle({ "transition": "transform 0.3s ease" })}">arrow_upward</i></button></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { _default as default };
//# sourceMappingURL=default-wa-4cL9R.mjs.map
