/* ===================================================
   CV DATA (loaded from assets/data/cv.json and projects.json)
   =================================================== */
const DATA = Vue.reactive({});

/* ===================================================
   UTILITY HELPERS
   =================================================== */
const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

/* ===================================================
   VIEW COMPONENTS (Options API)
   =================================================== */

// --- HOME VIEW ---
const HomeView = {
  name: 'HomeView',
  template: `
    <div class="hero-section">
      <span class="section-tag">Since 2018 in IT</span>

      <!-- Title + Image row -->
      <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-4">
        <div class="flex-1">
          <h1 class="hero-title">{{ DATA.personal.name }} <br><span class="gradient-text">({{ DATA.personal.nickname }})</span></h1>
        </div>
        <div class="lg:shrink-0 w-full lg:w-48 xl:w-56">
          <img :src="DATA.personal.photo" :alt="DATA.personal.name"
            class="w-full h-auto rounded-2xl object-cover" loading="lazy"
            style="box-shadow:0 8px 32px rgba(20,184,166,0.15);border:2px solid var(--border)">
          <!-- Social Icons under image (desktop only) -->
          <div class="hidden lg:flex flex-wrap justify-center gap-2 mt-3">
            <a :href="'https://' + DATA.personal.linkedin" target="_blank" class="theme-toggle flex items-center justify-center" title="LinkedIn" style="width:36px;height:36px">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68zm1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
            </a>
            <a :href="DATA.personal.website" target="_blank" class="theme-toggle flex items-center justify-center" title="Portfolio" style="width:36px;height:36px">
              <i class="material-icons" style="font-size:20px">language</i>
            </a>
            <a href="https://github.com/amin670bd" target="_blank" class="theme-toggle flex items-center justify-center" title="GitHub" style="width:36px;height:36px">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
            </a>
            <a href="https://www.youtube.com/@aminur670" target="_blank" class="theme-toggle flex items-center justify-center" title="YouTube" style="width:36px;height:36px">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/></svg>
            </a>
            <a :href="'https://wa.me/' + DATA.personal.phone1.replace(/[^0-9]/g,'')" target="_blank" class="theme-toggle flex items-center justify-center" title="WhatsApp" style="width:36px;height:36px">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 2.097.602 4.055 1.638 5.708L2 22l4.374-1.604C8.02 21.378 9.965 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.833 0-3.557-.58-4.973-1.573l-.357-.237-2.597.954.96-2.549-.255-.38A7.956 7.956 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.19-5.94c-.23-.115-1.36-.67-1.57-.746-.21-.077-.363-.115-.516.115-.153.23-.593.746-.727.899-.134.153-.268.172-.498.057-.23-.115-.972-.358-1.85-1.143-.684-.613-1.146-1.37-1.28-1.602-.134-.23-.014-.355.101-.47.103-.103.23-.268.345-.402.115-.134.153-.23.23-.383.077-.153.038-.287-.019-.402-.057-.115-.516-1.244-.707-1.704-.186-.45-.374-.372-.516-.372-.134 0-.287-.019-.44-.019-.153 0-.402.057-.612.287-.21.23-.802.784-.802 1.913s.82 2.22.935 2.373c.115.153 1.614 2.465 3.91 3.456.546.236.972.377 1.305.482.548.173 1.048.149 1.442.09.44-.066 1.36-.555 1.552-1.092.192-.537.192-.997.134-1.093-.057-.096-.21-.153-.44-.268z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <p class="hero-subtitle mt-4 mb-2" style="color:var(--text)">
        <span>A unique fusion of </span>
        <strong><span class="typewriter-cursor">{{ currentRole }}</span></strong>
      </p>
      <p class="text-base mb-8" style="color:var(--text)">
        Dedicated to automating workflows, reducing production costs, and modernizing digital infrastructure.
      </p>

      <div class="flex flex-wrap gap-3 mb-10">
        <button @click="$root.toggleContactModal" class="hero-btn btn-shimmer inline-flex items-center gap-2 px-6 py-3 gradient-bg text-white font-semibold rounded-xl shadow-lg transition-all duration-300" style="box-shadow:0 4px 15px rgba(20,184,166,0.3);cursor:pointer">
          <i class="material-icons text-lg">contact_phone</i> Contact
        </button>
        <router-link to="/contact" class="hero-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300" style="border:1px solid var(--border);color:var(--text-heading);background:var(--bg-card)">
          <i class="material-icons text-lg">send</i> Message
        </router-link>
        <a href="./assets/Aminur670_CV_2026.pdf" download class="hero-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300" style="border:1px solid var(--border);color:var(--text-heading);background:var(--bg-card)">
          <i class="material-icons text-lg">download</i> Download CV
        </a>
        <router-link to="/projects" class="hero-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300" style="border:1px solid var(--border);color:var(--text-heading);background:var(--bg-card)">
          View Portfolio <i class="material-icons text-lg">arrow_forward</i>
        </router-link>
      </div>

      <!-- Highlights -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <router-link v-for="(h,i) in highlights" :key="i" :to="h.link" class="card-glass--glass flex items-start gap-3 p-4 rounded-xl" style="text-decoration:none;display:flex">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 gradient-bg" :style="{animation:'float 3s ease-in-out infinite',animationDelay: (i * 0.3) + 's'}">
            <i class="material-icons text-white" style="font-size:20px">{{ h.icon }}</i>
          </div>
          <div>
            <h4 class="font-semibold text-lg" style="color:var(--text-heading)">{{ h.title }}</h4>
            <p class="text-md mt-0.5" style="color:var(--text)">{{ h.text }}</p>
          </div>
        </router-link>
      </div>

      <!-- Stats -->
      <div class="hero-stats">
        <div v-for="(s,i) in DATA.stats" :key="i" class="flex items-center gap-4">
          <div class="text-center">
            <div class="hero-stat-value">{{ s.value }}</div>
            <div class="text-lg" style="color:var(--text-label)">{{ s.label }}</div>
          </div>
          <div v-if="i < DATA.stats.length-1" style="width:1px;height:40px;background:var(--border)"></div>
        </div>
      </div>

      <!-- Social Icons (mobile/tablet only) -->
      <div class="flex lg:hidden flex-wrap items-center justify-center gap-2 mt-8">
        <a :href="'https://' + DATA.personal.linkedin" target="_blank" class="theme-toggle flex items-center justify-center" title="LinkedIn" style="width:36px;height:36px">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68zm1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
        </a>
        <a :href="DATA.personal.website" target="_blank" class="theme-toggle flex items-center justify-center" title="Portfolio" style="width:36px;height:36px">
          <i class="material-icons" style="font-size:20px">language</i>
        </a>
        <a href="https://github.com/amin670bd" target="_blank" class="theme-toggle flex items-center justify-center" title="GitHub" style="width:36px;height:36px">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
        </a>
        <a href="https://www.youtube.com/@aminur670" target="_blank" class="theme-toggle flex items-center justify-center" title="YouTube" style="width:36px;height:36px">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/></svg>
        </a>
        <a :href="'https://wa.me/' + DATA.personal.phone1.replace(/[^0-9]/g,'')" target="_blank" class="theme-toggle flex items-center justify-center" title="WhatsApp" style="width:36px;height:36px">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 2.097.602 4.055 1.638 5.708L2 22l4.374-1.604C8.02 21.378 9.965 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.833 0-3.557-.58-4.973-1.573l-.357-.237-2.597.954.96-2.549-.255-.38A7.956 7.956 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.19-5.94c-.23-.115-1.36-.67-1.57-.746-.21-.077-.363-.115-.516.115-.153.23-.593.746-.727.899-.134.153-.268.172-.498.057-.23-.115-.972-.358-1.85-1.143-.684-.613-1.146-1.37-1.28-1.602-.134-.23-.014-.355.101-.47.103-.103.23-.268.345-.402.115-.134.153-.23.23-.383.077-.153.038-.287-.019-.402-.057-.115-.516-1.244-.707-1.704-.186-.45-.374-.372-.516-.372-.134 0-.287-.019-.44-.019-.153 0-.402.057-.612.287-.21.23-.802.784-.802 1.913s.82 2.22.935 2.373c.115.153 1.614 2.465 3.91 3.456.546.236.972.377 1.305.482.548.173 1.048.149 1.442.09.44-.066 1.36-.555 1.552-1.092.192-.537.192-.997.134-1.093-.057-.096-.21-.153-.44-.268z"/></svg>
        </a>
      </div>
    </div>
  `,
  data() {
    return {
      DATA,
      typeInterval: null,
      roles: ['IT Support Specialist', 'ERP Systems Specialist', 'Web Developer', 'Digital Operations Expert', 'Systems Integrator'],
      currentRole: 'IT Support Specialist',
      roleIndex: 0,
      charIndex: 0,
      isDeleting: false,
      highlights: [
        { icon: 'speed', title: '60% Efficiency Boost', text: 'Reduced packing time with automated weight scale integration', link: '/projects' },
        { icon: 'web', title: '15+ Sites Built', text: 'WordPress, WooCommerce & custom web solutions', link: '/projects' },
        { icon: 'group', title: '100+ Users Managed', text: 'ERP training, IT support & system administration', link: '/experience' }
      ]
    };
  },
  mounted() {
    // fade handled by Vue transition
    this.startTypewriter();
  },
  beforeUnmount() {
    if (this.typeInterval) clearInterval(this.typeInterval);
  },
  methods: {
    startTypewriter() {
      this.typeInterval = setInterval(() => {
        const full = this.roles[this.roleIndex];
        if (this.isDeleting) {
          this.charIndex--;
          this.currentRole = full.substring(0, this.charIndex);
          if (this.charIndex === 0) {
            this.isDeleting = false;
            this.roleIndex = (this.roleIndex + 1) % this.roles.length;
          }
        } else {
          this.charIndex++;
          this.currentRole = full.substring(0, this.charIndex);
          if (this.charIndex === full.length) {
            setTimeout(() => { this.isDeleting = true; }, 1500);
          }
        }
      }, 80);
    }
  }
};

