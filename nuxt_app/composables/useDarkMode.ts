export const useDarkMode = () => {
  const darkMode = ref(true)

  const toggleDark = () => {
    darkMode.value = !darkMode.value
    document.documentElement.classList.toggle('dark', darkMode.value)
    localStorage.setItem('darkMode', darkMode.value)
  }

  const initDarkMode = () => {
    const saved = localStorage.getItem('darkMode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    darkMode.value = saved === 'true' || (saved === null && prefersDark)
    document.documentElement.classList.toggle('dark', darkMode.value)
  }

  return { darkMode, toggleDark, initDarkMode }
}
