<template>
  <label class="inline-flex items-center gap-3 cursor-pointer select-none" :style="{ color: 'var(--text)' }">
    <div class="relative flex items-center justify-center w-5 h-5 rounded-full transition-all duration-200 shrink-0"
      :style="{ background: checked ? 'linear-gradient(135deg, var(--gradient-deep), var(--gradient-teal), var(--gradient-green))' : 'var(--bg-card)', border: checked ? 'none' : '2px solid var(--border)' }">
      <input type="radio" :name="name" :value="value" :checked="checked" @change="$emit('update:modelValue', value)" :disabled="disabled" class="absolute inset-0 opacity-0 cursor-pointer">
      <div v-if="checked" class="w-2 h-2 rounded-full bg-white"></div>
    </div>
    <span v-if="$slots.default || label" class="text-sm font-medium"><slot>{{ label }}</slot></span>
  </label>
</template>

<script>
export default {
  name: 'BaseRadio',
  props: {
    modelValue: [String, Number, Boolean],
    value: { type: [String, Number, Boolean], required: true },
    name: { type: String, default: '' },
    label: { type: String, default: '' },
    disabled: Boolean
  },
  emits: ['update:modelValue'],
  computed: {
    checked() { return this.modelValue === this.value }
  }
}
</script>
