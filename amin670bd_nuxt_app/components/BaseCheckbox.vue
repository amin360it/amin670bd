<template>
  <label class="inline-flex items-center gap-3 cursor-pointer select-none" :style="{ color: 'var(--text)' }">
    <div class="relative flex items-center justify-center w-5 h-5 rounded-md transition-all duration-200 shrink-0"
      :style="{ background: checked ? 'linear-gradient(135deg, var(--gradient-deep), var(--gradient-teal), var(--gradient-green))' : 'var(--bg-card)', border: checked ? 'none' : '2px solid var(--border)' }">
      <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" :disabled="disabled" class="absolute inset-0 opacity-0 cursor-pointer">
      <i v-if="modelValue" class="material-icons text-white" style="font-size:14px">check</i>
    </div>
    <span v-if="$slots.default || label" class="text-sm font-medium"><slot>{{ label }}</slot></span>
  </label>
</template>

<script>
export default {
  name: 'BaseCheckbox',
  props: {
    modelValue: Boolean,
    label: { type: String, default: '' },
    disabled: Boolean
  },
  emits: ['update:modelValue'],
  computed: {
    checked() { return this.modelValue }
  }
}
</script>
