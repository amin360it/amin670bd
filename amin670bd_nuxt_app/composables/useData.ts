import cv from '~/assets/data/cv.json'
import projects from '~/assets/data/projects.json'
import multimedia from '~/assets/data/multimedia.json'
import services from '~/assets/data/services.json'

const DATA = reactive({
  ...cv,
  ...multimedia,
  ...services,
  ...projects,
  projectsLoaded: true
})

export const useData = () => DATA
