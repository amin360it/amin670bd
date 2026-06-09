<template>
  <div class="space-y-1">
    <label v-if="label" class="text-md font-medium mb-1 block" style="color:var(--text-label)">
      {{ label }} <span v-if="required" style="color:#ef4444">*</span>
    </label>
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      :disabled="disabled"
      class="w-full px-4 py-2.5 rounded-xl text-sm font-medium appearance-none cursor-pointer"
      :class="{ error: error }"
      :style="{ background: 'var(--bg-card)', color: 'var(--text-heading)', border: '1px solid var(--border)', outline: 'none' }"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value || opt" :value="opt.value || opt" :disabled="opt.disabled">
        {{ opt.label || opt }}
      </option>
    </select>
    <p v-if="hint && !error" class="text-xs mt-1" style="color:var(--text-muted)">{{ hint }}</p>
    <p v-if="error" class="text-xs mt-1" style="color:#ef4444">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: 'BaseSelect',
  props: {
    modelValue: [String, Number],
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    options: { type: Array, required: true },
    disabled: Boolean,
    required: Boolean,
    error: { type: [String, Boolean], default: false },
    hint: { type: String, default: '' }
  },
  emits: ['update:modelValue']
}
</script>
