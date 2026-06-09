<template>
  <div class="section">
    <span class="section-tag">Career Trajectory</span>
    <h1 class="section-title">Employment History</h1>
    <div class="timeline">
      <div v-for="(exp,i) in DATA.experience" :key="i" class="timeline-item">
        <div class="timeline-dot"></div>
        <span class="timeline-date">{{ exp.period }}</span>
        <h3 class="text-lg font-bold" style="color:var(--text-heading)">{{ exp.title }}</h3>
        <p class="text-base sm:text-lg font-medium mb-2" style="color:var(--primary)">{{ exp.company }} <span style="color:var(--text-label)">| {{ exp.location }}</span></p>
        <ul class="space-y-1 text-md" style="color:var(--text)">
          <li v-for="(h,j) in exp.highlights" :key="j" class="flex items-start gap-2 text-base">
            <i class="material-icons" style="font-size:10px;color:var(--primary);margin-top:7px;line-height:1">circle</i>
            <span>{{ h }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { useData } from '~/composables/useData'
export default {
  name: 'ExperienceView',
  data() { return { DATA: useData() } }
}
</script>
