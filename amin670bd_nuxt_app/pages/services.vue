<template>
  <div class="section">
    <span class="section-tag">What I Offer</span>
    <h1 class="section-title">Professional Services</h1>
    <p class="text-base mb-2 leading-relaxed" style="color:var(--text);max-width:720px">
      I deliver web, software, e-commerce, design, and industrial automation solutions — from remote freelance projects to on-site production floor integrations.
    </p>

    <template v-for="(group,gi) in DATA.groups ?? []" :key="gi">
      <div class="flex items-center gap-3 mb-4" style="margin-top:5rem">
        <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" :style="{background: group.bg}">
          <i class="material-icons text-white" style="font-size:20px">{{ group.icon }}</i>
        </div>
        <div>
          <h3 class="text-lg font-bold" style="color:var(--text-heading)">{{ group.title }}</h3>
          <p v-if="group.note" class="text-sm" style="color:var(--text-label)">{{ group.note }}</p>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <div v-for="(s,i) in group.items" :key="i"
          class="card-glass p-5 flex flex-col"
          :style="{borderLeft: group.borderLeft || '3px solid var(--primary)'}">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" :style="{background: group.bg}">
              <i class="material-icons text-white" style="font-size:20px">{{ s.icon }}</i>
            </div>
            <h3 class="font-bold" style="font-size:0.95rem;color:var(--text-heading)">{{ s.title }}</h3>
          </div>
          <p class="text-base mb-3 leading-relaxed" style="color:var(--text)">{{ s.description }}</p>
          <ul class="space-y-2 mt-auto pt-3">
            <li v-for="(h,j) in s.highlights" :key="j"
              class="text-sm flex items-center gap-2"
              style="color:var(--text)">
              <i class="material-icons text-sm shrink-0 leading-none" :style="{color: group.chipColor}">check_circle</i>
              <span class="leading-relaxed" style="color:var(--text)">{{ h }}</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { useData } from '~/composables/useData'
export default {
  name: 'ServicesView',
  data() { return { DATA: useData() } }
}
</script>
