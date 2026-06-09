<template>
  <div class="hidden lg:flex items-center gap-2 text-sm font-medium px-6 py-3 sticky top-0 z-20" style="background:var(--bg);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid var(--border);color:var(--text-label)">
    <template v-for="(crumb,i) in items" :key="i">
      <NuxtLink v-if="crumb.to" :to="crumb.to" style="color:var(--primary)" class="hover:underline whitespace-nowrap">{{ crumb.label }}</NuxtLink>
      <span v-else class="truncate max-w-xs" style="color:var(--text-heading)">{{ crumb.label }}</span>
      <i v-if="i < items.length - 1" class="material-icons" style="font-size:14px">chevron_right</i>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumbs',
  props: {
    items: { type: Array, required: true }
  }
}
</script>
