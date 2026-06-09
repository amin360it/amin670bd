<template>
  <div>
    <ParticleCanvas />

    <!-- Mobile Nav -->
    <nav class="mobile-nav">
      <div class="flex items-center justify-between px-4 h-full">
        <NuxtLink to="/" @click="closeMobile" class="text-xl font-extrabold tracking-tight gradient-text">Amin670BD</NuxtLink>
        <div class="flex items-center gap-1.5 shrink-0">
          <a href="/cv.pdf" download
            class="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all duration-300 shrink-0"
            style="height:36px;border:1px solid var(--toggle-border);background:var(--toggle-bg);backdrop-filter:blur(6px);color:var(--text-heading)">
            <i class="material-icons" style="font-size:20px">download</i>
            <span class="download-cv-short">CV</span><span class="download-cv-full">Download CV</span>
          </a>
          <button @click="showContactModal = true" class="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all duration-300 shrink-0" style="height:36px;border:1px solid var(--toggle-border);background:var(--toggle-bg);backdrop-filter:blur(6px);color:var(--text-heading)">
            <i class="material-icons" style="font-size:20px">contact_phone</i> <span class="download-cv-full">Contacts</span>
          </button>
          <ThemeToggle />
          <button @click="mobileMenuOpen = !mobileMenuOpen" :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'" class="theme-toggle flex items-center justify-center">
            <i class="material-icons" style="font-size:20px">{{ mobileMenuOpen ? 'close' : 'menu' }}</i>
          </button>
        </div>
      </div>
    </nav>

    <!-- Offcanvas Backdrop -->
    <transition name="fade">
      <div v-if="mobileMenuOpen" @click="closeMobile" class="fixed inset-0 z-40" style="background:rgba(0,0,0,0.4);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)"></div>
    </transition>

    <!-- Offcanvas Sidebar (Mobile) -->
    <transition name="offcanvas">
      <aside v-if="mobileMenuOpen" class="fixed top-0 right-0 h-full w-72 z-50 offcanvas-mobile" style="display:flex;flex-direction:column">
        <div class="flex-shrink-0">
          <div class="flex items-start justify-between p-6">
            <div class="text-center flex-1">
              <h2 class="text-xl font-bold" style="color:var(--sidebar-heading)">{{ DATA.personal?.name }}</h2>
              <p class="text-lg font-medium" style="color:var(--primary)">({{ DATA.personal?.nickname }})</p>
              <p class="text-md mt-0.5" style="color:var(--sidebar-text)">{{ DATA.personal?.title }}</p>
            </div>
            <button @click="closeMobile" aria-label="Close menu" class="theme-toggle flex items-center justify-center">
              <i class="material-icons" style="font-size:18px">close</i>
            </button>
          </div>
          <hr style="border-color:var(--sidebar-divider);margin:0 1.5rem">
        </div>
        <div class="px-6 py-3 space-y-0.5 flex-1 overflow-y-auto">
          <NuxtLink v-for="item in menuItems" :key="item.path"
            @click="closeMobile" :to="item.path"
            class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition"
            :class="{ 'nav-link-active': $route.path === item.path }">
            <i class="material-icons w-4 text-center" style="font-size:18px">{{ item.icon }}</i>
            <span>{{ item.label }}</span>
          </NuxtLink>
        </div>
        <div class="flex-shrink-0">
          <hr style="border-color:var(--sidebar-divider);margin:0 1.5rem">
          <div class="px-6 py-4 space-y-3">
            <a href="/cv.pdf" download
              class="btn-shimmer flex items-center justify-center gap-2 w-full py-2.5 px-4 text-white font-semibold rounded-xl gradient-bg transition-all duration-300"
              style="box-shadow:0 4px 12px rgba(20,184,166,0.25)">
              <i class="material-icons">download</i> Download CV
            </a>
            <div class="flex items-center justify-center gap-3 pt-1">
              <a :href="'https://' + DATA.personal?.linkedin" target="_blank" class="theme-toggle flex items-center justify-center" title="LinkedIn" style="width:36px;height:36px">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68zm1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
              </a>
              <a :href="DATA.personal?.website" target="_blank" class="theme-toggle flex items-center justify-center" title="Portfolio" style="width:36px;height:36px">
                <i class="material-icons" style="font-size:20px">language</i>
              </a>
              <a href="https://github.com/amin670bd" target="_blank" class="theme-toggle flex items-center justify-center" title="GitHub" style="width:36px;height:36px">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
              </a>
              <a href="https://www.youtube.com/@aminur670" target="_blank" class="theme-toggle flex items-center justify-center" title="YouTube" style="width:36px;height:36px">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/></svg>
              </a>
              <a :href="'mailto:' + DATA.personal?.email" class="theme-toggle flex items-center justify-center" title="Email" style="width:36px;height:36px">
                <i class="material-icons" style="font-size:20px">email</i>
              </a>
            </div>
          </div>
        </div>
      </aside>
    </transition>

    <ContactModal :show="showContactModal" @close="showContactModal = false" />

    <!-- Desktop Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-scroll">
        <div class="p-6 text-center">
          <div class="w-full sm:w-44 md:w-52 lg:w-60 mx-auto mb-4 rounded-2xl overflow-hidden aspect-square" style="border:3px solid rgba(20,184,166,0.3)">
            <img :src="DATA.personal?.photo" :alt="DATA.personal?.name" class="w-full h-full object-cover" loading="lazy">
          </div>
          <h2 class="text-xl font-bold" style="color:var(--sidebar-heading)">{{ DATA.personal?.name }}</h2>
          <p class="text-lg font-medium" style="color:var(--primary)">({{ DATA.personal?.nickname }})</p>
          <p class="text-lg mt-0.5" style="color:var(--sidebar-text)">{{ DATA.personal?.title }}</p>
        </div>

        <!-- Sidebar Nav -->
        <div class="px-4 space-y-0.5">
          <NuxtLink v-for="item in menuItems" :key="item.path"
            :to="item.path"
            class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition"
            :class="{ 'nav-link-active': $route.path === item.path }"
            @click="closeMobile">
            <i class="material-icons w-4 text-center" style="font-size:18px">{{ item.icon }}</i>
            <span>{{ item.label }}</span>
          </NuxtLink>
        </div>
      </div>

      <div class="px-6 py-4 space-y-3" style="border-top:1px solid var(--sidebar-divider)">
        <a href="/cv.pdf" download
          class="btn-shimmer flex items-center justify-center gap-2 w-full py-2.5 px-4 text-white font-semibold rounded-xl gradient-bg transition-all duration-300"
          style="box-shadow:0 4px 12px rgba(20,184,166,0.25)">
          <i class="material-icons">download</i> Download CV
        </a>
        <div class="flex items-center justify-between">
          <span class="text-lg flex items-center gap-1.5" style="color:var(--sidebar-text)"><span class="w-1.5 h-1.5 rounded-full" style="background:var(--accent-emerald);box-shadow:0 0 6px rgba(16,185,129,0.4)"></span> Available</span>
          <div class="flex items-center gap-2">
            <button @click="showContactModal = true" class="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-300" style="border:1px solid var(--primary);color:var(--primary)">
              <i class="material-icons" style="font-size:16px">contact_phone</i> Contacts
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <slot />
      <div class="footer">
        <p>&copy; 2026 Md. Asaduzzaman (Aminur). All rights reserved.</p>
      </div>
    </main>

    <!-- Scroll to top -->
    <button @click="scrollToTop" aria-label="Scroll to top" class="scroll-top gradient-bg" :class="{ visible: showScrollTop }" :style="{boxShadow: '0 4px 15px rgba(20,184,166,0.4)'}">
      <i class="material-icons" style="transition:transform 0.3s ease">arrow_upward</i>
    </button>
  </div>
</template>

<script>
import { useData } from '~/composables/useData'
import { useDarkMode } from '~/composables/useDarkMode'

export default {
  name: 'AppLayout',
  provide() {
    return {
      toggleDark: this.toggleDark
    }
  },
  data() {
    return {
      DATA: useData(),
      mobileMenuOpen: false,
      showContactModal: false,
      showScrollTop: false,
      particleAnimId: null
    }
  },
  computed: {
    menuItems() { return this.DATA?.menuItems || [] }
  },
  mounted() {
    const { toggleDark, initDarkMode } = useDarkMode()
    this.toggleDark = toggleDark
    initDarkMode()
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    toggleDark() {},
    closeMobile() { this.mobileMenuOpen = false },
    scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) },
    handleScroll() {
      this.showScrollTop = window.scrollY > 100
    },
    getInitials(name) {
      return name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    }
  }
}
</script>
