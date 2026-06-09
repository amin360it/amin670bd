export const useParticles = () => {
  let animId = null
  let particles = []
  let ctx = null
  let w = 0, h = 0
  let canvasRef = null

  const resize = () => {
    if (!canvasRef) return
    w = canvasRef.width = window.innerWidth
    h = canvasRef.height = window.innerHeight
  }

  const initParticles = (canvas) => {
    if (!canvas) return
    canvasRef = canvas
    ctx = canvas.getContext('2d')
    window.addEventListener('resize', resize)
    resize()
    const count = Math.min(120, Math.floor(w * h / 10000))
    particles = []
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 2 + 1,
        a: Math.random() * 0.5 + 0.15
      })
    }
    draw()
  }

  const draw = () => {
    animId = requestAnimationFrame(draw)
    ctx.clearRect(0, 0, w, h)
    const isDark = document.documentElement.classList.contains('dark')
    const color = isDark ? '20,184,166' : '20,184,166'
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${color},${p.a})`
      ctx.fill()
    })
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.strokeStyle = `rgba(${color},${0.12 * (1 - dist / 120)})`
          ctx.lineWidth = 0.6
          ctx.stroke()
        }
      }
    }
  }

  const destroyParticles = () => {
    if (animId) cancelAnimationFrame(animId)
    window.removeEventListener('resize', resize)
  }

  return { initParticles, destroyParticles }
}
