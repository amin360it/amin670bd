<template>
  <nav class="hidden lg:flex items-center gap-1">
    <template v-for="(item,i) in items" :key="i">
      <Dropdown v-if="item.children" :items="item.children" :trigger-text="item.label" :trigger-variant="dropdownVariant" :hover="true" position="left" />
      <NuxtLink v-else :to="item.to" class="px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200"
        :class="{ 'gradient-bg text-white': isActive(item.to) }"
        :style="{ color: isActive(item.to) ? 'white' : 'var(--text)', background: isActive(item.to) ? '' : 'transparent' }">
        <i v-if="item.icon" class="material-icons align-middle mr-1.5" style="font-size:16px">{{ item.icon }}</i>
        {{ item.label }}
      </NuxtLink>
    </template>
  </nav>
</template>

<script>
export default {
  name: 'AppNav',
  props: {
    items: { type: Array, required: true },
    dropdownVariant: { type: String, default: 'ghost' }
  },
  methods: {
    isActive(to) {
      if (!to) return false
      return this.$route.path === to || this.$route.path.startsWith(to + '/')
    }
  }
}
</script>
