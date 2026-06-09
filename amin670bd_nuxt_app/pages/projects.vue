<template>
  <div class="section">
    <span class="section-tag">Case Studies</span>
    <h1 class="section-title">Key Projects & Recent Works</h1>

    <!-- Featured Project -->
    <div v-if="DATA.featuredProject?.title" class="card-glass-alt p-6 lg:p-8 mb-10">
      <span class="inline-block text-md font-bold px-3 py-1 rounded-full mb-4 gradient-bg text-white">🏆 Top Achievement</span>
      <h3 class="text-xl lg:text-2xl font-extrabold mb-4" style="color:var(--sidebar-heading)">{{ DATA.featuredProject.title }}</h3>
      <div v-if="featSlideImages.length" class="relative rounded-xl overflow-hidden" style="border:1px solid var(--sidebar-divider);aspect-ratio:16/9;background:var(--bg-card)" @mouseenter="stopFeatSlide" @mouseleave="startFeatSlide">
        <img :src="typeof featSlideImages[featSlide] === 'string' ? featSlideImages[featSlide] : featSlideImages[featSlide].src" :alt="DATA.featuredProject.title + ' screenshot'" class="w-full h-full" style="object-fit:contain" loading="lazy">
      </div>
      <div class="mt-2 mb-3" style="background:var(--bg-card);padding:8px 14px;border-radius:8px;border:1px solid var(--border)">
        <h4 class="text-lg font-bold" style="color:var(--text-heading)">{{ typeof featSlideImages[featSlide] !== 'string' && featSlideImages[featSlide].title ? featSlideImages[featSlide].title : featProjectMeta?.title || DATA.featuredProject.title }}</h4>
        <p class="text-base mt-1" style="color:var(--text-label)">{{ typeof featSlideImages[featSlide] !== 'string' && featSlideImages[featSlide].desc ? featSlideImages[featSlide].desc : featProjectMeta?.description || DATA.featuredProject.description }}</p>
      </div>
      <div v-if="featSlideImages.length > 1" class="flex items-center gap-2 mt-2 mb-6">
        <button @click="prevFeat" aria-label="Previous slide" class="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110" style="background:var(--bg-card);color:var(--text-heading);border:1px solid var(--border);cursor:pointer">
          <i class="material-icons" style="font-size:18px">chevron_left</i>
        </button>
        <div class="flex items-center gap-2 overflow-x-auto pb-1 flex-1" style="scrollbar-width:thin">
          <button v-for="(img,i) in featSlideImages" :key="i" @click="goFeat(i)" :aria-label="'Go to slide ' + (i+1)" class="flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300" :style="{border:i===featSlide?'2px solid var(--primary)':'2px solid transparent',opacity:i===featSlide?1:0.5,cursor:'pointer',padding:0,background:'var(--bg-card)'}">
            <img :src="typeof img === 'string' ? img : img.src" :alt="DATA.featuredProject.title + ' thumbnail'" style="width:80px;height:60px;object-fit:cover;display:block" loading="lazy">
          </button>
        </div>
        <button @click="nextFeat" aria-label="Next slide" class="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110" style="background:var(--bg-card);color:var(--text-heading);border:1px solid var(--border);cursor:pointer">
          <i class="material-icons" style="font-size:18px">chevron_right</i>
        </button>
      </div>
      <div v-if="featProjectMeta" class="card-glass p-4 rounded-xl mb-4">
        <h4 class="text-sm font-extrabold gradient-text mb-1">{{ featProjectMeta.title }}</h4>
        <p class="text-xs" style="color:var(--text-label)" v-if="featProjectMeta.company">{{ featProjectMeta.company }}</p>
        <p class="text-xs" style="color:var(--primary)" v-if="featProjectMeta.tech">{{ featProjectMeta.tech }}</p>
        <p class="text-xs mt-1" style="color:var(--text)" v-if="featProjectMeta.description">{{ featProjectMeta.description }}</p>
      </div>
      <p class="text-md mb-2" v-if="DATA.featuredProject.tech"><span class="font-semibold">Technologies:</span> {{ DATA.featuredProject.tech }}</p>
      <p class="text-md mb-4" v-if="DATA.featuredProject.company"><span class="font-semibold">Company:</span> {{ DATA.featuredProject.company }}</p>
      <ul class="space-y-2 text-md mb-5" v-if="DATA.featuredProject.details">
        <li v-for="(d,i) in DATA.featuredProject.details" :key="i" class="flex items-start gap-2">
          <i class="material-icons" style="color:var(--primary-light);font-size:18px;margin-top:3px">check_circle</i>
          <span>{{ d }}</span>
        </li>
      </ul>
      <NuxtLink :to="'/project/' + DATA.featuredProject.id" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-bg text-white text-lg font-semibold transition" v-if="DATA.featuredProject.id">
        Project Details <i class="material-icons" style="font-size:14px">open_in_new</i>
      </NuxtLink>
    </div>

    <!-- All Projects Grid -->
    <span class="section-tag">All Works</span>
    <h2 class="section-title">Projects & Client Works</h2>
    <div class="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 mb-6 pt-4 pb-3 -mx-6 px-6" style="background:var(--bg);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid var(--border)" v-if="allProjects.length">
      <div class="flex flex-wrap gap-2 items-center">
        <button v-for="cat in [{key:'all',label:'All'}].concat(DATA.projectCategories.map(c=>({key:c.key,label:c.name})))" :key="cat.key"
          @click="setFilter(cat.key)"
          class="project-filter-btn" :class="{ active: activeFilter === cat.key }">
          {{ cat.label }}
        </button>
      </div>
      <div class="flex items-center gap-1.5 shrink-0">
        <span class="text-sm font-medium" style="color:var(--text-label)">Year:</span>
        <select v-model="selectedYear" @change="setYear(selectedYear)" class="text-sm font-medium px-2 py-1 rounded-lg" style="background:var(--bg-card);color:var(--text-heading);border:1px solid var(--border);cursor:pointer;outline:none">
          <option value="all">All</option>
          <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>
    </div>
    <transition-group
      :key="activeFilter + '-' + selectedYear"
      name="project"
      tag="div"
      class="grid grid-cols-1 sm:grid-cols-2 gap-6"
      mode="out-in"
      v-if="filteredProjects.length">
      <div v-for="(project, i) in filteredProjects" :key="project.id || i" class="project-card-item rounded-xl p-5 flex flex-col">
        <div class="flex items-center justify-between mb-3">
          <span class="project-cat-tag text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1">
            <i class="material-icons text-xs">{{ project.categoryIcon }}</i>
            {{ project.categoryName }}
          </span>
          <div class="flex items-center gap-2 min-w-0">
            <span v-if="project.date" class="text-xs font-medium px-2 py-0.5 rounded shrink-0"
              style="background:rgba(20,184,166,0.12);color:var(--primary-light)">
              {{ project.date.substring(0,4) }}
            </span>
            <span v-if="project.tech" class="text-xs truncate" style="color:var(--text-label)">
              {{ project.tech }}
            </span>
          </div>
        </div>
        <NuxtLink v-if="project.id" :to="'/project/' + project.id" class="project-title-link font-semibold text-base">
          {{ project.title }}
        </NuxtLink>
        <span v-else class="font-semibold text-base" style="color:var(--text-heading)">
          {{ project.title }}
        </span>
        <p class="text-base mt-2 mb-4 leading-relaxed" style="color:var(--text)">{{ project.description }}</p>
        <NuxtLink v-if="project.id" :to="'/project/' + project.id" class="btn-outline self-start mt-auto">
          View Details <i class="material-icons text-xs">arrow_forward</i>
        </NuxtLink>
      </div>
    </transition-group>
    <div v-if="!allProjects.length && !DATA.featuredProject?.title" class="text-center py-8" style="color:var(--text-muted)">
      Loading projects...
    </div>
  </div>
