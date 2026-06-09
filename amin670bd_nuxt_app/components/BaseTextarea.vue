<template>
  <div class="space-y-1">
    <label v-if="label" class="text-md font-medium mb-1 block" style="color:var(--text-label)">
      {{ label }} <span v-if="required" style="color:#ef4444">*</span>
    </label>
    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur', $event)"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      class="contact-input w-full rounded-xl"
      :class="{ error: error, success: success }"
      :style="{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', resize: resize, minHeight: minHeight }"
    ></textarea>
    <p v-if="hint && !error" class="text-xs mt-1" style="color:var(--text-muted)">{{ hint }}</p>
    <p v-if="error" class="text-xs mt-1" style="color:#ef4444">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: 'BaseTextarea',
  props: {
    modelValue: String,
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    disabled: Boolean,
    required: Boolean,
    rows: { type: [Number, String], default: 4 },
    error: { type: [String, Boolean], default: false },
    hint: { type: String, default: '' },
    resize: { type: String, default: 'vertical' },
    minHeight: { type: String, default: '' }
  },
  emits: ['update:modelValue', 'blur']
}
</script>
