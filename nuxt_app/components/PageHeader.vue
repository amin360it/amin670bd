<template>
  <div class="mb-8">
    <span v-if="tag" class="section-tag">{{ tag }}</span>
    <h1 v-if="title" class="section-title">{{ title }}</h1>
    <p v-if="description" class="text-base leading-relaxed" style="color:var(--text);max-width:720px">{{ description }}</p>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    tag: { type: String, default: '' },
    title: { type: String, default: '' },
    description: { type: String, default: '' }
  }
}
</script>
