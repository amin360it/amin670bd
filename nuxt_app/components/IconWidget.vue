<template>
  <div class="card-glass--glass flex items-start gap-3 p-4 rounded-xl" :style="{ display: 'flex', textDecoration: 'none', ...customStyle }">
    <div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 gradient-bg" v-if="icon">
      <i class="material-icons text-white" style="font-size:20px">{{ icon }}</i>
    </div>
    <div>
      <h4 v-if="title" class="font-semibold text-sm" :style="{ color: titleColor || 'var(--text-heading)' }">{{ title }}</h4>
      <p v-if="text" class="text-xs mt-0.5" style="color:var(--text)">{{ text }}</p>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'IconWidget',
  props: {
    icon: { type: String, default: '' },
    title: { type: String, default: '' },
    text: { type: String, default: '' },
    titleColor: { type: String, default: '' },
    customStyle: { type: Object, default: () => ({}) }
  }
}
</script>