// --- ABOUT VIEW ---
const AboutView = {
  name: 'AboutView',
  template: `
      <div class="section">
        <span class="section-tag">About Me</span>
        <h1 class="section-title">Who I Am</h1>

        <!-- Full-width Visiting Card -->
        <div class="card-glass p-6 mb-6">
          <div class="flex flex-col sm:flex-row items-start gap-5">
            <div class="w-full sm:w-44 md:w-52 lg:w-60 shrink-0 rounded-2xl overflow-hidden aspect-square" style="border:3px solid rgba(20,184,166,0.3)">
              <img :src="DATA.personal.photo" :alt="DATA.personal.name" class="w-full h-full object-cover" loading="lazy">
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="text-xl font-bold" style="color:var(--text-heading)">{{ DATA.personal.name }}</h3>
              <p class="text-lg font-medium" style="color:var(--primary)">({{ DATA.personal.nickname }})</p>
               <p class="text-base mt-1 font-medium" style="color:var(--text)">{{ DATA.personal.title }}</p>
              <hr class="my-4" style="border-color:var(--border)">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-base">
                <div class="flex items-center gap-3">
                  <i class="material-icons" style="color:var(--primary);font-size:20px">phone</i>
                  <span style="color:var(--text)">{{ DATA.personal.phone1 }} / {{ DATA.personal.phone2 }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <i class="material-icons" style="color:var(--primary);font-size:20px">email</i>
                  <span style="color:var(--text)">{{ DATA.personal.email }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <i class="material-icons" style="color:var(--primary);font-size:20px">location_on</i>
                  <span style="color:var(--text)">{{ DATA.personal.location }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style="color:var(--primary)"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68zm1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                  <a :href="'https://' + DATA.personal.linkedin" target="_blank" style="color:var(--primary)">{{ DATA.personal.linkedin }}</a>
                </div>
                <div class="flex items-center gap-3">
                  <i class="material-icons" style="color:var(--primary);font-size:20px">language</i>
                  <a :href="DATA.personal.website" target="_blank" style="color:var(--primary)">amin670bd.github.io</a>
                </div>
              </div>
              <div class="flex flex-wrap items-center gap-2 mt-4 pt-3" style="border-top:1px solid var(--border)">
                <a :href="'https://' + DATA.personal.linkedin" target="_blank" class="theme-toggle flex items-center justify-center" title="LinkedIn" style="width:36px;height:36px">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68zm1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                </a>
                <a :href="DATA.personal.website" target="_blank" class="theme-toggle flex items-center justify-center" title="Portfolio" style="width:36px;height:36px">
                  <i class="material-icons" style="font-size:20px">language</i>
                </a>
                <a href="https://github.com/amin670bd" target="_blank" class="theme-toggle flex items-center justify-center" title="GitHub" style="width:36px;height:36px">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
                </a>
                <a href="https://www.youtube.com/@aminur670" target="_blank" class="theme-toggle flex items-center justify-center" title="YouTube" style="width:36px;height:36px">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/></svg>
                </a>
                <a :href="'https://wa.me/' + DATA.personal.phone1.replace(/[^0-9]/g,'')" target="_blank" class="theme-toggle flex items-center justify-center" title="WhatsApp" style="width:36px;height:36px">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 2.097.602 4.055 1.638 5.708L2 22l4.374-1.604C8.02 21.378 9.965 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.833 0-3.557-.58-4.973-1.573l-.357-.237-2.597.954.96-2.549-.255-.38A7.956 7.956 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.19-5.94c-.23-.115-1.36-.67-1.57-.746-.21-.077-.363-.115-.516.115-.153.23-.593.746-.727.899-.134.153-.268.172-.498.057-.23-.115-.972-.358-1.85-1.143-.684-.613-1.146-1.37-1.28-1.602-.134-.23-.014-.355.101-.47.103-.103.23-.268.345-.402.115-.134.153-.23.23-.383.077-.153.038-.287-.019-.402-.057-.115-.516-1.244-.707-1.704-.186-.45-.374-.372-.516-.372-.134 0-.287-.019-.44-.019-.153 0-.402.057-.612.287-.21.23-.802.784-.802 1.913s.82 2.22.935 2.373c.115.153 1.614 2.465 3.91 3.456.546.236.972.377 1.305.482.548.173 1.048.149 1.442.09.44-.066 1.36-.555 1.552-1.092.192-.537.192-.997.134-1.093-.057-.096-.21-.153-.44-.268z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">

          <!-- Left Column -->
          <div class="lg:col-span-2 space-y-5">

            <!-- Personal Details -->
          <div class="card-glass p-6">
            <h4 class="text-lg font-bold mb-3 flex items-center gap-2" style="color:var(--text-heading)"><i class="material-icons" style="color:var(--primary);font-size:18px">badge</i> Personal Details</h4>
            <div class="space-y-2">
              <div class="flex justify-between py-1" style="border-bottom:1px solid var(--border)"><span class="text-sm" style="color:var(--text-label)">Date of Birth</span><span class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.dob }}</span></div>
              <div class="flex justify-between py-1" style="border-bottom:1px solid var(--border)"><span class="text-sm" style="color:var(--text-label)">Blood Group</span><span class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.blood }}</span></div>
              <div class="flex justify-between py-1" style="border-bottom:1px solid var(--border)"><span class="text-sm" style="color:var(--text-label)">Religion</span><span class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.religion }}</span></div>
            </div>
          </div>

          <!-- Languages -->
          <div class="card-glass p-6">
            <h4 class="text-lg font-bold mb-3 flex items-center gap-2" style="color:var(--text-heading)"><i class="material-icons" style="color:var(--primary);font-size:18px">translate</i> Languages</h4>
            <div class="space-y-3">
              <div v-for="l in DATA.languages" :key="l.name">
                <div class="flex justify-between mb-1"><span>{{ l.name }}</span><span class="text-sm" style="color:var(--text-label)">{{ l.level }}</span></div>
                <div class="skill-bar-track"><div class="skill-bar-fill" :style="{ width: l.pct + '%' }"></div></div>
              </div>
            </div>
          </div>

          <!-- Employment Details -->
        <div class="card-glass p-6">
          <h4 class="text-lg font-bold mb-3 flex items-center gap-2" style="color:var(--text-heading)"><i class="material-icons" style="color:var(--primary);font-size:18px">work</i> Employment Details</h4>
          <div class="space-y-2">
            <div class="flex justify-between py-1" style="border-bottom:1px solid var(--border)"><span class="text-sm" style="color:var(--text-label)">Available</span><span class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.available }}</span></div>
            <div class="flex justify-between py-1"><span class="text-sm" style="color:var(--text-label)">Location</span><span class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.location }}</span></div>
          </div>
        </div>

        </div>

        <!-- Right Column -->
        <div class="lg:col-span-3 space-y-5">

          <!-- Objective -->
          <div class="card-glass p-6">
            <h3 class="text-lg font-bold mb-4 flex items-center gap-3" style="color:var(--text-heading)"><i class="material-icons" style="color:var(--primary)">psychology</i> Career Objective</h3>
            <p class="text-base leading-relaxed" style="color:var(--text)">{{ DATA.objective }}</p>
          </div>

          <!-- Professional Summary + Stats -->
          <div class="card-glass p-6">
            <h3 class="text-lg font-bold mb-4 flex items-center gap-3" style="color:var(--text-heading)"><i class="material-icons" style="color:var(--primary)">assignment</i> Professional Summary</h3>
            <p class="text-base leading-relaxed mb-5" style="color:var(--text)">{{ DATA.summary }}</p>
            <div class="grid grid-cols-3 gap-3">
              <div v-for="s in DATA.stats" :key="s.label" class="text-center py-4 rounded-xl" style="background:rgba(20,184,166,0.06);border:1px solid rgba(20,184,166,0.1)">
                <div class="text-2xl font-extrabold gradient-text">{{ s.value }}</div>
                <div class="text-md font-medium mt-1" style="color:var(--text-label)">{{ s.label }}</div>
              </div>
            </div>
          </div>

           </div>
         </div>
       </div>
     </div>
  `,
  data() { return { DATA }; },
  mounted() {
    // fade handled by Vue transition
  }
};

