import type { RouterConfig } from '@nuxt/schema'

export default {
  scrollBehavior(to, from, savedPosition) {
    if (to.path === '/projects') {
      const savedY = sessionStorage.getItem('projectsScrollY')
      if (savedY) {
        sessionStorage.removeItem('projectsScrollY')
        return { top: parseInt(savedY), behavior: 'smooth' }
      }
    }
    return { top: 0, behavior: 'smooth' }
  }
} satisfies RouterConfig
