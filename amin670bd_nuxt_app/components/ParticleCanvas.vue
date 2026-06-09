<template>
  <canvas ref="canvas" class="particle-canvas"></canvas>
</template>

<script>
export default {
  name: 'ParticleCanvas',
  mounted() {
    const { initParticles, destroyParticles } = useParticles()
    this._destroy = destroyParticles
    initParticles(this.$refs.canvas)
  },
  beforeUnmount() {
    if (this._destroy) this._destroy()
  }
}
</script>