// --- SKILLS VIEW ---
const SkillsView = {
  name: 'SkillsView',
  template: `
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
  `,
  data() { return { DATA }; },
  mounted() {
    // fade handled by Vue transition
  }
};

// --- EXPERIENCE VIEW ---
const ExperienceView = {
  name: 'ExperienceView',
  template: `
    <div class="section">
      <span class="section-tag">Career Trajectory</span>
      <h1 class="section-title">Employment History</h1>
      <div class="timeline ">
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
  `,
  data() { return { DATA }; },
  mounted() {
    // fade handled by Vue transition
  }
};

// --- EDUCATION VIEW ---
const EducationView = {
  name: 'EducationView',
  template: `
    <div class="section">
      <span class="section-tag">Knowledge Base</span>
      <h1 class="section-title">Education &amp; Certifications</h1>

      <h3 class="text-lg font-bold mb-4 flex items-center gap-3" style="color:var(--text-heading)">
        <i class="material-icons" style="color:var(--primary)">school</i> Education
      </h3>
      <div class="timeline">
        <div v-for="(e,i) in DATA.education" :key="i" class="timeline-item">
          <div class="timeline-dot"></div>

          <!-- Degree Header -->
          <div class="flex items-start gap-4">
            <h4 class="font-semibold text-lg flex items-center gap-2" style="color:var(--text-heading)">
              <i class="material-icons" style="color:var(--primary);font-size:22px">{{ e.icon }}</i> {{ e.degree }}
            </h4>
            <span class="timeline-date shrink-0">{{ e.year }}</span>
          </div>
          <p class="text-base mt-0.5" style="color:var(--text)">{{ e.school }}<span style="color:var(--text-label)"> · {{ e.location }}</span></p>

          <!-- Academic Performance -->
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

          <!-- Core Skills -->
          <div class="mt-4">
            <p class="text-base font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5" style="color:var(--text-label)"><i class="material-icons" style="font-size:16px">build</i> Core Skills Acquired</p>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="skill in e.skills" :key="skill" class="skill-pill">{{ skill }}</span>
            </div>
          </div>

          <!-- Key Projects & Achievements -->
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
        <i class="material-icons" style="color:var(--primary)">verified</i> Training &amp; Certifications
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
  `,
  data() { return { DATA }; },
  mounted() {
    // fade handled by Vue transition
  }
};

// --- PROJECTS VIEW ---
const ProjectsView = {
  name: 'ProjectsView',
  data() {
    return {
      DATA,
      activeFilter: 'all',
      selectedYear: 'all',
      featSlide: 0,
      featImages: null,
      featProjectMeta: null,
      featSlideTimer: null
    };
  },
  computed: {
    allProjects() {
      const items = [];
      this.DATA.projectCategories.forEach(cat => {
        cat.items.forEach(item => {
          items.push({ ...item, categoryKey: cat.key, categoryName: cat.name, categoryIcon: cat.icon });
        });
      });
      return items;
    },
    availableYears() {
      const years = new Set();
      this.allProjects.forEach(p => { if (p.date) years.add(p.date.substring(0,4)); });
      return [...years].sort().reverse();
    },
    filteredProjects() {
      let items = this.activeFilter === 'all' ? this.allProjects : this.allProjects.filter(p => p.categoryKey === this.activeFilter);
      if (this.selectedYear !== 'all') items = items.filter(p => p.date && p.date.startsWith(this.selectedYear));
      return items;
    },
    featSlideImages() {
      if (this.featImages) return this.featImages;
      const fallback = this.DATA.featuredProject.images || [];
      return fallback.map(f => typeof f === 'string' ? { src: f, title: '', desc: '' } : f);
    }
  },
  methods: {
    setFilter(key) { this.activeFilter = key; },
    setYear(year) { this.selectedYear = year; },
    prevFeat() { this.featSlide = this.featSlide > 0 ? this.featSlide - 1 : this.featSlideImages.length - 1; this.stopFeatSlide(); this.startFeatSlide(); },
    nextFeat() { this.featSlide = this.featSlide < this.featSlideImages.length - 1 ? this.featSlide + 1 : 0; this.stopFeatSlide(); this.startFeatSlide(); },
    goFeat(i) { this.featSlide = i; this.stopFeatSlide(); this.startFeatSlide(); },
    startFeatSlide() { if (this.featSlideTimer) clearInterval(this.featSlideTimer); this.featSlideTimer = setInterval(this.nextFeat, 3000); },
    stopFeatSlide() { if (this.featSlideTimer) { clearInterval(this.featSlideTimer); this.featSlideTimer = null; } }
  },
  mounted() {
    const id = this.DATA.featuredProject.id;
    if (!id) return;
    fetch('assets/images/projects/' + id + '/project-image.json')
      .then(r => r.ok ? r.json() : { images: [] })
      .then(data => {
        if (data.images && data.images.length) this.featImages = data.images.map(f => typeof f === 'string' ? { src: 'assets/images/projects/' + id + '/' + f, title: '', desc: '' } : { ...f, src: 'assets/images/projects/' + id + '/' + f.src });
        if (data.title) this.featProjectMeta = { title: data.title, company: data.company, tech: data.tech, description: data.description };
        this.startFeatSlide();
      })
      .catch(() => { this.startFeatSlide(); });
  },
  beforeUnmount() { this.stopFeatSlide(); },
  template: `
    <div class="section">
      <span class="section-tag">Case Studies</span>
      <h1 class="section-title">Key Projects & Recent Works</h1>

      <!-- Featured Project -->
      <div v-if="DATA.featuredProject.title" class="card-glass-alt p-6 lg:p-8 mb-10">
        <span class="inline-block text-md font-bold px-3 py-1 rounded-full mb-4 gradient-bg text-white">🏆 Top Achievement</span>
        <h3 class="text-xl lg:text-2xl font-extrabold mb-4" style="color:var(--sidebar-heading)">{{ DATA.featuredProject.title }}</h3>
        <div v-if="featSlideImages.length" class="relative rounded-xl overflow-hidden" style="border:1px solid var(--sidebar-divider);aspect-ratio:16/9;background:var(--bg-card)" @mouseenter="stopFeatSlide" @mouseleave="startFeatSlide">
          <img :src="typeof featSlideImages[featSlide] === 'string' ? featSlideImages[featSlide] : featSlideImages[featSlide].src" :alt="DATA.featuredProject.title + ' screenshot'" class="w-full h-full" style="object-fit:contain" loading="lazy">
        </div>
        <!-- Text above mini gallery -->
        <div class="mt-2 mb-3" style="background:var(--bg-card);padding:8px 14px;border-radius:8px;border:1px solid var(--border)">
          <h4 class="text-lg font-bold" style="color:var(--text-heading)">{{ typeof featSlideImages[featSlide] !== 'string' && featSlideImages[featSlide].title ? featSlideImages[featSlide].title : featProjectMeta?.title || DATA.featuredProject.title }}</h4>
          <p class="text-base mt-1" style="color:var(--text-label)">{{ typeof featSlideImages[featSlide] !== 'string' && featSlideImages[featSlide].desc ? featSlideImages[featSlide].desc : featProjectMeta?.description || DATA.featuredProject.description }}</p>
        </div>
        <!-- Mini Gallery + Controls -->
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
        <!-- Project info loaded from project-image.json -->
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
        <router-link :to="'/project/' + DATA.featuredProject.id" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-bg text-white text-lg font-semibold transition" v-if="DATA.featuredProject.id">
          Project Details <i class="material-icons" style="font-size:14px">open_in_new</i>
        </router-link>
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
  v-if="filteredProjects.length"
>
  <div
    v-for="(project, i) in filteredProjects"
    :key="project.id || i"
      class="project-card-item rounded-xl p-5 flex flex-col"
  >
    <div class="flex items-center justify-between mb-3">
      <span
        class="project-cat-tag text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1"
      >
        <i class="material-icons text-xs">{{ project.categoryIcon }}</i>
        {{ project.categoryName }}
      </span>
      <div class="flex items-center gap-2 min-w-0">
        <span
          v-if="project.date"
          class="text-xs font-medium px-2 py-0.5 rounded shrink-0"
          style="background:rgba(20,184,166,0.12);color:var(--primary-light)"
        >
          {{ project.date.substring(0,4) }}
        </span>
        <span
          v-if="project.tech"
          class="text-xs truncate"
          style="color:var(--text-label)"
        >
          {{ project.tech }}
        </span>
      </div>
    </div>

    <router-link
      v-if="project.id"
      :to="'/project/' + project.id"
      class="project-title-link font-semibold text-base"
    >
      {{ project.title }}
    </router-link>
    <span
      v-else
      class="font-semibold text-base"
      style="color:var(--text-heading)"
    >
      {{ project.title }}
    </span>

    <p
      class="text-base mt-2 mb-4 leading-relaxed"
      style="color:var(--text)"
    >
      {{ project.description }}
    </p>

    <router-link
      v-if="project.id"
      :to="'/project/' + project.id"
      class="btn-outline self-start mt-auto"
    >
      View Details
      <i class="material-icons text-xs">arrow_forward</i>
    </router-link>
  </div>
</transition-group>

      <div v-if="!allProjects.length && !DATA.featuredProject.title" class="text-center py-8" style="color:var(--text-muted)">
        Loading projects...
      </div>
    </div>
  `,
  beforeRouteLeave(to, from, next) {
    if (to.path.startsWith('/project/')) {
      sessionStorage.setItem('projectsScrollY', window.scrollY);
    }
    next();
  },
  mounted() {
    // fade handled by Vue transition
  }
};

