<template>
  <GlassCard class="text-center py-5 px-5">
    <div class="text-3xl font-extrabold gradient-text">{{ value }}</div>
    <div class="text-md font-medium mt-1" style="color:var(--text-label)">{{ label }}</div>
    <p v-if="change !== undefined" class="text-xs mt-1 font-medium" :style="{ color: change >= 0 ? 'var(--accent-emerald)' : '#ef4444' }">
      <i class="material-icons" style="font-size:12px;vertical-align:middle">{{ change >= 0 ? 'trending_up' : 'trending_down' }}</i>
      {{ change >= 0 ? '+' : '' }}{{ change }}%
    </p>
  </GlassCard>
</template>

<script>
export default {
  name: 'MetricCard',
  props: {
    value: { type: [String, Number], required: true },
    label: { type: String, required: true },
    change: { type: Number, default: undefined }
  }
}
</script>
