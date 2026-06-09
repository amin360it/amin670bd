<template>
  <button @click="toggleDark" aria-label="Toggle dark mode" class="theme-toggle flex items-center justify-center">
    <i class="material-icons" style="font-size:20px">{{ darkMode ? 'light_mode' : 'dark_mode' }}</i>
  </button>
</template>

<script>
export default {
  name: 'ThemeToggle',
  inject: ['toggleDark'],
  data() {
    return {
      darkMode: true
    }
  },
  mounted() {
    const saved = localStorage.getItem('darkMode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    this.darkMode = saved === 'true' || (saved === null && prefersDark)
  }
}
</script>
