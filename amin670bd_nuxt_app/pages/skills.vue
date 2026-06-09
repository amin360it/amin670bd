<template>
  <div class="section">
    <span class="section-tag">Tech Stack Matrix</span>
    <h1 class="section-title">Technical & Creative Inventory</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div v-for="(skill,i) in DATA.skills" :key="i" class="card-glass p-5">
        <h3 class="text-lg font-bold mb-4 flex items-center gap-2" style="color:var(--text-heading)">
          <i class="material-icons text-lg" style="color:var(--primary)">{{ skill.icon }}</i> {{ skill.title }}
        </h3>
        <div class="flex flex-wrap">
          <span v-for="(item,j) in skill.items" :key="j" class="skill-pill">{{ item }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useData } from '~/composables/useData'
export default {
  name: 'SkillsView',
  data() { return { DATA: useData() } }
}
</script>
