import { u as useData } from './useData-h1AIsp2l.mjs';
import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderStyle, ssrInterpolate } from 'vue/server-renderer';
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
  name: "AchievementsView",
  data() {
    return { DATA: useData() };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "section" }, _attrs))}><span class="section-tag">Recognitions</span><h1 class="section-title">Professional Achievements</h1><!--[-->`);
  ssrRenderList($data.DATA.achievementCategories, (cat, ci) => {
    _push(`<div class="mb-8 last:mb-0"><h3 class="text-lg font-bold mb-4 flex items-center gap-2" style="${ssrRenderStyle({ color: cat.color })}"><i class="material-icons">${ssrInterpolate(cat.icon)}</i> ${ssrInterpolate(cat.title)}</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><!--[-->`);
    ssrRenderList(cat.items, (a, ai) => {
      _push(`<div class="achievement-card" style="${ssrRenderStyle({ borderLeftColor: cat.color })}"><div class="flex items-start gap-3"><i class="material-icons" style="${ssrRenderStyle({ color: cat.color, fontSize: "22px", marginTop: "3px" })}">check_circle</i><div><h4 class="font-semibold text-base" style="${ssrRenderStyle({ "color": "var(--text-heading)" })}">${ssrInterpolate(a.title)}</h4><p class="text-base leading-relaxed mt-1" style="${ssrRenderStyle({ "color": "var(--text)" })}">${ssrInterpolate(a.description)}</p></div></div></div>`);
    });
    _push(`<!--]--></div></div>`);
  });
  _push(`<!--]--></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/achievements.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const achievements = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { achievements as default };
//# sourceMappingURL=achievements-BjgfwbJg.mjs.map
