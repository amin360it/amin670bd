<template>
  <teleport to="body">
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <transition-group name="toast-list">
        <div v-for="t in toasts" :key="t.id"
          class="pointer-events-auto rounded-xl p-4 flex items-start gap-3 border shadow-lg transition-all duration-300"
          :style="getStyle(t)">
          <i class="material-icons shrink-0" style="font-size:20px;margin-top:2px">{{ iconMap[t.variant] }}</i>
          <div class="flex-1 min-w-0">
            <p v-if="t.title" class="font-semibold text-sm" style="margin-bottom:2px">{{ t.title }}</p>
            <p class="text-sm leading-relaxed">{{ t.message }}</p>
          </div>
          <button @click="remove(t.id)" class="shrink-0 flex items-center justify-center w-6 h-6 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-all" style="background:transparent;border:none;cursor:pointer;color:inherit">
            <i class="material-icons" style="font-size:14px">close</i>
          </button>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script>
export default {
  name: 'Toast',
  data() {
    return {
      toasts: [],
      counter: 0
    }
  },
  computed: {
    iconMap() {
      return { info: 'info', success: 'check_circle', warning: 'warning', error: 'error', tip: 'lightbulb' }
    }
  },
  methods: {
    add(message, opts = {}) {
      const id = ++this.counter
      const t = { id, message, variant: opts.variant || 'info', title: opts.title || '', duration: opts.duration || 4000 }
      this.toasts.push(t)
      if (t.duration > 0) {
        setTimeout(() => this.remove(id), t.duration)
      }
      return id
    },
    remove(id) {
      const idx = this.toasts.findIndex(t => t.id === id)
      if (idx >= 0) this.toasts.splice(idx, 1)
    },
    getStyle(t) {
      const map = {
        info: { background: 'rgba(8,145,178,0.12)', borderColor: 'rgba(8,145,178,0.25)', color: 'var(--primary)' },
        success: { background: 'rgba(16,185,129,0.12)', borderColor: 'rgba(16,185,129,0.25)', color: '#059669' },
        warning: { background: 'rgba(245,158,11,0.12)', borderColor: 'rgba(245,158,11,0.25)', color: '#d97706' },
        error: { background: 'rgba(239,68,68,0.12)', borderColor: 'rgba(239,68,68,0.25)', color: '#dc2626' },
        tip: { background: 'rgba(168,85,247,0.12)', borderColor: 'rgba(168,85,247,0.25)', color: '#9333ea' }
      }
      const s = map[t.variant] || map.info
      return { background: s.background, borderColor: s.borderColor, color: s.color }
    }
  }
}
</script>

<style scoped>
.toast-list-enter-active { animation: slideIn 0.3s ease; }
.toast-list-leave-active { animation: slideOut 0.25s ease; }
@keyframes slideIn { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
@keyframes slideOut { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(100%); } }
</style>
