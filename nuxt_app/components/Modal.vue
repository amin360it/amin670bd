<template>
  <transition name="scale-fade">
    <div v-if="modelValue" @click.self="close" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style="background:rgba(0,0,0,0.65);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)">
      <div class="w-full flex flex-col overflow-hidden rounded-xl" :style="{ maxWidth: maxWidth, maxHeight: maxHeight || '85dvh', height: height || 'auto', background: 'var(--bg-card)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid var(--border)' }">
        <div v-if="title" class="flex items-center justify-between px-4 py-3 shrink-0" style="border-bottom:1px solid var(--border)">
          <h2 class="text-base font-bold flex items-center gap-1.5" style="color:var(--text-heading)">
            <i v-if="icon" class="material-icons" :style="{ fontSize: '18px', color: 'var(--primary)' }">{{ icon }}</i>
            {{ title }}
          </h2>
          <button @click="close" aria-label="Close" class="w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:bg-black/5" style="color:var(--text-label)">
            <i class="material-icons" style="font-size:18px">close</i>
          </button>
        </div>
        <div v-if="$slots.default" class="flex-1 min-h-0 overflow-y-auto" style="-webkit-overflow-scrolling:touch" :class="bodyClass">
          <slot />
        </div>
        <div v-if="$slots.footer" class="px-4 py-3 shrink-0" style="border-top:1px solid var(--border)">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    modelValue: Boolean,
    title: { type: String, default: '' },
    icon: { type: String, default: '' },
    maxWidth: { type: String, default: '500px' },
    maxHeight: { type: String, default: '' },
    height: { type: String, default: '' },
    bodyClass: { type: String, default: 'p-4' },
    closeOnBackdrop: { type: Boolean, default: true }
  },
  emits: ['update:modelValue'],
  methods: {
    close() {
      if (this.closeOnBackdrop) this.$emit('update:modelValue', false)
    }
  }
}
</script>
