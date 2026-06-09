<template>
  <transition name="scale-fade">
    <div v-if="show" @click.self="$emit('close')" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style="background:rgba(0,0,0,0.65);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)">
      <div class="w-full md:max-w-4xl flex flex-col overflow-hidden rounded-xl" style="max-height:85dvh;height:85dvh;background:var(--bg-card);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid var(--border)">
        <div class="flex items-center justify-between px-4 py-3 shrink-0" style="border-bottom:1px solid var(--border)">
          <h2 class="text-base font-bold flex items-center gap-1.5" style="color:var(--text-heading)">
            <i class="material-icons" style="font-size:18px;color:var(--primary)">contact_phone</i> Contact
          </h2>
          <button @click="$emit('close')" aria-label="Close contact modal" class="w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:bg-black/5" style="color:var(--text-label)">
            <i class="material-icons" style="font-size:18px">close</i>
          </button>
        </div>
        <div class="flex-1 min-h-0 overflow-y-auto" style="-webkit-overflow-scrolling:touch">
          <div class="grid md:grid-cols-2 gap-3 p-4">
          <div class="space-y-3">
            <p class="text-[11px] font-semibold tracking-wider" style="color:var(--text-label)">WHATSAPP</p>
            <a class="card-glass--glass flex flex-col items-center gap-3 p-4 rounded-xl" style="text-decoration:none" @click.stop>
              <img src="/images/whatsapp_qr.png" alt="WhatsApp QR code for Md. Asaduzzaman (Aminur)" class="w-14 h-14 rounded-xl" style="border:2px solid var(--border);background:white">
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
    </div>
    </div>
  </transition>
</template>

<script>
import { useData } from '~/composables/useData'
export default {
  name: 'ContactModal',
  props: { show: Boolean },
  emits: ['close'],
  data() {
    return { DATA: useData() }
  }
}
</script>
