<template>
  <div class="flex flex-col items-center justify-center py-20" style="color:var(--text-label)">
    <div v-if="type === 'spinner'" class="w-8 h-8 border-2 rounded-full animate-spin mb-3" :style="{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }"></div>
    <div v-else-if="type === 'pulse'" class="flex items-center gap-1.5 mb-3">
      <div v-for="i in 3" :key="i" class="w-2 h-2 rounded-full" :style="{ background: 'var(--primary)', animation: 'pulse 1.2s ease-in-out infinite', animationDelay: (i * 0.2) + 's' }"></div>
    </div>
    <div v-else class="w-full max-w-md space-y-3">
      <div v-for="j in skeletonLines" :key="j" class="h-4 rounded-lg animate-pulse" :style="{ background: 'var(--border)', width: (50 + Math.random() * 50) + '%' }"></div>
    </div>
    <p v-if="text" class="text-sm mt-2">{{ text }}</p>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    type: { type: String, default: 'spinner' },
    text: { type: String, default: '' },
    skeletonLines: { type: Number, default: 3 }
  }
}
</script>

<style scoped>
@keyframes pulse {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}
</style>
