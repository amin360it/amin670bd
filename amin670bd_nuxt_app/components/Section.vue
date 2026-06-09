<template>
  <div class="section" :style="style">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Section',
  props: {
    tag: { type: String, default: '' },
    title: { type: String, default: '' },
    maxWidth: { type: String, default: '' }
  },
  computed: {
    style() {
      const s = {}
      if (this.maxWidth) s.maxWidth = this.maxWidth
      return s
    }
  }
}
</script>
