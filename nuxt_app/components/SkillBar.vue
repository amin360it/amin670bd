<template>
  <div class="space-y-1">
    <div class="flex justify-between">
      <span class="text-sm font-medium" style="color:var(--text)">{{ label }}</span>
      <span class="text-sm" style="color:var(--text-label)">{{ value }}{{ suffix }}</span>
    </div>
    <div class="skill-bar-track">
      <div class="skill-bar-fill" :style="{ width: pct + '%', transitionDelay: delay + 'ms' }"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkillBar',
  props: {
    label: { type: String, required: true },
    value: { type: [String, Number], default: '' },
    pct: { type: [Number, String], required: true },
    suffix: { type: String, default: '%' },
    delay: { type: Number, default: 0 }
  }
}
</script>
