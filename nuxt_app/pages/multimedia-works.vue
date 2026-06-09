<template>
  <div class="section">
    <span class="section-tag">Multimedia Works</span>
    <h1 class="section-title">Media & Videos</h1>
    <p class="text-base mb-4 leading-relaxed" style="color:var(--text);max-width:720px">
      Browse my YouTube channel, creative projects, and delivered multimedia works.
    </p>

    <div class="flex flex-wrap gap-3 mb-6" v-if="DATA.media?.links?.length">
      <a v-for="(link,i) in DATA.media.links" :key="i"
        :href="link.url" target="_blank"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all"
        style="border:1px solid var(--border);color:var(--text);text-decoration:none">
        <i class="material-icons" style="font-size:18px;color:var(--primary)">{{ link.icon }}</i>
        {{ link.title }}
        <i class="material-icons" style="font-size:14px">open_in_new</i>
      </a>
    </div>

    <div class="card-glass p-5 sm:p-6 mb-8 flex flex-col sm:flex-row items-center gap-5">
      <div class="w-20 h-20 rounded-full overflow-hidden shrink-0" style="min-width:80px;border:3px solid var(--primary)">
        <img :src="DATA.media?.channelAvatar" :alt="DATA.media?.channelName" class="w-full h-full object-cover"
          onerror="this.style.display='none';this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center text-white text-2xl font-bold\\' style=\\'background:linear-gradient(135deg,#c00,#ff4444)\\'>A</div>'">
      </div>
      <div class="text-center sm:text-left flex-1">
        <h2 class="text-xl font-bold" style="color:var(--text-heading)">{{ DATA.media?.channelName }}</h2>
        <p class="text-sm mt-0.5" style="color:var(--text-muted)">{{ DATA.media?.channelHandle }}</p>
        <p class="text-sm mt-2 leading-relaxed" style="color:var(--text-muted)">{{ DATA.media?.description }}</p>
        <div class="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
          <a :href="DATA.media?.channelUrl + '?sub_confirmation=1'" target="_blank"
            class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white font-semibold"
            style="background:#c00;font-size:0.85rem">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/></svg>
            Subscribe
          </a>
          <a :href="DATA.media?.channelUrl" target="_blank"
            class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-semibold transition-all"
            style="font-size:0.85rem;border:1px solid var(--border);color:var(--text)">
            <i class="material-icons" style="font-size:16px">open_in_new</i> Visit Channel
          </a>
        </div>
      </div>
    </div>

    <div v-if="DATA.media?.playlist?.id" class="card-glass p-5 mb-6">
      <div class="flex items-center gap-3 mb-4">
        <i class="material-icons" style="color:var(--primary);font-size:24px">playlist_play</i>
        <h2 class="text-lg font-bold" style="color:var(--text-heading)">{{ DATA.media.playlist.title }}</h2>
      </div>
      <div class="aspect-video rounded-xl overflow-hidden" style="background:var(--border)">
        <iframe width="100%" height="100%"
          :src="'https://www.youtube.com/embed/videoseries?list=' + DATA.media.playlist.id"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          style="border-radius:12px">
        </iframe>
      </div>
    </div>

    <div class="card-glass p-5 mb-6">
      <div class="flex items-center gap-3 mb-4">
        <i class="material-icons" style="color:var(--primary);font-size:24px">featured_video</i>
        <h2 class="text-lg font-bold" style="color:var(--text-heading)">Featured Video</h2>
      </div>
      <div class="aspect-video rounded-xl overflow-hidden" style="background:var(--border)">
        <iframe width="100%" height="100%"
          :src="'https://www.youtube.com/embed/' + DATA.media?.featuredVideoId"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          style="border-radius:12px">
        </iframe>
      </div>
    </div>

    <span class="section-tag">All Works</span>
    <h2 class="section-title">Multimedia Portfolio</h2>

    <div class="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 mb-6 pt-4 pb-3 -mx-6 px-6"
      style="background:var(--bg);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid var(--border)"
      v-if="multimediaData && allItems.length">
      <div class="flex flex-wrap gap-2 items-center">
        <button v-for="cat in [{key:'all',label:'All'}].concat(multimediaData.multimediaCategories.map(c=>({key:c.key,label:c.name})))" :key="cat.key"
          @click="setFilter(cat.key)"
          class="project-filter-btn" :class="{ active: activeFilter === cat.key }">
          {{ cat.label }}
        </button>
      </div>
      <div class="flex items-center gap-3 shrink-0">
        <div class="flex items-center gap-1.5">
          <span class="text-sm font-medium" style="color:var(--text-label)">Year:</span>
          <select v-model="selectedYear" @change="setYear(selectedYear)" class="text-sm font-medium px-2 py-1 rounded-lg" style="background:var(--bg-card);color:var(--text-heading);border:1px solid var(--border);cursor:pointer;outline:none">
            <option value="all">All</option>
            <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
        <div class="flex items-center gap-1.5" v-if="availableMonths.length">
          <span class="text-sm font-medium" style="color:var(--text-label)">Month:</span>
          <select v-model="selectedMonth" @change="setMonth(selectedMonth)" class="text-sm font-medium px-2 py-1 rounded-lg" style="background:var(--bg-card);color:var(--text-heading);border:1px solid var(--border);cursor:pointer;outline:none">
            <option value="all">All</option>
            <option v-for="m in availableMonths" :key="m" :value="m">{{ getMonthName(m) }}</option>
          </select>
        </div>
      </div>
    </div>

    <transition-group
      :key="activeFilter + '-' + selectedYear + '-' + selectedMonth"
      name="project"
      tag="div"
      class="grid grid-cols-1 sm:grid-cols-2 gap-6"
      mode="out-in"
      v-if="filteredItems.length">
      <div v-for="(item,i) in filteredItems" :key="item.id || i"
        class="project-card-item rounded-xl p-5 flex flex-col">
        <div class="flex items-center justify-between mb-3">
          <span class="project-cat-tag text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1">
            <i class="material-icons text-xs">{{ item.categoryIcon }}</i>
            {{ item.categoryName }}
          </span>
          <span v-if="item.date" class="text-xs font-medium px-2 py-0.5 rounded shrink-0"
            style="background:rgba(20,184,166,0.12);color:var(--primary-light)">
            {{ item.date.substring(0,7) }}
          </span>
        </div>
        <h3 class="font-semibold text-base" style="color:var(--text-heading)">{{ item.title }}</h3>
        <p class="text-base mt-2 mb-4 leading-relaxed" style="color:var(--text)">
          {{ item.description }}
        </p>
      </div>
    </transition-group>

    <div v-if="filteredItems.length === 0 && multimediaData && allItems.length" class="text-center py-8" style="color:var(--text-muted)">
      No works found for the selected filters.
    </div>
  </div>
