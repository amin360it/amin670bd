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
  name: "SkillsView",
  data() {
    return { DATA: useData() };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "section" }, _attrs))}><span class="section-tag">Tech Stack Matrix</span><h1 class="section-title">Technical &amp; Creative Inventory</h1><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"><!--[-->`);
  ssrRenderList($data.DATA.skills, (skill, i) => {
    _push(`<div class="card-glass p-5"><h3 class="text-lg font-bold mb-4 flex items-center gap-2" style="${ssrRenderStyle({ "color": "var(--text-heading)" })}"><i class="material-icons text-lg" style="${ssrRenderStyle({ "color": "var(--primary)" })}">${ssrInterpolate(skill.icon)}</i> ${ssrInterpolate(skill.title)}</h3><div class="flex flex-wrap"><!--[-->`);
    ssrRenderList(skill.items, (item, j) => {
      _push(`<span class="skill-pill">${ssrInterpolate(item)}</span>`);
    });
    _push(`<!--]--></div></div>`);
  });
  _push(`<!--]--></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/skills.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const skills = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { skills as default };
//# sourceMappingURL=skills-BTXpvyNo.mjs.map
