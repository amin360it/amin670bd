<template>
  <div class="section">
    <span class="section-tag">Knowledge Base</span>
    <h1 class="section-title">Education & Certifications</h1>

    <h3 class="text-lg font-bold mb-4 flex items-center gap-3" style="color:var(--text-heading)">
      <i class="material-icons" style="color:var(--primary)">school</i> Education
    </h3>
    <div class="timeline">
      <div v-for="(e,i) in DATA.education" :key="i" class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="flex items-start gap-4">
          <h4 class="font-semibold text-lg flex items-center gap-2" style="color:var(--text-heading)">
            <i class="material-icons" style="color:var(--primary);font-size:22px">{{ e.icon }}</i> {{ e.degree }}
          </h4>
          <span class="timeline-date shrink-0">{{ e.year }}</span>
        </div>
        <p class="text-base mt-0.5" style="color:var(--text)">{{ e.school }}<span style="color:var(--text-label)"> · {{ e.location }}</span></p>
        <div class="mt-4">
          <p class="text-base font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5" style="color:var(--text-label)"><i class="material-icons" style="font-size:16px">bar_chart</i> Academic Performance</p>
          <div class="flex items-center gap-3">
            <div class="flex-1 max-w-[220px]">
              <div class="skill-bar-track"><div class="skill-bar-fill" :style="{ width: ((e.gradeValue/e.gradeMax)*100) + '%' }"></div></div>
            </div>
            <span class="text-sm font-semibold" style="color:var(--primary)">{{ Math.round((e.gradeValue/e.gradeMax)*100) }}%</span>
            <span class="text-sm font-medium" style="color:var(--text-label)">{{ e.grade }}</span>
          </div>
        </div>
        <div class="mt-4">
          <p class="text-base font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5" style="color:var(--text-label)"><i class="material-icons" style="font-size:16px">build</i> Core Skills Acquired</p>
          <div class="flex flex-wrap gap-1.5">
            <span v-for="skill in e.skills" :key="skill" class="skill-pill">{{ skill }}</span>
          </div>
        </div>
        <div class="mt-4">
          <p class="text-base font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5" style="color:var(--text-label)"><i class="material-icons" style="font-size:16px">emoji_events</i> Key Projects & Achievements</p>
          <ul class="space-y-1.5">
            <li v-for="(a,j) in e.achievements" :key="j" class="flex items-start gap-2 text-base" style="color:var(--text)">
              <span v-if="a.award" style="color:#f59e0b;margin-top:2px;flex-shrink:0">🏆</span>
              <span v-else style="color:var(--primary);margin-top:7px;flex-shrink:0;line-height:1"><span class="material-icons" style="font-size:10px">circle</span></span>
              <span>{{ a.text }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <h3 class="text-lg font-bold mt-10 mb-4 flex items-center gap-3" style="color:var(--text-heading)">
      <i class="material-icons" style="color:var(--primary)">verified</i> Training & Certifications
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="(t,i) in DATA.training" :key="i" class="card-glass p-5">
        <h4 class="font-semibold text-lg flex items-center gap-2" style="color:var(--text-heading)">
          <i class="material-icons" style="color:var(--primary);font-size:20px">{{ t.icon }}</i> {{ t.title }}
        </h4>
        <div class="flex flex-wrap gap-1.5 mt-2">
          <span v-for="topic in t.topics" :key="topic" class="skill-pill">{{ topic }}</span>
        </div>
        <div class="flex items-center gap-3 mt-3 text-sm" style="color:var(--text-label)">
          <span class="flex items-center gap-1"><i class="material-icons" style="font-size:14px">business</i> {{ t.institution }}</span>
          <span class="flex items-center gap-1"><i class="material-icons" style="font-size:14px">schedule</i> {{ t.duration }}</span>
          <span class="flex items-center gap-1"><i class="material-icons" style="font-size:14px">calendar_today</i> {{ t.year }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useData } from '~/composables/useData'
export default {
  name: 'EducationView',
  data() { return { DATA: useData() } }
}
</script>
