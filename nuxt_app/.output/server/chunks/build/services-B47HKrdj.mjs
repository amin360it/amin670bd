import { u as useData } from './useData-h1AIsp2l.mjs';
import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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
  name: "ServicesView",
  data() {
    return { DATA: useData() };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  var _a;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "section" }, _attrs))}><span class="section-tag">What I Offer</span><h1 class="section-title">Professional Services</h1><p class="text-base mb-2 leading-relaxed" style="${ssrRenderStyle({ "color": "var(--text)", "max-width": "720px" })}"> I deliver web, software, e-commerce, design, and industrial automation solutions \u2014 from remote freelance projects to on-site production floor integrations. </p><!--[-->`);
  ssrRenderList((_a = $data.DATA.groups) != null ? _a : [], (group, gi) => {
    _push(`<!--[--><div class="flex items-center gap-3 mb-4" style="${ssrRenderStyle({ "margin-top": "5rem" })}"><div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style="${ssrRenderStyle({ background: group.bg })}"><i class="material-icons text-white" style="${ssrRenderStyle({ "font-size": "20px" })}">${ssrInterpolate(group.icon)}</i></div><div><h3 class="text-lg font-bold" style="${ssrRenderStyle({ "color": "var(--text-heading)" })}">${ssrInterpolate(group.title)}</h3>`);
    if (group.note) {
      _push(`<p class="text-sm" style="${ssrRenderStyle({ "color": "var(--text-label)" })}">${ssrInterpolate(group.note)}</p>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8"><!--[-->`);
    ssrRenderList(group.items, (s, i) => {
      _push(`<div class="card-glass p-5 flex flex-col" style="${ssrRenderStyle({ borderLeft: group.borderLeft || "3px solid var(--primary)" })}"><div class="flex items-center gap-3 mb-3"><div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style="${ssrRenderStyle({ background: group.bg })}"><i class="material-icons text-white" style="${ssrRenderStyle({ "font-size": "20px" })}">${ssrInterpolate(s.icon)}</i></div><h3 class="font-bold" style="${ssrRenderStyle({ "font-size": "0.95rem", "color": "var(--text-heading)" })}">${ssrInterpolate(s.title)}</h3></div><p class="text-base mb-3 leading-relaxed" style="${ssrRenderStyle({ "color": "var(--text)" })}">${ssrInterpolate(s.description)}</p><ul class="space-y-2 mt-auto pt-3"><!--[-->`);
      ssrRenderList(s.highlights, (h, j) => {
        _push(`<li class="text-sm flex items-center gap-2" style="${ssrRenderStyle({ "color": "var(--text)" })}"><i class="material-icons text-sm shrink-0 leading-none" style="${ssrRenderStyle({ color: group.chipColor })}">check_circle</i><span class="leading-relaxed" style="${ssrRenderStyle({ "color": "var(--text)" })}">${ssrInterpolate(h)}</span></li>`);
      });
      _push(`<!--]--></ul></div>`);
    });
    _push(`<!--]--></div><!--]-->`);
  });
  _push(`<!--]--></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/services.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const services = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { services as default };
//# sourceMappingURL=services-B47HKrdj.mjs.map
