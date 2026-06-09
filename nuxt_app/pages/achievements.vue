<template>
  <div class="section">
    <span class="section-tag">Recognitions</span>
    <h1 class="section-title">Professional Achievements</h1>
    <div v-for="(cat,ci) in DATA.achievementCategories" :key="ci" class="mb-8 last:mb-0">
      <h3 class="text-lg font-bold mb-4 flex items-center gap-2" :style="{ color: cat.color }">
        <i class="material-icons">{{ cat.icon }}</i> {{ cat.title }}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="(a,ai) in cat.items" :key="ai" class="achievement-card" :style="{ borderLeftColor: cat.color }">
          <div class="flex items-start gap-3">
            <i class="material-icons" :style="{ color: cat.color, fontSize: '22px', marginTop: '3px' }">check_circle</i>
            <div>
              <h4 class="font-semibold text-base" style="color:var(--text-heading)">{{ a.title }}</h4>
              <p class="text-base leading-relaxed mt-1" style="color:var(--text)">{{ a.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useData } from '~/composables/useData'
export default {
  name: 'AchievementsView',
  data() { return { DATA: useData() } }
}
</script>
