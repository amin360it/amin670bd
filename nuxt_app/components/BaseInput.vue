<template>
  <div class="space-y-1">
    <label v-if="label" class="text-md font-medium mb-1 block" :class="{ 'sr-only': srLabel }" style="color:var(--text-label)">
      {{ label }} <span v-if="required" style="color:#ef4444">*</span>
    </label>
    <div class="relative">
      <i v-if="leftIcon" class="material-icons absolute left-3 top-1/2 -translate-y-1/2" :style="{ color: 'var(--text-muted)', fontSize: leftIconSize }">{{ leftIcon }}</i>
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        class="contact-input w-full rounded-xl"
        :class="[inputClass, { error: error, success: success, 'pl-10': leftIcon }]"
        :style="[inputStyle, { background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)' }]"
      />
      <button v-if="clearable && modelValue" @click="$emit('update:modelValue', '')" type="button" class="absolute right-3 top-1/2 -translate-y-1/2 theme-toggle flex items-center justify-center" style="width:20px;height:20px;border:none;background:none;color:var(--text-muted);cursor:pointer">
        <i class="material-icons" style="font-size:14px">close</i>
      </button>
    </div>
    <p v-if="hint && !error" class="text-xs mt-1" style="color:var(--text-muted)">{{ hint }}</p>
    <p v-if="error" class="text-xs mt-1" style="color:#ef4444">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: 'BaseInput',
  props: {
    modelValue: [String, Number],
    label: { type: String, default: '' },
    srLabel: Boolean,
    placeholder: { type: String, default: '' },
    type: { type: String, default: 'text' },
    disabled: Boolean,
    readonly: Boolean,
    required: Boolean,
    error: { type: [String, Boolean], default: false },
    success: { type: [String, Boolean], default: false },
    hint: { type: String, default: '' },
    clearable: Boolean,
    leftIcon: { type: String, default: '' },
    leftIconSize: { type: String, default: '18px' },
    inputClass: [String, Array, Object],
    inputStyle: [Object, String]
  },
  emits: ['update:modelValue', 'blur']
}
</script>
