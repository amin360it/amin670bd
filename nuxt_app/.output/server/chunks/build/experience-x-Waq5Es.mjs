import { u as useData } from './useData-h1AIsp2l.mjs';
import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';
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
  name: "ExperienceView",
  data() {
    return { DATA: useData() };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "section" }, _attrs))}><span class="section-tag">Career Trajectory</span><h1 class="section-title">Employment History</h1><div class="timeline"><!--[-->`);
  ssrRenderList($data.DATA.experience, (exp, i) => {
    _push(`<div class="timeline-item"><div class="timeline-dot"></div><span class="timeline-date">${ssrInterpolate(exp.period)}</span><h3 class="text-lg font-bold" style="${ssrRenderStyle({ "color": "var(--text-heading)" })}">${ssrInterpolate(exp.title)}</h3><p class="text-base sm:text-lg font-medium mb-2" style="${ssrRenderStyle({ "color": "var(--primary)" })}">${ssrInterpolate(exp.company)} <span style="${ssrRenderStyle({ "color": "var(--text-label)" })}">| ${ssrInterpolate(exp.location)}</span></p><ul class="space-y-1 text-md" style="${ssrRenderStyle({ "color": "var(--text)" })}"><!--[-->`);
    ssrRenderList(exp.highlights, (h, j) => {
      _push(`<li class="flex items-start gap-2 text-base"><i class="material-icons" style="${ssrRenderStyle({ "font-size": "10px", "color": "var(--primary)", "margin-top": "7px", "line-height": "1" })}">circle</i><span>${ssrInterpolate(h)}</span></li>`);
    });
    _push(`<!--]--></ul></div>`);
  });
  _push(`<!--]--></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/experience.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const experience = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { experience as default };
//# sourceMappingURL=experience-x-Waq5Es.mjs.map
