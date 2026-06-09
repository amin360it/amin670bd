<template>
  <div class="flex flex-wrap items-center gap-2" :class="[align, size]">
    <a v-for="(s,i) in socials" :key="i" :href="s.href" target="_blank" class="theme-toggle flex items-center justify-center"
      :title="s.label" :style="{ width: btnSize, height: btnSize }">
      <svg v-if="s.svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path :d="s.svg" />
      </svg>
      <i v-else-if="s.icon" class="material-icons" style="font-size:20px">{{ s.icon }}</i>
    </a>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'SocialIconBar',
  props: {
    socials: { type: Array, default: () => [] },
    align: { type: String, default: '' },
    size: { type: String, default: '' }
  },
  computed: {
    btnSize() { return this.size === 'sm' ? '32px' : '36px' }
  }
}
</script>
