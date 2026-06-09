<template>
  <div class="section">
    <span class="section-tag">About Me</span>
    <h1 class="section-title">Who I Am</h1>

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
      <div class="lg:col-span-2 space-y-5">
        <div class="card-glass p-6">
          <h4 class="text-lg font-bold mb-3 flex items-center gap-2" style="color:var(--text-heading)"><i class="material-icons" style="color:var(--primary);font-size:18px">badge</i> Personal Details</h4>
          <div class="space-y-2">
            <div class="flex justify-between py-1" style="border-bottom:1px solid var(--border)"><span class="text-sm" style="color:var(--text-label)">Date of Birth</span><span class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.dob }}</span></div>
            <div class="flex justify-between py-1" style="border-bottom:1px solid var(--border)"><span class="text-sm" style="color:var(--text-label)">Blood Group</span><span class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.blood }}</span></div>
            <div class="flex justify-between py-1" style="border-bottom:1px solid var(--border)"><span class="text-sm" style="color:var(--text-label)">Religion</span><span class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.religion }}</span></div>
          </div>
        </div>

        <div class="card-glass p-6">
          <h4 class="text-lg font-bold mb-3 flex items-center gap-2" style="color:var(--text-heading)"><i class="material-icons" style="color:var(--primary);font-size:18px">translate</i> Languages</h4>
          <div class="space-y-3">
            <div v-for="l in DATA.languages" :key="l.name">
              <div class="flex justify-between mb-1"><span>{{ l.name }}</span><span class="text-sm" style="color:var(--text-label)">{{ l.level }}</span></div>
              <div class="skill-bar-track"><div class="skill-bar-fill" :style="{ width: l.pct + '%' }"></div></div>
            </div>
          </div>
        </div>

        <div class="card-glass p-6">
          <h4 class="text-lg font-bold mb-3 flex items-center gap-2" style="color:var(--text-heading)"><i class="material-icons" style="color:var(--primary);font-size:18px">work</i> Employment Details</h4>
          <div class="space-y-2">
            <div class="flex justify-between py-1" style="border-bottom:1px solid var(--border)"><span class="text-sm" style="color:var(--text-label)">Available</span><span class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.available }}</span></div>
            <div class="flex justify-between py-1"><span class="text-sm" style="color:var(--text-label)">Location</span><span class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.location }}</span></div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-3 space-y-5">
        <div class="card-glass p-6">
          <h3 class="text-lg font-bold mb-4 flex items-center gap-3" style="color:var(--text-heading)"><i class="material-icons" style="color:var(--primary)">psychology</i> Career Objective</h3>
          <p class="text-base leading-relaxed" style="color:var(--text)">{{ DATA.objective }}</p>
        </div>

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
</template>

<script>
import { useData } from '~/composables/useData'
export default {
  name: 'AboutView',
  data() { return { DATA: useData() } }
}
</script>