// --- ACHIEVEMENTS VIEW ---
const AchievementsView = {
  name: 'AchievementsView',
  data() {
    return { DATA };
  },
  template: `
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
  `,
  mounted() {
    // fade handled by Vue transition
  }
};

// --- SERVICES VIEW ---
const ServicesView = {
  name: 'ServicesView',
  data() {
    return {
      servicesData: null
    };
  },
  template: `
    <div class="section">
      <span class="section-tag">What I Offer</span>
      <h1 class="section-title">Professional Services</h1>
      <p class="text-base mb-2 leading-relaxed" style="color:var(--text);max-width:720px">
        I deliver web, software, e-commerce, design, and industrial automation solutions — from remote freelance projects to on-site production floor integrations.
      </p>

      <template v-if="!servicesData">
        <div class="text-center py-20" style="color:var(--text-label)">Loading services...</div>
      </template>

      <!-- Section renderer -->
      <template v-for="(group,gi) in servicesData?.groups ?? []" :key="gi">
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
  `,
  mounted() {
    fetch('assets/data/services.json')
      .then(r => r.json())
      .then(data => { this.servicesData = data; })
      .catch(() => { this.servicesData = { groups: [] }; });
  }
};

// --- MULTIMEDIA WORKS VIEW ---
const MultimediaWorksView = {
  name: 'MultimediaWorksView',
  data() {
    return {
      DATA,
      multimediaData: null,
      activeFilter: 'all',
      selectedYear: 'all',
      selectedMonth: 'all'
    };
  },
  computed: {
    allItems() {
      const items = [];
      if (!this.multimediaData) return items;
      this.multimediaData.multimediaCategories.forEach(cat => {
        cat.items.forEach(item => {
          items.push({ ...item, categoryKey: cat.key, categoryName: cat.name, categoryIcon: cat.icon });
        });
      });
      return items;
    },
    availableYears() {
      const years = new Set();
      this.allItems.forEach(p => { if (p.date) years.add(p.date.substring(0,4)); });
      return [...years].sort().reverse();
    },
    availableMonths() {
      const months = new Set();
      this.allItems
        .filter(p => this.selectedYear === 'all' || (p.date && p.date.startsWith(this.selectedYear)))
        .forEach(p => { if (p.date) months.add(p.date.substring(0,7)); });
      return [...months].sort().reverse();
    },
    filteredItems() {
      let items = this.allItems;
      if (this.activeFilter !== 'all') items = items.filter(p => p.categoryKey === this.activeFilter);
      if (this.selectedYear !== 'all') items = items.filter(p => p.date && p.date.startsWith(this.selectedYear));
      if (this.selectedMonth !== 'all') items = items.filter(p => p.date && p.date.startsWith(this.selectedMonth));
      return items;
    }
  },
  methods: {
    setFilter(key) { this.activeFilter = key; },
    setYear(year) { this.selectedYear = year; this.selectedMonth = 'all'; },
    setMonth(month) { this.selectedMonth = month; },
    getMonthName(ym) {
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      return months[parseInt(ym.substring(5,7)) - 1] + ' ' + ym.substring(0,4);
    }
  },
  mounted() {
    fetch('assets/data/multimedia.json')
      .then(r => r.json())
      .then(data => { this.multimediaData = data; })
      .catch(() => { this.multimediaData = { multimediaCategories: [] }; });
  },
  template: `
    <div class="section">
      <span class="section-tag">Multimedia Works</span>
      <h1 class="section-title">Media & Videos</h1>
      <p class="text-base mb-4 leading-relaxed" style="color:var(--text);max-width:720px">
        Browse my YouTube channel, creative projects, and delivered multimedia works.
      </p>

      <!-- Links Bar -->
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

      <!-- Channel Profile -->
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
            <a :href="(DATA.media?.channelUrl || '') + '?sub_confirmation=1'" target="_blank"
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

      <!-- Playlist Player -->
      <div v-if="DATA.media?.playlist?.id" class="card-glass p-5 mb-6">
        <div class="flex items-center gap-3 mb-4">
          <i class="material-icons" style="color:var(--primary);font-size:24px">playlist_play</i>
          <h2 class="text-lg font-bold" style="color:var(--text-heading)">{{ DATA.media?.playlist?.title }}</h2>
        </div>
        <div class="aspect-video rounded-xl overflow-hidden" style="background:var(--border)">
          <iframe width="100%" height="100%"
            :src="'https://www.youtube.com/embed/videoseries?list=' + DATA.media?.playlist?.id"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            style="border-radius:12px">
          </iframe>
        </div>
      </div>

      <!-- Featured Video -->
      <div class="card-glass p-5 mb-6">
        <div class="flex items-center gap-3 mb-4">
          <i class="material-icons" style="color:var(--primary);font-size:24px">featured_video</i>
          <h2 class="text-lg font-bold" style="color:var(--text-heading)">Featured Video</h2>
        </div>
        <div class="aspect-video rounded-xl overflow-hidden" style="background:var(--border)">
          <iframe width="100%" height="100%"
            :src="'https://www.youtube.com/embed/' + (DATA.media?.featuredVideoId || '')"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            style="border-radius:12px">
          </iframe>
        </div>
      </div>

      <!-- All Multimedia Works Filter + Grid -->
      <span class="section-tag">All Works</span>
      <h2 class="section-title">Multimedia Portfolio</h2>

      <!-- Filter Bar -->
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

      <!-- Grid -->
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
  `
};

