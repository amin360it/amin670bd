<template>
  <div v-if="project">
    <div class="hidden lg:flex items-center gap-2 text-sm font-medium px-6 py-3 sticky top-0 z-20" style="background:var(--bg);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid var(--border);color:var(--text-label)">
      <NuxtLink to="/" style="color:var(--primary)" class="hover:underline">Home</NuxtLink>
      <i class="material-icons" style="font-size:14px">chevron_right</i>
      <NuxtLink to="/projects" style="color:var(--primary)" class="hover:underline">Projects</NuxtLink>
      <i class="material-icons" style="font-size:14px">chevron_right</i>
      <span class="truncate max-w-xs" style="color:var(--text-heading)">{{ project.title }}</span>
    </div>
    <div class="px-4 sm:px-8 lg:px-16 mb-6 project-detail-hero">
      <div class="rounded-xl" style="background:var(--bg-card);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid var(--border);padding:clamp(20px,4vw,36px);margin-top:clamp(16px,3vw,32px)">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div class="flex-1 min-w-0">
            <span v-if="project.id === DATA.featuredProject?.id || project.featured" class="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3" style="background:rgba(20,184,166,0.15);color:var(--primary-light)">TOP ACHIEVEMENT</span>
            <h1 class="font-extrabold gradient-text" style="font-size:clamp(1.5rem,4vw,2.2rem);line-height:1.2">{{ project.title }}</h1>
            <p class="text-sm sm:text-base mt-1" style="color:var(--text-label)">{{ project.subtitle }}</p>
          </div>
          <div class="flex-shrink-0 sm:text-right flex flex-col items-end gap-3" v-if="project.company || project.date">
            <div v-if="project.date" class="sm:text-right">
              <small style="opacity:0.5;display:block;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.5px">Year</small>
              <strong style="color:var(--text-heading);font-size:clamp(0.95rem,2vw,1.15rem)">{{ project.date.substring(0,4) }}</strong>
            </div>
            <div v-if="project.company" class="sm:text-right">
              <small style="opacity:0.5;display:block;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.5px">Company</small>
              <strong style="color:var(--text-heading);font-size:clamp(0.95rem,2vw,1.15rem)">{{ project.company }}</strong>
            </div>
          </div>
        </div>
        <div v-if="projectMeta" class="mt-5 pt-4" style="border-top:1px solid var(--border)">
          <div class="flex flex-wrap items-center gap-2 mb-3" v-if="projectMeta.tech">
            <span v-for="t in projectMeta.tech.split(',').map(s=>s.trim())" :key="t" class="text-xs font-medium px-3 py-1 rounded-full" style="background:rgba(20,184,166,0.12);color:var(--primary-light)">{{ t }}</span>
          </div>
          <p style="color:var(--text);font-size:clamp(0.85rem,1.5vw,0.95rem);line-height:1.7" v-if="projectMeta.description">{{ projectMeta.description }}</p>
        </div>
      </div>
    </div>

    <div v-if="slideImages.length" class="px-4 sm:px-8 lg:px-16 mb-6">
      <div class="relative rounded-xl overflow-hidden" style="border:1px solid var(--border);box-shadow:var(--shadow-lg);aspect-ratio:16/9;background:var(--bg-card)" @mouseenter="stopAutoSlide" @mouseleave="startAutoSlide">
        <img :src="typeof slideImages[currentSlide] === 'string' ? slideImages[currentSlide] : slideImages[currentSlide].src" :alt="project.title + ' screenshot'" @error="placeholderImg" class="w-full h-full" style="object-fit:contain" loading="lazy">
      </div>
      <div class="mt-2 mb-3" style="background:var(--bg-card);padding:8px 14px;border-radius:8px;border:1px solid var(--border)">
        <h4 class="text-lg font-bold" style="color:var(--text-heading)">{{ typeof slideImages[currentSlide] !== 'string' && slideImages[currentSlide].title ? slideImages[currentSlide].title : projectMeta?.title || project.title }}</h4>
        <p class="text-base mt-1" style="color:var(--text-label)">{{ typeof slideImages[currentSlide] !== 'string' && slideImages[currentSlide].desc ? slideImages[currentSlide].desc : projectMeta?.description || project.abstract }}</p>
      </div>
      <div v-if="slideImages.length > 1" class="flex items-center gap-2 mt-2">
        <button @click="prevSlide" aria-label="Previous slide" class="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110" style="background:var(--bg-card);color:var(--text-heading);border:1px solid var(--border);cursor:pointer">
          <i class="material-icons" style="font-size:18px">chevron_left</i>
        </button>
        <div class="flex items-center gap-2 overflow-x-auto pb-1 flex-1" style="scrollbar-width:thin">
          <button v-for="(img,i) in slideImages" :key="i" @click="goToSlide(i)" :aria-label="'Go to slide ' + (i+1)" class="flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300" :style="{border:i===currentSlide?'2px solid var(--primary)':'2px solid transparent',opacity:i===currentSlide?1:0.5,cursor:'pointer',padding:0,background:'var(--bg-card)'}">
            <img :src="typeof img === 'string' ? img : img.src" :alt="project.title + ' thumbnail'" style="width:80px;height:60px;object-fit:cover;display:block" loading="lazy">
          </button>
        </div>
        <button @click="nextSlide" aria-label="Next slide" class="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110" style="background:var(--bg-card);color:var(--text-heading);border:1px solid var(--border);cursor:pointer">
          <i class="material-icons" style="font-size:18px">chevron_right</i>
        </button>
      </div>
    </div>
    <div v-else class="px-4 sm:px-8 lg:px-16 mb-6" style="height:200px">
      <div class="rounded-xl img-placeholder" style="height:100%"></div>
    </div>

    <div class="px-4 sm:px-8 lg:px-16 mb-8">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="m in project.metrics" :key="m.label" class="card-glass text-center py-5 px-5">
          <div class="text-3xl font-extrabold gradient-text">{{ m.value }}</div>
          <div class="text-md font-medium mt-1" style="color:var(--text-label)">{{ m.label }}</div>
        </div>
      </div>
    </div>

    <div class="px-4 sm:px-8 lg:px-16 pb-10">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <div class="card-glass p-6">
            <h2 class="text-lg font-bold mb-4 flex items-center gap-3" style="border-left:4px solid var(--primary);padding-left:12px">System Abstract & Objective</h2>
            <p style="color:var(--text)">{{ project.abstract }}</p>
          </div>
          <div class="card-glass p-6">
            <h2 class="text-lg font-bold mb-4 flex items-center gap-3" style="border-left:4px solid var(--primary);padding-left:12px">Precision Engineering & Program Flow</h2>
            <div v-for="(step,i) in project.flow" :key="i" class="flex gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white flex-shrink-0">
                <i class="material-icons" style="font-size:20px">{{ step.icon }}</i>
              </div>
              <div>
                <h4 class="font-bold text-lg" style="color:var(--text-heading)">{{ step.title }}</h4>
                <p class="text-md mt-1" style="color:var(--text)">{{ step.text }}</p>
              </div>
            </div>
          </div>
          <div class="card-glass p-6">
            <h2 class="text-lg font-bold mb-4 flex items-center gap-3" style="border-left:4px solid var(--primary);padding-left:12px">Key Achievements</h2>
            <ul class="space-y-2">
              <li v-for="(d,i) in project.details" :key="i" class="flex items-start gap-2 text-md">
                <i class="material-icons" style="color:var(--primary);font-size:18px;margin-top:3px">check_circle</i>
                <span>{{ d }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="space-y-4">
          <div class="card-glass p-6">
            <span class="text-md font-bold uppercase tracking-wider" style="color:var(--primary)">Tech Stack</span>
            <div class="flex flex-wrap gap-2 mt-3">
              <span v-for="t in project.tech" :key="t" class="skill-pill">{{ t }}</span>
            </div>
          </div>
          <div class="card-glass p-6" style="background:var(--sidebar-bg);color:var(--sidebar-text)">
            <h4 class="font-bold text-lg mb-3" style="color:var(--sidebar-heading)">Need Something Similar?</h4>
            <p class="text-md mb-4">I build specialized industrial digital solutions, ERP integrations, and automation tools.</p>
            <NuxtLink to="/contact" class="inline-block w-full py-2.5 text-center text-lg font-semibold rounded-xl gradient-bg text-white transition">
              Hire Me for This Project
            </NuxtLink>
          </div>
          <NuxtLink to="/projects" class="inline-flex items-center gap-2 text-lg font-medium hover:underline" style="color:var(--primary)">
            <i class="material-icons" style="font-size:16px">arrow_back</i> Back to Projects
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="section text-center">
    <p>Project not found.</p>
    <NuxtLink to="/projects" style="color:var(--primary)">Back to Projects</NuxtLink>
  </div>
</template>

<script>
import { useData } from '~/composables/useData'
export default {
  name: 'ProjectDetailView',
  data() {
    return {
      DATA: useData(),
      currentSlide: 0,
      projectImages: null,
      projectMeta: null,
      slideTimer: null
    }
  },
  computed: {
    project() {
      const id = this.$route.params.id
      return this.DATA.projectDetails?.[id] || null
    },
    slideImages() {
      if (this.projectImages) return this.projectImages
      const fallback = this.project?.images || []
      return fallback.map(f => typeof f === 'string' ? { src: f, title: '', desc: '' } : f)
    }
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler(id) {
        this.stopAutoSlide()
        if (!id) return
        this.currentSlide = 0
        this.projectImages = null
        this.projectMeta = null
        fetch('/images/projects/' + id + '/project-image.json')
          .then(r => r.ok ? r.json() : { images: [] })
          .then(data => {
            if (data.images && data.images.length) this.projectImages = data.images.map(f => typeof f === 'string' ? { src: '/images/projects/' + id + '/' + f, title: '', desc: '' } : { ...f, src: '/images/projects/' + id + '/' + f.src })
            if (data.title) this.projectMeta = { title: data.title, company: data.company, tech: data.tech, description: data.description }
            this.startAutoSlide()
          })
          .catch(() => { this.startAutoSlide() })
      }
    }
  },
  methods: {
    placeholderImg(e) {
      e.target.style.display = 'none'
      const parent = e.target.parentElement
      const ph = document.createElement('div')
      ph.className = 'img-placeholder'
      parent.appendChild(ph)
    },
    prevSlide() {
      this.currentSlide = this.currentSlide > 0 ? this.currentSlide - 1 : this.slideImages.length - 1
      this.stopAutoSlide(); this.startAutoSlide()
    },
    nextSlide() {
      this.currentSlide = this.currentSlide < this.slideImages.length - 1 ? this.currentSlide + 1 : 0
      this.stopAutoSlide(); this.startAutoSlide()
    },
    goToSlide(i) { this.currentSlide = i; this.stopAutoSlide(); this.startAutoSlide() },
    startAutoSlide() { if (this.slideTimer) clearInterval(this.slideTimer); if (this.slideImages.length > 1) this.slideTimer = setInterval(this.nextSlide, 3000) },
    stopAutoSlide() { if (this.slideTimer) { clearInterval(this.slideTimer); this.slideTimer = null } }
  }
}
</script>