</template>

<script>
import { useData } from '~/composables/useData'
export default {
  name: 'ProjectsView',
  data() {
    return {
      DATA: useData(),
      activeFilter: 'all',
      selectedYear: 'all',
      featSlide: 0,
      featImages: null,
      featProjectMeta: null,
      featSlideTimer: null
    }
  },
  computed: {
    allProjects() {
      const items = []
      if (!this.DATA.projectCategories) return items
      this.DATA.projectCategories.forEach(cat => {
        cat.items.forEach(item => {
          items.push({ ...item, categoryKey: cat.key, categoryName: cat.name, categoryIcon: cat.icon })
        })
      })
      return items
    },
    availableYears() {
      const years = new Set()
      this.allProjects.forEach(p => { if (p.date) years.add(p.date.substring(0,4)) })
      return [...years].sort().reverse()
    },
    filteredProjects() {
      let items = this.activeFilter === 'all' ? this.allProjects : this.allProjects.filter(p => p.categoryKey === this.activeFilter)
      if (this.selectedYear !== 'all') items = items.filter(p => p.date && p.date.startsWith(this.selectedYear))
      return items
    },
    featSlideImages() {
      if (this.featImages) return this.featImages
      const fallback = this.DATA.featuredProject?.images || []
      return fallback.map(f => typeof f === 'string' ? { src: f, title: '', desc: '' } : f)
    }
  },
  methods: {
    setFilter(key) { this.activeFilter = key },
    setYear(year) { this.selectedYear = year },
    prevFeat() { this.featSlide = this.featSlide > 0 ? this.featSlide - 1 : this.featSlideImages.length - 1; this.stopFeatSlide(); this.startFeatSlide() },
    nextFeat() { this.featSlide = this.featSlide < this.featSlideImages.length - 1 ? this.featSlide + 1 : 0; this.stopFeatSlide(); this.startFeatSlide() },
    goFeat(i) { this.featSlide = i; this.stopFeatSlide(); this.startFeatSlide() },
    startFeatSlide() { if (this.featSlideTimer) clearInterval(this.featSlideTimer); this.featSlideTimer = setInterval(this.nextFeat, 3000) },
    stopFeatSlide() { if (this.featSlideTimer) { clearInterval(this.featSlideTimer); this.featSlideTimer = null } }
  },
  mounted() {
    const id = this.DATA.featuredProject?.id
    if (!id) return
    fetch('/images/projects/' + id + '/project-image.json')
      .then(r => r.ok ? r.json() : { images: [] })
      .then(data => {
        if (data.images && data.images.length) this.featImages = data.images.map(f => typeof f === 'string' ? { src: '/images/projects/' + id + '/' + f, title: '', desc: '' } : { ...f, src: '/images/projects/' + id + '/' + f.src })
        if (data.title) this.featProjectMeta = { title: data.title, company: data.company, tech: data.tech, description: data.description }
        this.startFeatSlide()
      })
      .catch(() => { this.startFeatSlide() })
  },
  beforeUnmount() { this.stopFeatSlide() }
}
</script>