</template>

<script>
import { useData } from '~/composables/useData'
export default {
  name: 'MultimediaWorksView',
  data() {
    return {
      DATA: useData(),
      multimediaData: null,
      activeFilter: 'all',
      selectedYear: 'all',
      selectedMonth: 'all'
    }
  },
  computed: {
    allItems() {
      const items = []
      if (!this.multimediaData) return items
      this.multimediaData.multimediaCategories.forEach(cat => {
        cat.items.forEach(item => {
          items.push({ ...item, categoryKey: cat.key, categoryName: cat.name, categoryIcon: cat.icon })
        })
      })
      return items
    },
    availableYears() {
      const years = new Set()
      this.allItems.forEach(p => { if (p.date) years.add(p.date.substring(0,4)) })
      return [...years].sort().reverse()
    },
    availableMonths() {
      const months = new Set()
      this.allItems
        .filter(p => this.selectedYear === 'all' || (p.date && p.date.startsWith(this.selectedYear)))
        .forEach(p => { if (p.date) months.add(p.date.substring(0,7)) })
      return [...months].sort().reverse()
    },
    filteredItems() {
      let items = this.allItems
      if (this.activeFilter !== 'all') items = items.filter(p => p.categoryKey === this.activeFilter)
      if (this.selectedYear !== 'all') items = items.filter(p => p.date && p.date.startsWith(this.selectedYear))
      if (this.selectedMonth !== 'all') items = items.filter(p => p.date && p.date.startsWith(this.selectedMonth))
      return items
    }
  },
  methods: {
    setFilter(key) { this.activeFilter = key },
    setYear(year) { this.selectedYear = year; this.selectedMonth = 'all' },
    setMonth(month) { this.selectedMonth = month },
    getMonthName(ym) {
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
      return months[parseInt(ym.substring(5,7)) - 1] + ' ' + ym.substring(0,4)
    }
  },
  mounted() {
    this.multimediaData = { multimediaCategories: this.DATA.multimediaCategories || [] }
  }
}
</script>
