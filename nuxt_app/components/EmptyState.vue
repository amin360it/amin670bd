<template>
  <div class="text-center py-12 px-4">
    <i class="material-icons" style="font-size:48px;color:var(--text-muted);opacity:0.4;display:block;margin-bottom:12px">{{ icon }}</i>
    <h3 v-if="title" class="text-lg font-semibold" style="color:var(--text-heading)">{{ title }}</h3>
    <p v-if="description" class="text-sm mt-1" style="color:var(--text-muted)">{{ description }}</p>
    <div v-if="$slots.action" class="mt-4">
      <slot name="action" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    icon: { type: String, default: 'inbox' },
    title: { type: String, default: '' },
    description: { type: String, default: '' }
  }
}
</script>
