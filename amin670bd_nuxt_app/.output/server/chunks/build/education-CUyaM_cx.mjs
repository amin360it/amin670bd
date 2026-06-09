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
  name: "EducationView",
  data() {
    return { DATA: useData() };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "section" }, _attrs))}><span class="section-tag">Knowledge Base</span><h1 class="section-title">Education &amp; Certifications</h1><h3 class="text-lg font-bold mb-4 flex items-center gap-3" style="${ssrRenderStyle({ "color": "var(--text-heading)" })}"><i class="material-icons" style="${ssrRenderStyle({ "color": "var(--primary)" })}">school</i> Education </h3><div class="timeline"><!--[-->`);
  ssrRenderList($data.DATA.education, (e, i) => {
    _push(`<div class="timeline-item"><div class="timeline-dot"></div><div class="flex items-start gap-4"><h4 class="font-semibold text-lg flex items-center gap-2" style="${ssrRenderStyle({ "color": "var(--text-heading)" })}"><i class="material-icons" style="${ssrRenderStyle({ "color": "var(--primary)", "font-size": "22px" })}">${ssrInterpolate(e.icon)}</i> ${ssrInterpolate(e.degree)}</h4><span class="timeline-date shrink-0">${ssrInterpolate(e.year)}</span></div><p class="text-base mt-0.5" style="${ssrRenderStyle({ "color": "var(--text)" })}">${ssrInterpolate(e.school)}<span style="${ssrRenderStyle({ "color": "var(--text-label)" })}"> \xB7 ${ssrInterpolate(e.location)}</span></p><div class="mt-4"><p class="text-base font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5" style="${ssrRenderStyle({ "color": "var(--text-label)" })}"><i class="material-icons" style="${ssrRenderStyle({ "font-size": "16px" })}">bar_chart</i> Academic Performance</p><div class="flex items-center gap-3"><div class="flex-1 max-w-[220px]"><div class="skill-bar-track"><div class="skill-bar-fill" style="${ssrRenderStyle({ width: e.gradeValue / e.gradeMax * 100 + "%" })}"></div></div></div><span class="text-sm font-semibold" style="${ssrRenderStyle({ "color": "var(--primary)" })}">${ssrInterpolate(Math.round(e.gradeValue / e.gradeMax * 100))}%</span><span class="text-sm font-medium" style="${ssrRenderStyle({ "color": "var(--text-label)" })}">${ssrInterpolate(e.grade)}</span></div></div><div class="mt-4"><p class="text-base font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5" style="${ssrRenderStyle({ "color": "var(--text-label)" })}"><i class="material-icons" style="${ssrRenderStyle({ "font-size": "16px" })}">build</i> Core Skills Acquired</p><div class="flex flex-wrap gap-1.5"><!--[-->`);
    ssrRenderList(e.skills, (skill) => {
      _push(`<span class="skill-pill">${ssrInterpolate(skill)}</span>`);
    });
    _push(`<!--]--></div></div><div class="mt-4"><p class="text-base font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5" style="${ssrRenderStyle({ "color": "var(--text-label)" })}"><i class="material-icons" style="${ssrRenderStyle({ "font-size": "16px" })}">emoji_events</i> Key Projects &amp; Achievements</p><ul class="space-y-1.5"><!--[-->`);
    ssrRenderList(e.achievements, (a, j) => {
      _push(`<li class="flex items-start gap-2 text-base" style="${ssrRenderStyle({ "color": "var(--text)" })}">`);
      if (a.award) {
        _push(`<span style="${ssrRenderStyle({ "color": "#f59e0b", "margin-top": "2px", "flex-shrink": "0" })}">\u{1F3C6}</span>`);
      } else {
        _push(`<span style="${ssrRenderStyle({ "color": "var(--primary)", "margin-top": "7px", "flex-shrink": "0", "line-height": "1" })}"><span class="material-icons" style="${ssrRenderStyle({ "font-size": "10px" })}">circle</span></span>`);
      }
      _push(`<span>${ssrInterpolate(a.text)}</span></li>`);
    });
    _push(`<!--]--></ul></div></div>`);
  });
  _push(`<!--]--></div><h3 class="text-lg font-bold mt-10 mb-4 flex items-center gap-3" style="${ssrRenderStyle({ "color": "var(--text-heading)" })}"><i class="material-icons" style="${ssrRenderStyle({ "color": "var(--primary)" })}">verified</i> Training &amp; Certifications </h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><!--[-->`);
  ssrRenderList($data.DATA.training, (t, i) => {
    _push(`<div class="card-glass p-5"><h4 class="font-semibold text-lg flex items-center gap-2" style="${ssrRenderStyle({ "color": "var(--text-heading)" })}"><i class="material-icons" style="${ssrRenderStyle({ "color": "var(--primary)", "font-size": "20px" })}">${ssrInterpolate(t.icon)}</i> ${ssrInterpolate(t.title)}</h4><div class="flex flex-wrap gap-1.5 mt-2"><!--[-->`);
    ssrRenderList(t.topics, (topic) => {
      _push(`<span class="skill-pill">${ssrInterpolate(topic)}</span>`);
    });
    _push(`<!--]--></div><div class="flex items-center gap-3 mt-3 text-sm" style="${ssrRenderStyle({ "color": "var(--text-label)" })}"><span class="flex items-center gap-1"><i class="material-icons" style="${ssrRenderStyle({ "font-size": "14px" })}">business</i> ${ssrInterpolate(t.institution)}</span><span class="flex items-center gap-1"><i class="material-icons" style="${ssrRenderStyle({ "font-size": "14px" })}">schedule</i> ${ssrInterpolate(t.duration)}</span><span class="flex items-center gap-1"><i class="material-icons" style="${ssrRenderStyle({ "font-size": "14px" })}">calendar_today</i> ${ssrInterpolate(t.year)}</span></div></div>`);
  });
  _push(`<!--]--></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/education.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const education = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { education as default };
//# sourceMappingURL=education-CUyaM_cx.mjs.map
