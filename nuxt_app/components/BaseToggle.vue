<template>
  <label class="inline-flex items-center gap-3 cursor-pointer select-none">
    <div @click="toggle" class="relative w-11 h-6 rounded-full transition-all duration-300 shrink-0"
      :style="{ background: modelValue ? 'var(--primary)' : 'var(--border)' }">
      <div class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-sm"
        :style="{ transform: modelValue ? 'translateX(20px)' : 'translateX(0)' }">
      </div>
    </div>
    <span v-if="$slots.default || label" class="text-sm font-medium" style="color:var(--text)"><slot>{{ label }}</slot></span>
  </label>
</template>

<script>
export default {
  name: 'BaseToggle',
  props: {
    modelValue: Boolean,
    label: { type: String, default: '' }
  },
  emits: ['update:modelValue'],
  methods: {
    toggle() { this.$emit('update:modelValue', !this.modelValue) }
  }
}
</script>
