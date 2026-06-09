<template>
  <div class="rounded-full overflow-hidden shrink-0" :style="containerStyle">
    <img v-if="src" :src="src" :alt="alt" class="w-full h-full object-cover" @error="onError" loading="lazy">
    <div v-else class="w-full h-full flex items-center justify-center text-white font-bold" :style="{ background: 'linear-gradient(135deg, var(--gradient-deep), var(--gradient-teal), var(--gradient-green))', backgroundSize: '200% 200%' }">
      {{ initials }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Avatar',
  props: {
    src: { type: String, default: '' },
    alt: { type: String, default: '' },
    size: { type: [Number, String], default: 80 },
    name: { type: String, default: '' }
  },
  data() {
    return { imgError: false }
  },
  computed: {
    containerStyle() {
      const s = parseInt(String(this.size))
      return { width: s + 'px', height: s + 'px', minWidth: s + 'px', border: '3px solid var(--primary)' }
    },
    initials() {
      if (!this.name) return '?'
      return this.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    }
  },
  methods: {
    onError(e) {
      this.imgError = true
      e.target.style.display = 'none'
    }
  }
}
</script>
