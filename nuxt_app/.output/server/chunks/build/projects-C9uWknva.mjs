import { _ as __nuxt_component_0 } from './nuxt-link-CyAuYzED.mjs';
import { u as useData } from './useData-h1AIsp2l.mjs';
import { s as setInterval } from './interval-CgcWAxhf.mjs';
import { mergeProps, withCtx, createTextVNode, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderComponent, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
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
  name: "ProjectsView",
  data() {
    return {
      DATA: useData(),
      activeFilter: "all",
      selectedYear: "all",
      featSlide: 0,
      featImages: null,
      featProjectMeta: null,
      featSlideTimer: null
    };
  },
  computed: {
    allProjects() {
      const items = [];
      if (!this.DATA.projectCategories) return items;
      this.DATA.projectCategories.forEach((cat) => {
        cat.items.forEach((item) => {
          items.push({ ...item, categoryKey: cat.key, categoryName: cat.name, categoryIcon: cat.icon });
        });
      });
      return items;
    },
    availableYears() {
      const years = /* @__PURE__ */ new Set();
      this.allProjects.forEach((p) => {
        if (p.date) years.add(p.date.substring(0, 4));
      });
      return [...years].sort().reverse();
    },
    filteredProjects() {
      let items = this.activeFilter === "all" ? this.allProjects : this.allProjects.filter((p) => p.categoryKey === this.activeFilter);
      if (this.selectedYear !== "all") items = items.filter((p) => p.date && p.date.startsWith(this.selectedYear));
      return items;
    },
    featSlideImages() {
      var _a;
      if (this.featImages) return this.featImages;
      const fallback = ((_a = this.DATA.featuredProject) == null ? void 0 : _a.images) || [];
      return fallback.map((f) => typeof f === "string" ? { src: f, title: "", desc: "" } : f);
    }
  },
  methods: {
    setFilter(key) {
      this.activeFilter = key;
    },
    setYear(year) {
      this.selectedYear = year;
    },
    prevFeat() {
      this.featSlide = this.featSlide > 0 ? this.featSlide - 1 : this.featSlideImages.length - 1;
      this.stopFeatSlide();
      this.startFeatSlide();
    },
    nextFeat() {
      this.featSlide = this.featSlide < this.featSlideImages.length - 1 ? this.featSlide + 1 : 0;
      this.stopFeatSlide();
      this.startFeatSlide();
    },
    goFeat(i) {
      this.featSlide = i;
      this.stopFeatSlide();
      this.startFeatSlide();
    },
    startFeatSlide() {
      if (this.featSlideTimer) clearInterval(this.featSlideTimer);
      this.featSlideTimer = setInterval(this.nextFeat);
    },
    stopFeatSlide() {
      if (this.featSlideTimer) {
        clearInterval(this.featSlideTimer);
        this.featSlideTimer = null;
      }
    }
  },
  mounted() {
    var _a;
    const id = (_a = this.DATA.featuredProject) == null ? void 0 : _a.id;
    if (!id) return;
    fetch("/images/projects/" + id + "/project-image.json").then((r) => r.ok ? r.json() : { images: [] }).then((data) => {
      if (data.images && data.images.length) this.featImages = data.images.map((f) => typeof f === "string" ? { src: "/images/projects/" + id + "/" + f, title: "", desc: "" } : { ...f, src: "/images/projects/" + id + "/" + f.src });
      if (data.title) this.featProjectMeta = { title: data.title, company: data.company, tech: data.tech, description: data.description };
      this.startFeatSlide();
    }).catch(() => {
      this.startFeatSlide();
    });
  },
  beforeUnmount() {
    this.stopFeatSlide();
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  var _a, _b, _c, _d;
  const _component_NuxtLink = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "section" }, _attrs))}><span class="section-tag">Case Studies</span><h1 class="section-title">Key Projects &amp; Recent Works</h1>`);
  if ((_a = $data.DATA.featuredProject) == null ? void 0 : _a.title) {
    _push(`<div class="card-glass-alt p-6 lg:p-8 mb-10"><span class="inline-block text-md font-bold px-3 py-1 rounded-full mb-4 gradient-bg text-white">\u{1F3C6} Top Achievement</span><h3 class="text-xl lg:text-2xl font-extrabold mb-4" style="${ssrRenderStyle({ "color": "var(--sidebar-heading)" })}">${ssrInterpolate($data.DATA.featuredProject.title)}</h3>`);
    if ($options.featSlideImages.length) {
      _push(`<div class="relative rounded-xl overflow-hidden" style="${ssrRenderStyle({ "border": "1px solid var(--sidebar-divider)", "aspect-ratio": "16/9", "background": "var(--bg-card)" })}"><img${ssrRenderAttr("src", typeof $options.featSlideImages[$data.featSlide] === "string" ? $options.featSlideImages[$data.featSlide] : $options.featSlideImages[$data.featSlide].src)}${ssrRenderAttr("alt", $data.DATA.featuredProject.title + " screenshot")} class="w-full h-full" style="${ssrRenderStyle({ "object-fit": "contain" })}" loading="lazy"></div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`<div class="mt-2 mb-3" style="${ssrRenderStyle({ "background": "var(--bg-card)", "padding": "8px 14px", "border-radius": "8px", "border": "1px solid var(--border)" })}"><h4 class="text-lg font-bold" style="${ssrRenderStyle({ "color": "var(--text-heading)" })}">${ssrInterpolate(typeof $options.featSlideImages[$data.featSlide] !== "string" && $options.featSlideImages[$data.featSlide].title ? $options.featSlideImages[$data.featSlide].title : ((_b = $data.featProjectMeta) == null ? void 0 : _b.title) || $data.DATA.featuredProject.title)}</h4><p class="text-base mt-1" style="${ssrRenderStyle({ "color": "var(--text-label)" })}">${ssrInterpolate(typeof $options.featSlideImages[$data.featSlide] !== "string" && $options.featSlideImages[$data.featSlide].desc ? $options.featSlideImages[$data.featSlide].desc : ((_c = $data.featProjectMeta) == null ? void 0 : _c.description) || $data.DATA.featuredProject.description)}</p></div>`);
    if ($options.featSlideImages.length > 1) {
      _push(`<div class="flex items-center gap-2 mt-2 mb-6"><button aria-label="Previous slide" class="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110" style="${ssrRenderStyle({ "background": "var(--bg-card)", "color": "var(--text-heading)", "border": "1px solid var(--border)", "cursor": "pointer" })}"><i class="material-icons" style="${ssrRenderStyle({ "font-size": "18px" })}">chevron_left</i></button><div class="flex items-center gap-2 overflow-x-auto pb-1 flex-1" style="${ssrRenderStyle({ "scrollbar-width": "thin" })}"><!--[-->`);
      ssrRenderList($options.featSlideImages, (img, i) => {
        _push(`<button${ssrRenderAttr("aria-label", "Go to slide " + (i + 1))} class="flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300" style="${ssrRenderStyle({ border: i === $data.featSlide ? "2px solid var(--primary)" : "2px solid transparent", opacity: i === $data.featSlide ? 1 : 0.5, cursor: "pointer", padding: 0, background: "var(--bg-card)" })}"><img${ssrRenderAttr("src", typeof img === "string" ? img : img.src)}${ssrRenderAttr("alt", $data.DATA.featuredProject.title + " thumbnail")} style="${ssrRenderStyle({ "width": "80px", "height": "60px", "object-fit": "cover", "display": "block" })}" loading="lazy"></button>`);
      });
      _push(`<!--]--></div><button aria-label="Next slide" class="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110" style="${ssrRenderStyle({ "background": "var(--bg-card)", "color": "var(--text-heading)", "border": "1px solid var(--border)", "cursor": "pointer" })}"><i class="material-icons" style="${ssrRenderStyle({ "font-size": "18px" })}">chevron_right</i></button></div>`);
    } else {
      _push(`<!---->`);
    }
    if ($data.featProjectMeta) {
      _push(`<div class="card-glass p-4 rounded-xl mb-4"><h4 class="text-sm font-extrabold gradient-text mb-1">${ssrInterpolate($data.featProjectMeta.title)}</h4>`);
      if ($data.featProjectMeta.company) {
        _push(`<p class="text-xs" style="${ssrRenderStyle({ "color": "var(--text-label)" })}">${ssrInterpolate($data.featProjectMeta.company)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if ($data.featProjectMeta.tech) {
        _push(`<p class="text-xs" style="${ssrRenderStyle({ "color": "var(--primary)" })}">${ssrInterpolate($data.featProjectMeta.tech)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if ($data.featProjectMeta.description) {
        _push(`<p class="text-xs mt-1" style="${ssrRenderStyle({ "color": "var(--text)" })}">${ssrInterpolate($data.featProjectMeta.description)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    } else {
      _push(`<!---->`);
    }
    if ($data.DATA.featuredProject.tech) {
      _push(`<p class="text-md mb-2"><span class="font-semibold">Technologies:</span> ${ssrInterpolate($data.DATA.featuredProject.tech)}</p>`);
    } else {
      _push(`<!---->`);
    }
    if ($data.DATA.featuredProject.company) {
      _push(`<p class="text-md mb-4"><span class="font-semibold">Company:</span> ${ssrInterpolate($data.DATA.featuredProject.company)}</p>`);
    } else {
      _push(`<!---->`);
    }
    if ($data.DATA.featuredProject.details) {
      _push(`<ul class="space-y-2 text-md mb-5"><!--[-->`);
      ssrRenderList($data.DATA.featuredProject.details, (d, i) => {
        _push(`<li class="flex items-start gap-2"><i class="material-icons" style="${ssrRenderStyle({ "color": "var(--primary-light)", "font-size": "18px", "margin-top": "3px" })}">check_circle</i><span>${ssrInterpolate(d)}</span></li>`);
      });
      _push(`<!--]--></ul>`);
    } else {
      _push(`<!---->`);
    }
    if ($data.DATA.featuredProject.id) {
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/project/" + $data.DATA.featuredProject.id,
        class: "inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-bg text-white text-lg font-semibold transition"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Project Details <i class="material-icons" style="${ssrRenderStyle({ "font-size": "14px" })}"${_scopeId}>open_in_new</i>`);
          } else {
            return [
              createTextVNode(" Project Details "),
              createVNode("i", {
                class: "material-icons",
                style: { "font-size": "14px" }
              }, "open_in_new")
            ];
          }
        }),
        _: 1
      }, _parent));
    } else {
      _push(`<!---->`);
    }
    _push(`</div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<span class="section-tag">All Works</span><h2 class="section-title">Projects &amp; Client Works</h2>`);
  if ($options.allProjects.length) {
    _push(`<div class="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 mb-6 pt-4 pb-3 -mx-6 px-6" style="${ssrRenderStyle({ "background": "var(--bg)", "backdrop-filter": "blur(20px)", "-webkit-backdrop-filter": "blur(20px)", "border-bottom": "1px solid var(--border)" })}"><div class="flex flex-wrap gap-2 items-center"><!--[-->`);
    ssrRenderList([{ key: "all", label: "All" }].concat($data.DATA.projectCategories.map((c) => ({ key: c.key, label: c.name }))), (cat) => {
      _push(`<button class="${ssrRenderClass([{ active: $data.activeFilter === cat.key }, "project-filter-btn"])}">${ssrInterpolate(cat.label)}</button>`);
    });
    _push(`<!--]--></div><div class="flex items-center gap-1.5 shrink-0"><span class="text-sm font-medium" style="${ssrRenderStyle({ "color": "var(--text-label)" })}">Year:</span><select class="text-sm font-medium px-2 py-1 rounded-lg" style="${ssrRenderStyle({ "background": "var(--bg-card)", "color": "var(--text-heading)", "border": "1px solid var(--border)", "cursor": "pointer", "outline": "none" })}"><option value="all"${ssrIncludeBooleanAttr(Array.isArray($data.selectedYear) ? ssrLooseContain($data.selectedYear, "all") : ssrLooseEqual($data.selectedYear, "all")) ? " selected" : ""}>All</option><!--[-->`);
    ssrRenderList($options.availableYears, (y) => {
      _push(`<option${ssrRenderAttr("value", y)}${ssrIncludeBooleanAttr(Array.isArray($data.selectedYear) ? ssrLooseContain($data.selectedYear, y) : ssrLooseEqual($data.selectedYear, y)) ? " selected" : ""}>${ssrInterpolate(y)}</option>`);
    });
    _push(`<!--]--></select></div></div>`);
  } else {
    _push(`<!---->`);
  }
  if ($options.filteredProjects.length) {
    _push(`<div${ssrRenderAttrs({
      key: $data.activeFilter + "-" + $data.selectedYear,
      name: "project",
      class: "grid grid-cols-1 sm:grid-cols-2 gap-6",
      mode: "out-in"
    })}>`);
    ssrRenderList($options.filteredProjects, (project, i) => {
      _push(`<div class="project-card-item rounded-xl p-5 flex flex-col"><div class="flex items-center justify-between mb-3"><span class="project-cat-tag text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1"><i class="material-icons text-xs">${ssrInterpolate(project.categoryIcon)}</i> ${ssrInterpolate(project.categoryName)}</span><div class="flex items-center gap-2 min-w-0">`);
      if (project.date) {
        _push(`<span class="text-xs font-medium px-2 py-0.5 rounded shrink-0" style="${ssrRenderStyle({ "background": "rgba(20,184,166,0.12)", "color": "var(--primary-light)" })}">${ssrInterpolate(project.date.substring(0, 4))}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (project.tech) {
        _push(`<span class="text-xs truncate" style="${ssrRenderStyle({ "color": "var(--text-label)" })}">${ssrInterpolate(project.tech)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (project.id) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/project/" + project.id,
          class: "project-title-link font-semibold text-base"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(project.title)}`);
            } else {
              return [
                createTextVNode(toDisplayString(project.title), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      } else {
        _push(`<span class="font-semibold text-base" style="${ssrRenderStyle({ "color": "var(--text-heading)" })}">${ssrInterpolate(project.title)}</span>`);
      }
      _push(`<p class="text-base mt-2 mb-4 leading-relaxed" style="${ssrRenderStyle({ "color": "var(--text)" })}">${ssrInterpolate(project.description)}</p>`);
      if (project.id) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/project/" + project.id,
          class: "btn-outline self-start mt-auto"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` View Details <i class="material-icons text-xs"${_scopeId}>arrow_forward</i>`);
            } else {
              return [
                createTextVNode(" View Details "),
                createVNode("i", { class: "material-icons text-xs" }, "arrow_forward")
              ];
            }
          }),
          _: 2
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    });
    _push(`</div>`);
  } else {
    _push(`<!---->`);
  }
  if (!$options.allProjects.length && !((_d = $data.DATA.featuredProject) == null ? void 0 : _d.title)) {
    _push(`<div class="text-center py-8" style="${ssrRenderStyle({ "color": "var(--text-muted)" })}"> Loading projects... </div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/projects.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const projects = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { projects as default };
//# sourceMappingURL=projects-C9uWknva.mjs.map