// --- CONTACT VIEW ---
const ContactView = {
  name: 'ContactView',
  data() {
    return {
      DATA,
      form: { name: '', email: '', message: '' },
      submitted: false,
      showSuccess: false,
      showError: false,
      errorMessage: '',
      formError: { name: false, email: false, message: false },
      formSuccess: { name: false, email: false, message: false }
    };
  },
  methods: {
    validateField(field) {
      if (this.form[field].trim()) {
        this.formError[field] = false;
        this.formSuccess[field] = true;
      } else {
        this.formError[field] = true;
        this.formSuccess[field] = false;
      }
    },
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) return 'Please enter a valid email address.';
      const [local, domain] = email.split('@');
      if (local.length > 64) return 'Email username is too long.';
      if (domain.length > 255) return 'Email domain is too long.';
      const fakePatterns = ['test@', 'asdf@', '123@', 'abc@', 'qwerty@', 'example@', 'user@', 'admin@'];
      if (fakePatterns.some(p => email.toLowerCase().startsWith(p))) return 'Please use a real email address.';
      const tld = domain.split('.').pop().toLowerCase();
      const fakeTlds = ['localhost', 'test', 'example', 'invalid', 'fake', 'local'];
      if (fakeTlds.includes(tld)) return 'Please use a real email address.';
      const DISPOSABLE_DOMAINS = ['mailinator.com','guerrillamail.com','tempmail.com','throwaway.com','yopmail.com','10minutemail.com','trashmail.com','sharklasers.com','maildrop.cc','getairmail.com','temp-mail.org','fakeinbox.com','dispostable.com','mailcatch.com','spambox.us','mailexpire.com','mintemail.com','spamgourmet.com','spamfree24.org','wh4f.org'];
      if (DISPOSABLE_DOMAINS.includes(domain.toLowerCase())) return 'Temporary email addresses are not allowed. Please use a permanent email.';
      const TYPO_DOMAINS = {'gamil.com':'gmail.com','gmial.com':'gmail.com','gmal.com':'gmail.com','yaho.com':'yahoo.com','yahooo.com':'yahoo.com','hotmal.com':'hotmail.com','hotnail.com':'hotmail.com','hotmil.com':'hotmail.com','outlok.com':'outlook.com','outllok.com':'outlook.com','protonmil.com':'protonmail.com','protonmal.com':'protonmail.com'};
      if (TYPO_DOMAINS[domain.toLowerCase()]) return `Did you mean ${TYPO_DOMAINS[domain.toLowerCase()]}? (You typed: ${domain})`;
      return null;
    },
    submitForm() {
      ['name', 'email', 'message'].forEach(f => this.validateField(f));
      if (this.form.name && this.form.email && this.form.message) {
        const emailErr = this.validateEmail(this.form.email);
        if (emailErr) {
          this.formError.email = true;
          this.showError = true;
          this.errorMessage = emailErr;
          return;
        }
        this.submitted = true;
        const formData = new FormData();
        formData.append('access_key', '10c1a904-df2c-4b15-8e7c-6407e5ae6943');
        formData.append('name', this.form.name);
        formData.append('email', this.form.email);
        formData.append('message', this.form.message);
        fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              this.showSuccess = true;
            } else {
              this.showError = true;
              this.errorMessage = data.message || 'Failed to send message. Please try again later.';
              this.submitted = false;
            }
          })
          .catch(() => {
            this.showError = true;
            this.errorMessage = 'Network error: Could not reach the mail server. Please check your connection and try again.';
            this.submitted = false;
          });
      }
    },
    closeModal() {
      const wasError = this.showError;
      this.showSuccess = false;
      this.showError = false;
      this.errorMessage = '';
      this.submitted = false;
      if (wasError) {
        Object.keys(this.formError).forEach(k => this.formError[k] = false);
        Object.keys(this.formSuccess).forEach(k => this.formSuccess[k] = false);
      } else {
        this.form = { name: '', email: '', message: '' };
        Object.keys(this.formError).forEach(k => this.formError[k] = false);
        Object.keys(this.formSuccess).forEach(k => this.formSuccess[k] = false);
      }
    }
  },
  template: `
    <div class="section">
      <span class="section-tag">Get In Touch</span>
      <h1 class="section-title">Contact Me</h1>
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <!-- Info -->
        <div class="lg:col-span-2 space-y-5">
          <div class="card-glass p-6 contact-info">
            <div class="space-y-3 text-lg">
              <div class="flex items-center gap-3"><i class="material-icons" style="color:var(--primary);font-size:18px">phone</i><div><div class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.phone1 }}</div><div class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.phone2 }}</div></div></div>
              <div class="flex items-center gap-3"><i class="material-icons" style="color:var(--primary);font-size:18px">email</i><div><div class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.email }}</div><div class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.email2 }}</div></div></div>
              <div class="flex items-center gap-3"><i class="material-icons" style="color:var(--primary);font-size:18px">location_on</i><span>{{ DATA.personal.location }}</span></div>
              <div class="flex items-center gap-3"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="color:var(--primary)"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68zm1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg><a :href="'https://' + DATA.personal.linkedin" target="_blank" class="hover:underline">{{ DATA.personal.linkedin }}</a></div>
              <div class="flex items-center gap-3"><i class="material-icons" style="color:var(--primary);font-size:18px">language</i><a :href="DATA.personal.website" target="_blank" class="hover:underline">{{ DATA.personal.website }}</a></div>
            </div>
          </div>

          <div class="card-glass p-6">
            <h3 class="text-lg font-bold mb-3" style="color:var(--text-heading)"><i class="material-icons" style="color:var(--primary);font-size:18px">info</i>Availability</h3>
            <div class="space-y-2 text-lg">
              <div class="flex justify-between"><span style="color:var(--text-label)">Available</span><span class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.available }}</span></div>
              <div class="flex justify-between"><span style="color:var(--text-label)">Relocation</span><span class="font-medium" style="color:var(--text-heading)">Yes</span></div>
            </div>
          </div>

          <div class="card-glass p-6">
            <h3 class="text-lg font-bold mb-3" style="color:var(--text-heading)"><i class="material-icons" style="color:var(--primary);font-size:18px">location_on</i>Location</h3>
            <div class="card-glass--glass flex items-start gap-3 p-4 rounded-xl mb-3" style="display:flex">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 gradient-bg">
                <i class="material-icons text-white" style="font-size:16px">location_on</i>
              </div>
              <div>
                <h4 class="font-semibold text-sm" style="color:var(--text-heading)">{{ DATA.personal.location }}</h4>
                <p class="text-xs mt-0.5" style="color:var(--text)">Current Location</p>
              </div>
            </div>
            <a :href="'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(DATA.personal.location)" target="_blank" class="card-glass--glass flex items-start gap-3 p-4 rounded-xl" style="text-decoration:none;display:flex">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 gradient-bg">
                <i class="material-icons text-white" style="font-size:16px">map</i>
              </div>
              <div>
                <h4 class="font-semibold text-sm" style="color:var(--primary)">View on Google Maps</h4>
                <p class="text-xs mt-0.5" style="color:var(--text)">Open in Google Maps</p>
              </div>
            </a>
          </div>
        </div>

        <!-- Form -->
        <div class="lg:col-span-3">
          <div class="card-glass p-6">
            <h3 class="text-lg font-bold mb-4 flex items-center gap-3" style="color:var(--text-heading)"><i class="material-icons" style="color:var(--primary);font-size:18px">send</i>Send a Message</h3>
            <form @submit.prevent="submitForm" class="space-y-4">
              <div>
                <label class="text-md font-medium mb-1 block" style="color:var(--text-label)">Your Name</label>
                <input v-model="form.name" type="text" class="contact-input w-full px-4 py-2.5 rounded-xl" style="background:var(--bg-card);border:1px solid var(--border);color:var(--text)" placeholder="John Doe">

                <label class="text-md font-medium mb-1 block" style="color:var(--text-label)">Your Email</label>
                <input v-model="form.email" type="email" class="contact-input w-full px-4 py-2.5 rounded-xl" style="background:var(--bg-card);border:1px solid var(--border);color:var(--text)" placeholder="john@example.com">

                <label class="text-md font-medium mb-1 block" style="color:var(--text-label)">Message</label>
                <textarea v-model="form.message" required class="contact-input" :class="{ error: formError.message, success: formSuccess.message }" placeholder="Write your message..." @blur="validateField('message')"></textarea>
              </div>
              <button type="submit" :disabled="submitted" class="btn-shimmer w-full py-3 px-6 gradient-bg text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2" :style="{opacity: submitted ? 0.7 : 1}">
                <i class="material-icons" :class="{ 'animate-spin': submitted }">{{ submitted ? 'sync' : 'send' }}</i> {{ submitted ? 'Sending...' : 'Send Message' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccess" class="success-overlay" @click.self="closeModal">
      <div class="success-card">
        <div class="success-check">
          <svg viewBox="0 0 24 24">
            <polyline points="4,13 9,18 20,6" />
          </svg>
        </div>
        <span class="success-tag">Success</span>
        <h3 class="success-title">Message Sent!</h3>
        <p class="success-text">
          Thank you for reaching out. Your message has been routed to
          <strong>Md. Asaduzzaman (Aminur)</strong>.
          You can expect a response within 24 hours.
        </p>
        <button @click="closeModal" class="success-btn">OK</button>
      </div>
    </div>

    <!-- Error Modal -->
    <div v-if="showError" class="success-overlay" @click.self="closeModal">
      <div class="success-card error-card">
        <div class="success-check error-check">
          <svg viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" stroke-width="4" stroke-linecap="round" />
            <line x1="6" y1="6" x2="18" y2="18" stroke-width="4" stroke-linecap="round" />
          </svg>
        </div>
        <span class="success-tag error-tag">Failed</span>
        <h3 class="success-title error-title">Message Not Sent</h3>
        <p class="success-text error-text">{{ errorMessage }}</p>
        <button @click="closeModal" class="success-btn error-btn">OK</button>
      </div>
    </div>
  `,
  mounted() {
  }
};

