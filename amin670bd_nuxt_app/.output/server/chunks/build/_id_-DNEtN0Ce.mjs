import { _ as __nuxt_component_0 } from './nuxt-link-CyAuYzED.mjs';
import { u as useData } from './useData-h1AIsp2l.mjs';
import { s as setInterval } from './interval-CgcWAxhf.mjs';
import { withCtx, createTextVNode, createVNode, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
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
  name: "ProjectDetailView",
  data() {
    return {
      DATA: useData(),
      currentSlide: 0,
      projectImages: null,
      projectMeta: null,
      slideTimer: null
    };
  },
  computed: {
    project() {
      var _a;
      const id = this.$route.params.id;
      return ((_a = this.DATA.projectDetails) == null ? void 0 : _a[id]) || null;
    },
    slideImages() {
      var _a;
      if (this.projectImages) return this.projectImages;
      const fallback = ((_a = this.project) == null ? void 0 : _a.images) || [];
      return fallback.map((f) => typeof f === "string" ? { src: f, title: "", desc: "" } : f);
    }
  },
  watch: {
    "$route.params.id": {
      immediate: true,
      handler(id) {
        this.stopAutoSlide();
        if (!id) return;
        this.currentSlide = 0;
        this.projectImages = null;
        this.projectMeta = null;
        fetch("/images/projects/" + id + "/project-image.json").then((r) => r.ok ? r.json() : { images: [] }).then((data) => {
          if (data.images && data.images.length) this.projectImages = data.images.map((f) => typeof f === "string" ? { src: "/images/projects/" + id + "/" + f, title: "", desc: "" } : { ...f, src: "/images/projects/" + id + "/" + f.src });
          if (data.title) this.projectMeta = { title: data.title, company: data.company, tech: data.tech, description: data.description };
          this.startAutoSlide();
        }).catch(() => {
          this.startAutoSlide();
        });
      }
    }
  },
  methods: {
    placeholderImg(e) {
      e.target.style.display = "none";
      const parent = e.target.parentElement;
      const ph = (void 0).createElement("div");
      ph.className = "img-placeholder";
      parent.appendChild(ph);
    },
    prevSlide() {
      this.currentSlide = this.currentSlide > 0 ? this.currentSlide - 1 : this.slideImages.length - 1;
      this.stopAutoSlide();
      this.startAutoSlide();
    },
    nextSlide() {
      this.currentSlide = this.currentSlide < this.slideImages.length - 1 ? this.currentSlide + 1 : 0;
      this.stopAutoSlide();
      this.startAutoSlide();
    },
    goToSlide(i) {
      this.currentSlide = i;
      this.stopAutoSlide();
      this.startAutoSlide();
    },
    startAutoSlide() {
      if (this.slideTimer) clearInterval(this.slideTimer);
      if (this.slideImages.length > 1) this.slideTimer = setInterval(this.nextSlide);
    },
    stopAutoSlide() {
      if (this.slideTimer) {
        clearInterval(this.slideTimer);
        this.slideTimer = null;
      }
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  var _a, _b, _c;
  const _component_NuxtLink = __nuxt_component_0;
  if ($options.project) {
    _push(`<div${ssrRenderAttrs(_attrs)}><div class="hidden lg:flex items-center gap-2 text-sm font-medium px-6 py-3 sticky top-0 z-20" style="${ssrRenderStyle({ "background": "var(--bg)", "backdrop-filter": "blur(20px)", "-webkit-backdrop-filter": "blur(20px)", "border-bottom": "1px solid var(--border)", "color": "var(--text-label)" })}">`);
    _push(ssrRenderComponent(_component_NuxtLink, {
      to: "/",
      style: { "color": "var(--primary)" },
      class: "hover:underline"
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`Home`);
        } else {
          return [
            createTextVNode("Home")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`<i class="material-icons" style="${ssrRenderStyle({ "font-size": "14px" })}">chevron_right</i>`);
    _push(ssrRenderComponent(_component_NuxtLink, {
      to: "/projects",
      style: { "color": "var(--primary)" },
      class: "hover:underline"
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`Projects`);
        } else {
          return [
            createTextVNode("Projects")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`<i class="material-icons" style="${ssrRenderStyle({ "font-size": "14px" })}">chevron_right</i><span class="truncate max-w-xs" style="${ssrRenderStyle({ "color": "var(--text-heading)" })}">${ssrInterpolate($options.project.title)}</span></div><div class="px-4 sm:px-8 lg:px-16 mb-6 project-detail-hero"><div class="rounded-xl" style="${ssrRenderStyle({ "background": "var(--bg-card)", "backdrop-filter": "blur(20px)", "-webkit-backdrop-filter": "blur(20px)", "border": "1px solid var(--border)", "padding": "clamp(20px,4vw,36px)", "margin-top": "clamp(16px,3vw,32px)" })}"><div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"><div class="flex-1 min-w-0">`);
    if ($options.project.id === ((_a = $data.DATA.featuredProject) == null ? void 0 : _a.id) || $options.project.featured) {
      _push(`<span class="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3" style="${ssrRenderStyle({ "background": "rgba(20,184,166,0.15)", "color": "var(--primary-light)" })}">TOP ACHIEVEMENT</span>`);
    } else {
      _push(`<!---->`);
    }
    _push(`<h1 class="font-extrabold gradient-text" style="${ssrRenderStyle({ "font-size": "clamp(1.5rem,4vw,2.2rem)", "line-height": "1.2" })}">${ssrInterpolate($options.project.title)}</h1><p class="text-sm sm:text-base mt-1" style="${ssrRenderStyle({ "color": "var(--text-label)" })}">${ssrInterpolate($options.project.subtitle)}</p></div>`);
    if ($options.project.company || $options.project.date) {
      _push(`<div class="flex-shrink-0 sm:text-right flex flex-col items-end gap-3">`);
      if ($options.project.date) {
        _push(`<div class="sm:text-right"><small style="${ssrRenderStyle({ "opacity": "0.5", "display": "block", "font-size": "0.75rem", "text-transform": "uppercase", "letter-spacing": "0.5px" })}">Year</small><strong style="${ssrRenderStyle({ "color": "var(--text-heading)", "font-size": "clamp(0.95rem,2vw,1.15rem)" })}">${ssrInterpolate($options.project.date.substring(0, 4))}</strong></div>`);
      } else {
        _push(`<!---->`);
      }
      if ($options.project.company) {
        _push(`<div class="sm:text-right"><small style="${ssrRenderStyle({ "opacity": "0.5", "display": "block", "font-size": "0.75rem", "text-transform": "uppercase", "letter-spacing": "0.5px" })}">Company</small><strong style="${ssrRenderStyle({ "color": "var(--text-heading)", "font-size": "clamp(0.95rem,2vw,1.15rem)" })}">${ssrInterpolate($options.project.company)}</strong></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div>`);
    if ($data.projectMeta) {
      _push(`<div class="mt-5 pt-4" style="${ssrRenderStyle({ "border-top": "1px solid var(--border)" })}">`);
      if ($data.projectMeta.tech) {
        _push(`<div class="flex flex-wrap items-center gap-2 mb-3"><!--[-->`);
        ssrRenderList($data.projectMeta.tech.split(",").map((s) => s.trim()), (t) => {
          _push(`<span class="text-xs font-medium px-3 py-1 rounded-full" style="${ssrRenderStyle({ "background": "rgba(20,184,166,0.12)", "color": "var(--primary-light)" })}">${ssrInterpolate(t)}</span>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if ($data.projectMeta.description) {
        _push(`<p style="${ssrRenderStyle({ "color": "var(--text)", "font-size": "clamp(0.85rem,1.5vw,0.95rem)", "line-height": "1.7" })}">${ssrInterpolate($data.projectMeta.description)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div></div>`);
    if ($options.slideImages.length) {
      _push(`<div class="px-4 sm:px-8 lg:px-16 mb-6"><div class="relative rounded-xl overflow-hidden" style="${ssrRenderStyle({ "border": "1px solid var(--border)", "box-shadow": "var(--shadow-lg)", "aspect-ratio": "16/9", "background": "var(--bg-card)" })}"><img${ssrRenderAttr("src", typeof $options.slideImages[$data.currentSlide] === "string" ? $options.slideImages[$data.currentSlide] : $options.slideImages[$data.currentSlide].src)}${ssrRenderAttr("alt", $options.project.title + " screenshot")} class="w-full h-full" style="${ssrRenderStyle({ "object-fit": "contain" })}" loading="lazy"></div><div class="mt-2 mb-3" style="${ssrRenderStyle({ "background": "var(--bg-card)", "padding": "8px 14px", "border-radius": "8px", "border": "1px solid var(--border)" })}"><h4 class="text-lg font-bold" style="${ssrRenderStyle({ "color": "var(--text-heading)" })}">${ssrInterpolate(typeof $options.slideImages[$data.currentSlide] !== "string" && $options.slideImages[$data.currentSlide].title ? $options.slideImages[$data.currentSlide].title : ((_b = $data.projectMeta) == null ? void 0 : _b.title) || $options.project.title)}</h4><p class="text-base mt-1" style="${ssrRenderStyle({ "color": "var(--text-label)" })}">${ssrInterpolate(typeof $options.slideImages[$data.currentSlide] !== "string" && $options.slideImages[$data.currentSlide].desc ? $options.slideImages[$data.currentSlide].desc : ((_c = $data.projectMeta) == null ? void 0 : _c.description) || $options.project.abstract)}</p></div>`);
      if ($options.slideImages.length > 1) {
        _push(`<div class="flex items-center gap-2 mt-2"><button aria-label="Previous slide" class="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110" style="${ssrRenderStyle({ "background": "var(--bg-card)", "color": "var(--text-heading)", "border": "1px solid var(--border)", "cursor": "pointer" })}"><i class="material-icons" style="${ssrRenderStyle({ "font-size": "18px" })}">chevron_left</i></button><div class="flex items-center gap-2 overflow-x-auto pb-1 flex-1" style="${ssrRenderStyle({ "scrollbar-width": "thin" })}"><!--[-->`);
        ssrRenderList($options.slideImages, (img, i) => {
          _push(`<button${ssrRenderAttr("aria-label", "Go to slide " + (i + 1))} class="flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300" style="${ssrRenderStyle({ border: i === $data.currentSlide ? "2px solid var(--primary)" : "2px solid transparent", opacity: i === $data.currentSlide ? 1 : 0.5, cursor: "pointer", padding: 0, background: "var(--bg-card)" })}"><img${ssrRenderAttr("src", typeof img === "string" ? img : img.src)}${ssrRenderAttr("alt", $options.project.title + " thumbnail")} style="${ssrRenderStyle({ "width": "80px", "height": "60px", "object-fit": "cover", "display": "block" })}" loading="lazy"></button>`);
        });
        _push(`<!--]--></div><button aria-label="Next slide" class="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110" style="${ssrRenderStyle({ "background": "var(--bg-card)", "color": "var(--text-heading)", "border": "1px solid var(--border)", "cursor": "pointer" })}"><i class="material-icons" style="${ssrRenderStyle({ "font-size": "18px" })}">chevron_right</i></button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    } else {
      _push(`<div class="px-4 sm:px-8 lg:px-16 mb-6" style="${ssrRenderStyle({ "height": "200px" })}"><div class="rounded-xl img-placeholder" style="${ssrRenderStyle({ "height": "100%" })}"></div></div>`);
    }
    _push(`<div class="px-4 sm:px-8 lg:px-16 mb-8"><div class="grid grid-cols-2 lg:grid-cols-4 gap-4"><!--[-->`);
    ssrRenderList($options.project.metrics, (m) => {
      _push(`<div class="card-glass text-center py-5 px-5"><div class="text-3xl font-extrabold gradient-text">${ssrInterpolate(m.value)}</div><div class="text-md font-medium mt-1" style="${ssrRenderStyle({ "color": "var(--text-label)" })}">${ssrInterpolate(m.label)}</div></div>`);
    });
    _push(`<!--]--></div></div><div class="px-4 sm:px-8 lg:px-16 pb-10"><div class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-2 space-y-6"><div class="card-glass p-6"><h2 class="text-lg font-bold mb-4 flex items-center gap-3" style="${ssrRenderStyle({ "border-left": "4px solid var(--primary)", "padding-left": "12px" })}">System Abstract &amp; Objective</h2><p style="${ssrRenderStyle({ "color": "var(--text)" })}">${ssrInterpolate($options.project.abstract)}</p></div><div class="card-glass p-6"><h2 class="text-lg font-bold mb-4 flex items-center gap-3" style="${ssrRenderStyle({ "border-left": "4px solid var(--primary)", "padding-left": "12px" })}">Precision Engineering &amp; Program Flow</h2><!--[-->`);
    ssrRenderList($options.project.flow, (step, i) => {
      _push(`<div class="flex gap-3 mb-4"><div class="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white flex-shrink-0"><i class="material-icons" style="${ssrRenderStyle({ "font-size": "20px" })}">${ssrInterpolate(step.icon)}</i></div><div><h4 class="font-bold text-lg" style="${ssrRenderStyle({ "color": "var(--text-heading)" })}">${ssrInterpolate(step.title)}</h4><p class="text-md mt-1" style="${ssrRenderStyle({ "color": "var(--text)" })}">${ssrInterpolate(step.text)}</p></div></div>`);
    });
    _push(`<!--]--></div><div class="card-glass p-6"><h2 class="text-lg font-bold mb-4 flex items-center gap-3" style="${ssrRenderStyle({ "border-left": "4px solid var(--primary)", "padding-left": "12px" })}">Key Achievements</h2><ul class="space-y-2"><!--[-->`);
    ssrRenderList($options.project.details, (d, i) => {
      _push(`<li class="flex items-start gap-2 text-md"><i class="material-icons" style="${ssrRenderStyle({ "color": "var(--primary)", "font-size": "18px", "margin-top": "3px" })}">check_circle</i><span>${ssrInterpolate(d)}</span></li>`);
    });
    _push(`<!--]--></ul></div></div><div class="space-y-4"><div class="card-glass p-6"><span class="text-md font-bold uppercase tracking-wider" style="${ssrRenderStyle({ "color": "var(--primary)" })}">Tech Stack</span><div class="flex flex-wrap gap-2 mt-3"><!--[-->`);
    ssrRenderList($options.project.tech, (t) => {
      _push(`<span class="skill-pill">${ssrInterpolate(t)}</span>`);
    });
    _push(`<!--]--></div></div><div class="card-glass p-6" style="${ssrRenderStyle({ "background": "var(--sidebar-bg)", "color": "var(--sidebar-text)" })}"><h4 class="font-bold text-lg mb-3" style="${ssrRenderStyle({ "color": "var(--sidebar-heading)" })}">Need Something Similar?</h4><p class="text-md mb-4">I build specialized industrial digital solutions, ERP integrations, and automation tools.</p>`);
    _push(ssrRenderComponent(_component_NuxtLink, {
      to: "/contact",
      class: "inline-block w-full py-2.5 text-center text-lg font-semibold rounded-xl gradient-bg text-white transition"
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(` Hire Me for This Project `);
        } else {
          return [
            createTextVNode(" Hire Me for This Project ")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</div>`);
    _push(ssrRenderComponent(_component_NuxtLink, {
      to: "/projects",
      class: "inline-flex items-center gap-2 text-lg font-medium hover:underline",
      style: { "color": "var(--primary)" }
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`<i class="material-icons" style="${ssrRenderStyle({ "font-size": "16px" })}"${_scopeId}>arrow_back</i> Back to Projects `);
        } else {
          return [
            createVNode("i", {
              class: "material-icons",
              style: { "font-size": "16px" }
            }, "arrow_back"),
            createTextVNode(" Back to Projects ")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</div></div></div></div>`);
  } else {
    _push(`<div${ssrRenderAttrs(mergeProps({ class: "section text-center" }, _attrs))}><p>Project not found.</p>`);
    _push(ssrRenderComponent(_component_NuxtLink, {
      to: "/projects",
      style: { "color": "var(--primary)" }
    }, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`Back to Projects`);
        } else {
          return [
            createTextVNode("Back to Projects")
          ];
        }
      }),
      _: 1
    }, _parent));
    _push(`</div>`);
  }
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/project/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { _id_ as default };
//# sourceMappingURL=_id_-DNEtN0Ce.mjs.map
