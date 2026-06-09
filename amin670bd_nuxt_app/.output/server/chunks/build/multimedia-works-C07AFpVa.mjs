import { u as useData } from './useData-h1AIsp2l.mjs';
import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
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
  name: "MultimediaWorksView",
  data() {
    return {
      DATA: useData(),
      multimediaData: null,
      activeFilter: "all",
      selectedYear: "all",
      selectedMonth: "all"
    };
  },
  computed: {
    allItems() {
      const items = [];
      if (!this.multimediaData) return items;
      this.multimediaData.multimediaCategories.forEach((cat) => {
        cat.items.forEach((item) => {
          items.push({ ...item, categoryKey: cat.key, categoryName: cat.name, categoryIcon: cat.icon });
        });
      });
      return items;
    },
    availableYears() {
      const years = /* @__PURE__ */ new Set();
      this.allItems.forEach((p) => {
        if (p.date) years.add(p.date.substring(0, 4));
      });
      return [...years].sort().reverse();
    },
    availableMonths() {
      const months = /* @__PURE__ */ new Set();
      this.allItems.filter((p) => this.selectedYear === "all" || p.date && p.date.startsWith(this.selectedYear)).forEach((p) => {
        if (p.date) months.add(p.date.substring(0, 7));
      });
      return [...months].sort().reverse();
    },
    filteredItems() {
      let items = this.allItems;
      if (this.activeFilter !== "all") items = items.filter((p) => p.categoryKey === this.activeFilter);
      if (this.selectedYear !== "all") items = items.filter((p) => p.date && p.date.startsWith(this.selectedYear));
      if (this.selectedMonth !== "all") items = items.filter((p) => p.date && p.date.startsWith(this.selectedMonth));
      return items;
    }
  },
  methods: {
    setFilter(key) {
      this.activeFilter = key;
    },
    setYear(year) {
      this.selectedYear = year;
      this.selectedMonth = "all";
    },
    setMonth(month) {
      this.selectedMonth = month;
    },
    getMonthName(ym) {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return months[parseInt(ym.substring(5, 7)) - 1] + " " + ym.substring(0, 4);
    }
  },
  mounted() {
    this.multimediaData = { multimediaCategories: this.DATA.multimediaCategories || [] };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "section" }, _attrs))}><span class="section-tag">Multimedia Works</span><h1 class="section-title">Media &amp; Videos</h1><p class="text-base mb-4 leading-relaxed" style="${ssrRenderStyle({ "color": "var(--text)", "max-width": "720px" })}"> Browse my YouTube channel, creative projects, and delivered multimedia works. </p>`);
  if ((_b = (_a = $data.DATA.media) == null ? void 0 : _a.links) == null ? void 0 : _b.length) {
    _push(`<div class="flex flex-wrap gap-3 mb-6"><!--[-->`);
    ssrRenderList($data.DATA.media.links, (link, i) => {
      _push(`<a${ssrRenderAttr("href", link.url)} target="_blank" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all" style="${ssrRenderStyle({ "border": "1px solid var(--border)", "color": "var(--text)", "text-decoration": "none" })}"><i class="material-icons" style="${ssrRenderStyle({ "font-size": "18px", "color": "var(--primary)" })}">${ssrInterpolate(link.icon)}</i> ${ssrInterpolate(link.title)} <i class="material-icons" style="${ssrRenderStyle({ "font-size": "14px" })}">open_in_new</i></a>`);
    });
    _push(`<!--]--></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<div class="card-glass p-5 sm:p-6 mb-8 flex flex-col sm:flex-row items-center gap-5"><div class="w-20 h-20 rounded-full overflow-hidden shrink-0" style="${ssrRenderStyle({ "min-width": "80px", "border": "3px solid var(--primary)" })}"><img${ssrRenderAttr("src", (_c = $data.DATA.media) == null ? void 0 : _c.channelAvatar)}${ssrRenderAttr("alt", (_d = $data.DATA.media) == null ? void 0 : _d.channelName)} class="w-full h-full object-cover" onerror="this.style.display=&#39;none&#39;;this.parentElement.innerHTML=&#39;&lt;div class=\\\\&#39;w-full h-full flex items-center justify-center text-white text-2xl font-bold\\\\&#39; style=\\\\&#39;background:linear-gradient(135deg,#c00,#ff4444)\\\\&#39;&gt;A&lt;/div&gt;&#39;"></div><div class="text-center sm:text-left flex-1"><h2 class="text-xl font-bold" style="${ssrRenderStyle({ "color": "var(--text-heading)" })}">${ssrInterpolate((_e = $data.DATA.media) == null ? void 0 : _e.channelName)}</h2><p class="text-sm mt-0.5" style="${ssrRenderStyle({ "color": "var(--text-muted)" })}">${ssrInterpolate((_f = $data.DATA.media) == null ? void 0 : _f.channelHandle)}</p><p class="text-sm mt-2 leading-relaxed" style="${ssrRenderStyle({ "color": "var(--text-muted)" })}">${ssrInterpolate((_g = $data.DATA.media) == null ? void 0 : _g.description)}</p><div class="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start"><a${ssrRenderAttr("href", ((_h = $data.DATA.media) == null ? void 0 : _h.channelUrl) + "?sub_confirmation=1")} target="_blank" class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white font-semibold" style="${ssrRenderStyle({ "background": "#c00", "font-size": "0.85rem" })}"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"></path></svg> Subscribe </a><a${ssrRenderAttr("href", (_i = $data.DATA.media) == null ? void 0 : _i.channelUrl)} target="_blank" class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-semibold transition-all" style="${ssrRenderStyle({ "font-size": "0.85rem", "border": "1px solid var(--border)", "color": "var(--text)" })}"><i class="material-icons" style="${ssrRenderStyle({ "font-size": "16px" })}">open_in_new</i> Visit Channel </a></div></div></div>`);
  if ((_k = (_j = $data.DATA.media) == null ? void 0 : _j.playlist) == null ? void 0 : _k.id) {
    _push(`<div class="card-glass p-5 mb-6"><div class="flex items-center gap-3 mb-4"><i class="material-icons" style="${ssrRenderStyle({ "color": "var(--primary)", "font-size": "24px" })}">playlist_play</i><h2 class="text-lg font-bold" style="${ssrRenderStyle({ "color": "var(--text-heading)" })}">${ssrInterpolate($data.DATA.media.playlist.title)}</h2></div><div class="aspect-video rounded-xl overflow-hidden" style="${ssrRenderStyle({ "background": "var(--border)" })}"><iframe width="100%" height="100%"${ssrRenderAttr("src", "https://www.youtube.com/embed/videoseries?list=" + $data.DATA.media.playlist.id)} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="${ssrRenderStyle({ "border-radius": "12px" })}"></iframe></div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`<div class="card-glass p-5 mb-6"><div class="flex items-center gap-3 mb-4"><i class="material-icons" style="${ssrRenderStyle({ "color": "var(--primary)", "font-size": "24px" })}">featured_video</i><h2 class="text-lg font-bold" style="${ssrRenderStyle({ "color": "var(--text-heading)" })}">Featured Video</h2></div><div class="aspect-video rounded-xl overflow-hidden" style="${ssrRenderStyle({ "background": "var(--border)" })}"><iframe width="100%" height="100%"${ssrRenderAttr("src", "https://www.youtube.com/embed/" + ((_l = $data.DATA.media) == null ? void 0 : _l.featuredVideoId))} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="${ssrRenderStyle({ "border-radius": "12px" })}"></iframe></div></div><span class="section-tag">All Works</span><h2 class="section-title">Multimedia Portfolio</h2>`);
  if ($data.multimediaData && $options.allItems.length) {
    _push(`<div class="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 mb-6 pt-4 pb-3 -mx-6 px-6" style="${ssrRenderStyle({ "background": "var(--bg)", "backdrop-filter": "blur(20px)", "-webkit-backdrop-filter": "blur(20px)", "border-bottom": "1px solid var(--border)" })}"><div class="flex flex-wrap gap-2 items-center"><!--[-->`);
    ssrRenderList([{ key: "all", label: "All" }].concat($data.multimediaData.multimediaCategories.map((c) => ({ key: c.key, label: c.name }))), (cat) => {
      _push(`<button class="${ssrRenderClass([{ active: $data.activeFilter === cat.key }, "project-filter-btn"])}">${ssrInterpolate(cat.label)}</button>`);
    });
    _push(`<!--]--></div><div class="flex items-center gap-3 shrink-0"><div class="flex items-center gap-1.5"><span class="text-sm font-medium" style="${ssrRenderStyle({ "color": "var(--text-label)" })}">Year:</span><select class="text-sm font-medium px-2 py-1 rounded-lg" style="${ssrRenderStyle({ "background": "var(--bg-card)", "color": "var(--text-heading)", "border": "1px solid var(--border)", "cursor": "pointer", "outline": "none" })}"><option value="all"${ssrIncludeBooleanAttr(Array.isArray($data.selectedYear) ? ssrLooseContain($data.selectedYear, "all") : ssrLooseEqual($data.selectedYear, "all")) ? " selected" : ""}>All</option><!--[-->`);
    ssrRenderList($options.availableYears, (y) => {
      _push(`<option${ssrRenderAttr("value", y)}${ssrIncludeBooleanAttr(Array.isArray($data.selectedYear) ? ssrLooseContain($data.selectedYear, y) : ssrLooseEqual($data.selectedYear, y)) ? " selected" : ""}>${ssrInterpolate(y)}</option>`);
    });
    _push(`<!--]--></select></div>`);
    if ($options.availableMonths.length) {
      _push(`<div class="flex items-center gap-1.5"><span class="text-sm font-medium" style="${ssrRenderStyle({ "color": "var(--text-label)" })}">Month:</span><select class="text-sm font-medium px-2 py-1 rounded-lg" style="${ssrRenderStyle({ "background": "var(--bg-card)", "color": "var(--text-heading)", "border": "1px solid var(--border)", "cursor": "pointer", "outline": "none" })}"><option value="all"${ssrIncludeBooleanAttr(Array.isArray($data.selectedMonth) ? ssrLooseContain($data.selectedMonth, "all") : ssrLooseEqual($data.selectedMonth, "all")) ? " selected" : ""}>All</option><!--[-->`);
      ssrRenderList($options.availableMonths, (m) => {
        _push(`<option${ssrRenderAttr("value", m)}${ssrIncludeBooleanAttr(Array.isArray($data.selectedMonth) ? ssrLooseContain($data.selectedMonth, m) : ssrLooseEqual($data.selectedMonth, m)) ? " selected" : ""}>${ssrInterpolate($options.getMonthName(m))}</option>`);
      });
      _push(`<!--]--></select></div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div></div>`);
  } else {
    _push(`<!---->`);
  }
  if ($options.filteredItems.length) {
    _push(`<div${ssrRenderAttrs({
      key: $data.activeFilter + "-" + $data.selectedYear + "-" + $data.selectedMonth,
      name: "project",
      class: "grid grid-cols-1 sm:grid-cols-2 gap-6",
      mode: "out-in"
    })}>`);
    ssrRenderList($options.filteredItems, (item, i) => {
      _push(`<div class="project-card-item rounded-xl p-5 flex flex-col"><div class="flex items-center justify-between mb-3"><span class="project-cat-tag text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1"><i class="material-icons text-xs">${ssrInterpolate(item.categoryIcon)}</i> ${ssrInterpolate(item.categoryName)}</span>`);
      if (item.date) {
        _push(`<span class="text-xs font-medium px-2 py-0.5 rounded shrink-0" style="${ssrRenderStyle({ "background": "rgba(20,184,166,0.12)", "color": "var(--primary-light)" })}">${ssrInterpolate(item.date.substring(0, 7))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><h3 class="font-semibold text-base" style="${ssrRenderStyle({ "color": "var(--text-heading)" })}">${ssrInterpolate(item.title)}</h3><p class="text-base mt-2 mb-4 leading-relaxed" style="${ssrRenderStyle({ "color": "var(--text)" })}">${ssrInterpolate(item.description)}</p></div>`);
    });
    _push(`</div>`);
  } else {
    _push(`<!---->`);
  }
  if ($options.filteredItems.length === 0 && $data.multimediaData && $options.allItems.length) {
    _push(`<div class="text-center py-8" style="${ssrRenderStyle({ "color": "var(--text-muted)" })}"> No works found for the selected filters. </div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/multimedia-works.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const multimediaWorks = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { multimediaWorks as default };
//# sourceMappingURL=multimedia-works-C07AFpVa.mjs.map
