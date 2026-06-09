<template>
  <button @click="$emit('click', $event)" :aria-label="ariaLabel || label" :title="label"
    class="theme-toggle flex items-center justify-center"
    :style="{ width: sizeMap[size], height: sizeMap[size] }"
    :disabled="disabled">
    <i v-if="icon" class="material-icons" :style="{ fontSize: iconSizeMap[size] }">{{ icon }}</i>
    <slot />
  </button>
</template>

<script>
export default {
  name: 'IconButton',
  emits: ['click'],
  props: {
    icon: { type: String, required: true },
    label: { type: String, default: '' },
    ariaLabel: { type: String, default: '' },
    size: { type: String, default: 'md' },
    disabled: Boolean
  },
  computed: {
    sizeMap() { return { sm: '32px', md: '36px', lg: '44px' } },
    iconSizeMap() { return { sm: '18px', md: '20px', lg: '24px' } }
  }
}
</script>