/* ===================================================
   PROJECT DETAIL VIEW
   =================================================== */
const ProjectDetailView = {
  name: 'ProjectDetailView',
  data() {
    return { DATA, currentSlide: 0, projectImages: null, projectMeta: null, slideTimer: null };
  },
  computed: {
    project() {
      const id = this.$route.params.id;
      return this.DATA.projectDetails[id] || null;
    },
    slideImages() {
      if (this.projectImages) return this.projectImages;
      const fallback = this.project?.images || [];
      return fallback.map(f => typeof f === 'string' ? { src: f, title: '', desc: '' } : f);
    }
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler(id) {
        this.stopAutoSlide();
        if (!id) return;
        this.currentSlide = 0;
        this.projectImages = null;
        this.projectMeta = null;
        fetch('assets/images/projects/' + id + '/project-image.json')
          .then(r => r.ok ? r.json() : { images: [] })
          .then(data => {
            if (data.images && data.images.length) this.projectImages = data.images.map(f => typeof f === 'string' ? { src: 'assets/images/projects/' + id + '/' + f, title: '', desc: '' } : { ...f, src: 'assets/images/projects/' + id + '/' + f.src });
            if (data.title) this.projectMeta = { title: data.title, company: data.company, tech: data.tech, description: data.description };
            this.startAutoSlide();
          })
          .catch(() => { this.startAutoSlide(); });
      }
    }
  },
  methods: {
    placeholderImg(e) {
      e.target.style.display = 'none';
      const parent = e.target.parentElement;
      const ph = document.createElement('div');
      ph.className = 'img-placeholder';
      parent.appendChild(ph);
    },
    prevSlide() {
      this.currentSlide = this.currentSlide > 0 ? this.currentSlide - 1 : this.slideImages.length - 1;
      this.stopAutoSlide(); this.startAutoSlide();
    },
    nextSlide() {
      this.currentSlide = this.currentSlide < this.slideImages.length - 1 ? this.currentSlide + 1 : 0;
      this.stopAutoSlide(); this.startAutoSlide();
    },
    goToSlide(i) { this.currentSlide = i; this.stopAutoSlide(); this.startAutoSlide(); },
    startAutoSlide() { if (this.slideTimer) clearInterval(this.slideTimer); if (this.slideImages.length > 1) this.slideTimer = setInterval(this.nextSlide, 3000); },
    stopAutoSlide() { if (this.slideTimer) { clearInterval(this.slideTimer); this.slideTimer = null; } }
  },
  template: `
    <div v-if="project">
      <!-- Breadcrumb Nav (desktop/tablet only) -->
      <div class="hidden lg:flex items-center gap-2 text-sm font-medium px-6 py-3 sticky top-0 z-20" style="background:var(--bg);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid var(--border);color:var(--text-label)">
        <router-link to="/" style="color:var(--primary)" class="hover:underline">Home</router-link>
        <i class="material-icons" style="font-size:14px">chevron_right</i>
        <router-link to="/projects" style="color:var(--primary)" class="hover:underline">Projects</router-link>
        <i class="material-icons" style="font-size:14px">chevron_right</i>
        <span class="truncate max-w-xs" style="color:var(--text-heading)">{{ project.title }}</span>
      </div>
      <!-- Hero Glass Card -->
      <div class="px-4 sm:px-8 lg:px-16 mb-6 project-detail-hero">
        <div class="rounded-xl" style="background:var(--bg-card);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid var(--border);padding:clamp(20px,4vw,36px);margin-top:clamp(16px,3vw,32px)">
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div class="flex-1 min-w-0">
              <span v-if="project.id === DATA.featuredProject.id || project.featured" class="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3" style="background:rgba(20,184,166,0.15);color:var(--primary-light)">TOP ACHIEVEMENT</span>
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

      <!-- Featured Image / Slider -->
      <div v-if="slideImages.length" class="px-4 sm:px-8 lg:px-16 mb-6">
        <div class="relative rounded-xl overflow-hidden" style="border:1px solid var(--border);box-shadow:var(--shadow-lg);aspect-ratio:16/9;background:var(--bg-card)" @mouseenter="stopAutoSlide" @mouseleave="startAutoSlide">
          <img :src="typeof slideImages[currentSlide] === 'string' ? slideImages[currentSlide] : slideImages[currentSlide].src" :alt="project.title + ' screenshot'" @error="placeholderImg" class="w-full h-full" style="object-fit:contain" loading="lazy">
        </div>
        <!-- Text above mini gallery -->
        <div class="mt-2 mb-3" style="background:var(--bg-card);padding:8px 14px;border-radius:8px;border:1px solid var(--border)">
          <h4 class="text-lg font-bold" style="color:var(--text-heading)">{{ typeof slideImages[currentSlide] !== 'string' && slideImages[currentSlide].title ? slideImages[currentSlide].title : projectMeta?.title || project.title }}</h4>
          <p class="text-base mt-1" style="color:var(--text-label)">{{ typeof slideImages[currentSlide] !== 'string' && slideImages[currentSlide].desc ? slideImages[currentSlide].desc : projectMeta?.description || project.abstract }}</p>
        </div>
        <!-- Mini Gallery + Controls -->
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

      <!-- Metrics -->
      <div class="px-4 sm:px-8 lg:px-16 mb-8">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="m in project.metrics" :key="m.label" class="card-glass text-center py-5 px-5">
            <div class="text-3xl font-extrabold gradient-text">{{ m.value }}</div>
            <div class="text-md font-medium mt-1" style="color:var(--text-label)">{{ m.label }}</div>
          </div>
        </div>
      </div>

      <!-- Content -->
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
              <router-link to="/contact" class="inline-block w-full py-2.5 text-center text-lg font-semibold rounded-xl gradient-bg text-white transition">
                Hire Me for This Project
              </router-link>
            </div>
            <router-link to="/projects" class="inline-flex items-center gap-2 text-lg font-medium hover:underline" style="color:var(--primary)">
              <i class="material-icons" style="font-size:16px">arrow_back</i> Back to Projects
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="section text-center">
      <p>Project not found.</p>
      <router-link to="/projects" style="color:var(--primary)">Back to Projects</router-link>
    </div>
  `,
  mounted() {
    // fade handled by Vue transition
  },
  beforeUnmount() { this.stopAutoSlide(); }
};

/* ===================================================
   ROUTER
   =================================================== */
const routes = [
  { path: '/', component: HomeView, meta: { title: 'Home' } },
  { path: '/about', component: AboutView, meta: { title: 'About' } },
  { path: '/skills', component: SkillsView, meta: { title: 'Skills' } },
  { path: '/experience', component: ExperienceView, meta: { title: 'Experience' } },
  { path: '/education', component: EducationView, meta: { title: 'Education' } },
  { path: '/projects', component: ProjectsView, meta: { title: 'Projects' } },
  { path: '/project/:id', component: ProjectDetailView, meta: { title: 'Project' } },
  { path: '/multimedia-works', component: MultimediaWorksView, meta: { title: 'Multimedia Works' } },
  { path: '/achievements', component: AchievementsView, meta: { title: 'Achievements' } },
  { path: '/services', component: ServicesView, meta: { title: 'Services' } },
  { path: '/contact', component: ContactView, meta: { title: 'Contact' } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.path === '/projects') {
      const savedY = sessionStorage.getItem('projectsScrollY');
      if (savedY) {
        sessionStorage.removeItem('projectsScrollY');
        return { top: parseInt(savedY), behavior: 'smooth' };
      }
    }
    return { top: 0, behavior: 'smooth' };
  }
});

