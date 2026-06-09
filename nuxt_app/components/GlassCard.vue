<template>
  <div class="card-glass" :class="[variant, { 'card-glass--glass': glass }, customClass]" :style="style">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'GlassCard',
  props: {
    variant: { type: String, default: 'default' },
    glass: Boolean,
    padding: { type: String, default: '' },
    customClass: [String, Array, Object]
  },
  computed: {
    style() {
      const s = {}
      if (this.padding) s.padding = this.padding
      return s
    }
  }
}
</script>
