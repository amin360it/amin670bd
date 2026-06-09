<template>
  <span class="inline-flex items-center gap-1 font-semibold rounded-full skill-pill" :class="[colorClass, sizeClass]">
    <i v-if="icon" class="material-icons" style="font-size:14px">{{ icon }}</i>
    <slot />
  </span>
</template>

<script>
export default {
  name: 'Badge',
  props: {
    variant: { type: String, default: 'default' },
    size: { type: String, default: 'sm' },
    icon: { type: String, default: '' }
  },
  computed: {
    colorClass() {
      return ''
    },
    sizeClass() {
      return this.size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm'
    }
  }
}
</script>
