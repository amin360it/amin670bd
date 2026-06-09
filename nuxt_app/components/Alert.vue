<template>
  <transition name="scale-fade">
    <div v-if="visible" class="relative rounded-xl p-4 flex items-start gap-3 border"
      :style="styles">
      <i class="material-icons shrink-0" style="font-size:20px;margin-top:2px">{{ iconMap[variant] }}</i>
      <div class="flex-1 min-w-0">
        <p v-if="title" class="font-semibold text-sm" style="margin-bottom:2px">{{ title }}</p>
        <p class="text-sm leading-relaxed"><slot /></p>
      </div>
      <button v-if="dismissible" @click="visible = false" class="shrink-0 flex items-center justify-center w-6 h-6 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-all" style="background:transparent;border:none;cursor:pointer;color:inherit">
        <i class="material-icons" style="font-size:14px">close</i>
      </button>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Alert',
  props: {
    variant: { type: String, default: 'info' },
    title: { type: String, default: '' },
    dismissible: Boolean,
    modelValue: { type: Boolean, default: true }
  },
  emits: ['update:modelValue'],
  data() {
    return { visible: this.modelValue }
  },
  watch: {
    modelValue(v) { this.visible = v },
    visible(v) { this.$emit('update:modelValue', v) }
  },
  computed: {
    iconMap() {
      return {
        info: 'info',
        success: 'check_circle',
        warning: 'warning',
        error: 'error',
        tip: 'lightbulb'
      }
    },
    styles() {
      const map = {
        info: { background: 'rgba(8,145,178,0.08)', borderColor: 'rgba(8,145,178,0.2)', color: 'var(--primary)' },
        success: { background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.2)', color: '#059669' },
        warning: { background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.2)', color: '#d97706' },
        error: { background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)', color: '#dc2626' },
        tip: { background: 'rgba(168,85,247,0.08)', borderColor: 'rgba(168,85,247,0.2)', color: '#9333ea' }
      }
      const s = map[this.variant] || map.info
      return { background: s.background, borderColor: s.borderColor, color: s.color }
    }
  }
}
</script>