/* ===================================================
   APP
   =================================================== */
const App = {
  name: 'App',
  data() {
    return {
      DATA,
      darkMode: false,
      mobileMenuOpen: false,
      showContactModal: false,
      showScrollTop: false,
      particleAnimId: null
    };
  },
  computed: {
    menuItems() { return this.DATA.menuItems; }
  },
  mounted() {
    const saved = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'true' || (saved === null && prefersDark)) {
      this.darkMode = true;
      document.documentElement.classList.add('dark');
    }
    window.addEventListener('scroll', this.handleScroll);
    this.observeSkillBars();
    this.$nextTick(() => this.initParticles());
  },
  watch: {
    '$route'() {
      this.$nextTick(() => {
        this.observeSkillBars();
      });
    }
  },
  methods: {
    toggleDark() {
      this.darkMode = !this.darkMode;
      document.documentElement.classList.toggle('dark', this.darkMode);
      localStorage.setItem('darkMode', this.darkMode);
    },
    toggleMobile() { this.mobileMenuOpen = !this.mobileMenuOpen; },
    closeMobile() { this.mobileMenuOpen = false; },
    toggleContactModal() { this.mobileMenuOpen = false; this.showContactModal = !this.showContactModal; },
    scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); },
    handleScroll() {
      this.showScrollTop = window.scrollY > 100;
    },
    getInitials(name) {
      return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    },
    observeSkillBars() {
      document.querySelectorAll('.skill-bar-track').forEach(el => {
        if (el._skillBarObserved) return;
        el._skillBarObserved = true;
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.querySelectorAll('.skill-bar-fill').forEach(function (el) {
                const w = el.style.width;
                el.style.width = '0';
                setTimeout(function () { el.style.width = w; }, 100);
              });
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.3 });
        observer.observe(el);
      });
    },
    initParticles() {
      const canvas = this.$refs.particleCanvas;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let w, h, particles = [];
      const resize = () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
      };
      window.addEventListener('resize', resize);
      resize();
      const count = Math.min(120, Math.floor(w * h / 10000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          r: Math.random() * 2 + 1,
          a: Math.random() * 0.5 + 0.15
        });
      }
      const draw = () => {
        this.particleAnimId = requestAnimationFrame(draw);
        ctx.clearRect(0, 0, w, h);
        const isDark = document.documentElement.classList.contains('dark');
        const color = isDark ? '20,184,166' : '20,184,166';
        particles.forEach(p => {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color},${p.a})`;
          ctx.fill();
        });
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(${color},${0.12 * (1 - dist / 120)})`;
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
        }
      };
      draw();
    }
  },
  beforeUnmount() {
    if (this.particleAnimId) cancelAnimationFrame(this.particleAnimId);
    window.removeEventListener('scroll', this.handleScroll);
  },
  template: `
    <div>
      <canvas ref="particleCanvas" class="particle-canvas"></canvas>
      <!-- Mobile Nav -->
      <nav class="mobile-nav">
        <div class="flex items-center justify-between px-4 h-full">
          <router-link to="/" @click="closeMobile" class="text-xl font-extrabold tracking-tight gradient-text">Amin670BD</router-link>
          <div class="flex items-center gap-1.5 shrink-0">
            <a href="./assets/Aminur670_CV_2026.pdf" download
              class="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all duration-300 shrink-0"
              style="height:36px;border:1px solid var(--toggle-border);background:var(--toggle-bg);backdrop-filter:blur(6px);color:var(--text-heading)">
              <i class="material-icons" style="font-size:20px">download</i>
              <span class="download-cv-short">CV</span><span class="download-cv-full">Download CV</span>
            </a>
            <button @click="toggleContactModal" class="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-lg transition-all duration-300 shrink-0" style="height:36px;border:1px solid var(--toggle-border);background:var(--toggle-bg);backdrop-filter:blur(6px);color:var(--text-heading)">
              <i class="material-icons" style="font-size:20px">contact_phone</i> <span class="download-cv-full">Contacts</span>
            </button>
            <button @click="toggleDark" aria-label="Toggle dark mode" class="theme-toggle flex items-center justify-center">
              <i class="material-icons" style="font-size:20px">{{ darkMode ? 'light_mode' : 'dark_mode' }}</i>
            </button>
            <button @click="toggleMobile" :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'" class="theme-toggle flex items-center justify-center">
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
                <h2 class="text-xl font-bold" style="color:var(--sidebar-heading)">{{ DATA.personal.name }}</h2>
                <p class="text-lg font-medium" style="color:var(--primary)">({{ DATA.personal.nickname }})</p>
                <p class="text-md mt-0.5" style="color:var(--sidebar-text)">{{ DATA.personal.title }}</p>
              </div>
              <button @click="closeMobile" aria-label="Close menu" class="theme-toggle flex items-center justify-center">
                <i class="material-icons" style="font-size:18px">close</i>
              </button>
            </div>
            <hr style="border-color:var(--sidebar-divider);margin:0 1.5rem">
          </div>
          <div class="px-6 py-3 space-y-0.5 flex-1 overflow-y-auto">
            <router-link v-for="item in menuItems" :key="item.path"
              @click="closeMobile" :to="item.path"
              class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition"
              :class="{ 'nav-link-active': $route.path === item.path }">
              <i class="material-icons w-4 text-center" style="font-size:18px">{{ item.icon }}</i>
              <span>{{ item.label }}</span>
            </router-link>
          </div>
          <div class="flex-shrink-0">
            <hr style="border-color:var(--sidebar-divider);margin:0 1.5rem">
            <div class="px-6 py-4 space-y-3">
              <a href="./assets/Aminur670_CV_2026.pdf" download
                class="btn-shimmer flex items-center justify-center gap-2 w-full py-2.5 px-4 text-white font-semibold rounded-xl gradient-bg transition-all duration-300"
                style="box-shadow:0 4px 12px rgba(20,184,166,0.25)">
                <i class="material-icons">download</i> Download CV
              </a>
              <div class="flex items-center justify-center gap-3 pt-1">
                <a :href="'https://' + DATA.personal.linkedin" target="_blank" class="theme-toggle flex items-center justify-center" title="LinkedIn" style="width:36px;height:36px">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68zm1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                </a>
                <a :href="DATA.personal.website" target="_blank" class="theme-toggle flex items-center justify-center" title="Portfolio" style="width:36px;height:36px">
                  <i class="material-icons" style="font-size:20px">language</i>
                </a>
                <a :href="'https://github.com/amin670bd'" target="_blank" class="theme-toggle flex items-center justify-center" title="GitHub" style="width:36px;height:36px">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
                </a>
                <a href="https://www.youtube.com/@aminur670" target="_blank" class="theme-toggle flex items-center justify-center" title="YouTube" style="width:36px;height:36px">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/></svg>
                </a>
                <a :href="'mailto:' + DATA.personal.email" class="theme-toggle flex items-center justify-center" title="Email" style="width:36px;height:36px">
                  <i class="material-icons" style="font-size:20px">email</i>
                </a>
              </div>
            </div>
          </div>
        </aside>
      </transition>

      <!-- Contact Modal -->
      <transition name="scale-fade">
        <div v-if="showContactModal" @click.self="showContactModal = false" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style="background:rgba(0,0,0,0.65);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)">
          <div class="w-full md:max-w-4xl flex flex-col overflow-hidden rounded-xl" style="max-height:85dvh;height:85dvh;background:var(--bg-card);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid var(--border)">
            <div class="flex items-center justify-between px-4 py-3 shrink-0" style="border-bottom:1px solid var(--border)">
              <h2 class="text-base font-bold flex items-center gap-1.5" style="color:var(--text-heading)">
                <i class="material-icons" style="font-size:18px;color:var(--primary)">contact_phone</i> Contact
              </h2>
              <button @click="showContactModal = false" aria-label="Close contact modal" class="w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:bg-black/5" style="color:var(--text-label)">
                <i class="material-icons" style="font-size:18px">close</i>
              </button>
            </div>
            <div class="flex-1 min-h-0 overflow-y-auto" style="-webkit-overflow-scrolling:touch">
              <div class="grid md:grid-cols-2 gap-3 p-4">
              <div class="space-y-3">
                <p class="text-[11px] font-semibold tracking-wider" style="color:var(--text-label)">WHATSAPP</p>
                <a class="card-glass--glass flex flex-col items-center gap-3 p-4 rounded-xl" style="text-decoration:none" @click.stop>
                  <img src="assets/images/whatsapp_qr.png" alt="WhatsApp QR code for Md. Asaduzzaman (Aminur)" class="w-14 h-14 rounded-xl" style="border:2px solid var(--border);background:white">
                </a>
                <a :href="'https://wa.me/' + DATA.personal.phone1.replace(/[^0-9]/g,'')" target="_blank" class="card-glass--glass flex items-start gap-3 p-4 rounded-xl" style="text-decoration:none;display:flex" @click.stop>
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 gradient-bg">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M12 2C6.477 2 2 6.477 2 12c0 2.097.602 4.055 1.638 5.708L2 22l4.374-1.604C8.02 21.378 9.965 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.833 0-3.557-.58-4.973-1.573l-.357-.237-2.597.954.96-2.549-.255-.38A7.956 7.956 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.19-5.94c-.23-.115-1.36-.67-1.57-.746-.21-.077-.363-.115-.516.115-.153.23-.593.746-.727.899-.134.153-.268.172-.498.057-.23-.115-.972-.358-1.85-1.143-.684-.613-1.146-1.37-1.28-1.602-.134-.23-.014-.355.101-.47.103-.103.23-.268.345-.402.115-.134.153-.23.23-.383.077-.153.038-.287-.019-.402-.057-.115-.516-1.244-.707-1.704-.186-.45-.374-.372-.516-.372-.134 0-.287-.019-.44-.019-.153 0-.402.057-.612.287-.21.23-.802.784-.802 1.913s.82 2.22.935 2.373c.115.153 1.614 2.465 3.91 3.456.546.236.972.377 1.305.482.548.173 1.048.149 1.442.09.44-.066 1.36-.555 1.552-1.092.192-.537.192-.997.134-1.093-.057-.096-.21-.153-.44-.268z"/></svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-sm" style="color:#25D366">{{ DATA.personal.phone1 }}</h4>
                    <p class="text-xs mt-0.5" style="color:var(--text)">WhatsApp</p>
                  </div>
                </a>
                <a :href="'https://wa.me/' + DATA.personal.phone2.replace(/[^0-9]/g,'')" target="_blank" class="card-glass--glass flex items-start gap-3 p-4 rounded-xl" style="text-decoration:none;display:flex" @click.stop>
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 gradient-bg">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M12 2C6.477 2 2 6.477 2 12c0 2.097.602 4.055 1.638 5.708L2 22l4.374-1.604C8.02 21.378 9.965 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.833 0-3.557-.58-4.973-1.573l-.357-.237-2.597.954.96-2.549-.255-.38A7.956 7.956 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.19-5.94c-.23-.115-1.36-.67-1.57-.746-.21-.077-.363-.115-.516.115-.153.23-.593.746-.727.899-.134.153-.268.172-.498.057-.23-.115-.972-.358-1.85-1.143-.684-.613-1.146-1.37-1.28-1.602-.134-.23-.014-.355.101-.47.103-.103.23-.268.345-.402.115-.134.153-.23.23-.383.077-.153.038-.287-.019-.402-.057-.115-.516-1.244-.707-1.704-.186-.45-.374-.372-.516-.372-.134 0-.287-.019-.44-.019-.153 0-.402.057-.612.287-.21.23-.802.784-.802 1.913s.82 2.22.935 2.373c.115.153 1.614 2.465 3.91 3.456.546.236.972.377 1.305.482.548.173 1.048.149 1.442.09.44-.066 1.36-.555 1.552-1.092.192-.537.192-.997.134-1.093-.057-.096-.21-.153-.44-.268z"/></svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-sm" style="color:#25D366">{{ DATA.personal.phone2 }}</h4>
                    <p class="text-xs mt-0.5" style="color:var(--text)">WhatsApp</p>
                  </div>
                </a>
              </div>
              <div class="space-y-3">
                <p class="text-[11px] font-semibold tracking-wider" style="color:var(--text-label)">EMAIL</p>
                <a :href="'mailto:' + DATA.personal.email" class="card-glass--glass flex items-start gap-3 p-4 rounded-xl" style="text-decoration:none;display:flex" @click.stop>
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 gradient-bg">
                    <i class="material-icons text-white" style="font-size:16px">email</i>
                  </div>
                  <div>
                    <h4 class="font-semibold text-sm" style="color:var(--text-heading)">{{ DATA.personal.email }}</h4>
                    <p class="text-xs mt-0.5" style="color:var(--text)">Email Primary</p>
                  </div>
                </a>
                <a :href="'mailto:' + DATA.personal.email2" class="card-glass--glass flex items-start gap-3 p-4 rounded-xl" style="text-decoration:none;display:flex" @click.stop>
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 gradient-bg">
                    <i class="material-icons text-white" style="font-size:16px">email</i>
                  </div>
                  <div>
                    <h4 class="font-semibold text-sm" style="color:var(--text-heading)">{{ DATA.personal.email2 }}</h4>
                    <p class="text-xs mt-0.5" style="color:var(--text)">Email Secondary</p>
                  </div>
                </a>
              </div>
          </div>
        </div>
      </transition>

      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-scroll">
          <div class="p-6 text-center">
              <div class="w-full sm:w-44 md:w-52 lg:w-60 mx-auto mb-4 rounded-2xl overflow-hidden aspect-square" style="border:3px solid rgba(20,184,166,0.3)">
                <img :src="DATA.personal.photo" :alt="DATA.personal.name" class="w-full h-full object-cover" loading="lazy">
              </div>
            <h2 class="text-xl font-bold" style="color:var(--sidebar-heading)">{{ DATA.personal.name }}</h2>
            <p class="text-lg font-medium" style="color:var(--primary)">({{ DATA.personal.nickname }})</p>
            <p class="text-lg mt-0.5" style="color:var(--sidebar-text)">{{ DATA.personal.title }}</p>
          </div>

          <!-- Sidebar Nav -->
          <div class="px-4 space-y-0.5">
            <router-link v-for="item in menuItems" :key="item.path"
              :to="item.path"
              class="nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition"
              :class="{ 'nav-link-active': $route.path === item.path }"
              @click="closeMobile">
              <i class="material-icons w-4 text-center" style="font-size:18px">{{ item.icon }}</i>
              <span>{{ item.label }}</span>
            </router-link>
          </div>

        </div>

        <!-- Download + Theme (fixed at bottom) -->
        <div class="px-6 py-4 space-y-3" style="border-top:1px solid var(--sidebar-divider)">
          <a href="./assets/Aminur670_CV_2026.pdf" download
            class="btn-shimmer flex items-center justify-center gap-2 w-full py-2.5 px-4 text-white font-semibold rounded-xl gradient-bg transition-all duration-300"
            style="box-shadow:0 4px 12px rgba(20,184,166,0.25)">
            <i class="material-icons">download</i> Download CV
          </a>
          <div class="flex items-center justify-between">
            <span class="text-lg flex items-center gap-1.5" style="color:var(--sidebar-text)"><span class="w-1.5 h-1.5 rounded-full" style="background:var(--accent-emerald);box-shadow:0 0 6px rgba(16,185,129,0.4)"></span> Available</span>
            <div class="flex items-center gap-2">
              <button @click="toggleContactModal" class="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-300" style="border:1px solid var(--primary);color:var(--primary)">
                <i class="material-icons" style="font-size:16px">contact_phone</i> Contacts
              </button>
              <button @click="toggleDark" aria-label="Toggle dark mode" class="theme-toggle">
                <i class="material-icons" style="transition:transform 0.3s ease">{{ darkMode ? 'light_mode' : 'dark_mode' }}</i>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <router-view />
        <div class="footer">
          <p>&copy; 2026 Md. Asaduzzaman (Aminur). All rights reserved.</p>
        </div>
      </main>

      <!-- Scroll to top -->
      <button @click="scrollToTop" aria-label="Scroll to top" class="scroll-top gradient-bg" :class="{ visible: showScrollTop }" :style="{boxShadow: '0 4px 15px rgba(20,184,166,0.4)'}">
        <i class="material-icons" style="transition:transform 0.3s ease">arrow_upward</i>
      </button>
    </div>
  `
};

/* ===================================================
   MOUNT — handled in index.html bootstrap
   =================================================== */
