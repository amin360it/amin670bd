<template>
  <div class="inline-flex items-center rounded-xl overflow-hidden" :style="{ border: '1px solid var(--border)', background: 'var(--bg-card)' }">
    <button v-for="(btn,i) in buttons" :key="i" @click="$emit('select', btn.value)"
      class="px-4 py-2 text-sm font-semibold transition-all duration-200"
      :class="{ 'gradient-bg text-white': modelValue === btn.value }"
      :style="{ borderRight: i < buttons.length - 1 ? '1px solid var(--border)' : 'none', color: modelValue === btn.value ? 'white' : 'var(--text)', background: modelValue === btn.value ? '' : 'transparent' }">
      {{ btn.label }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'ButtonGroup',
  props: {
    buttons: { type: Array, required: true },
    modelValue: { type: [String, Number], default: '' }
  },
  emits: ['select', 'update:modelValue'],
  methods: {
    select(val) {
      this.$emit('select', val)
      this.$emit('update:modelValue', val)
    }
  }
}
</script>
