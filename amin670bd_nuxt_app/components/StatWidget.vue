<template>
  <div class="card-glass text-center py-5 px-5" :class="{ 'rounded-xl': true }">
    <div class="text-3xl font-extrabold gradient-text">{{ value }}</div>
    <div class="text-md font-medium mt-1" style="color:var(--text-label)">{{ label }}</div>
  </div>
</template>

<script>
export default {
  name: 'StatWidget',
  props: {
    value: { type: [String, Number], required: true },
    label: { type: String, required: true }
  }
}
</script>
