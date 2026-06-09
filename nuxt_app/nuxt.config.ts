export default defineNuxtConfig({
  ssr: true,
  css: [
    '~/assets/css/material-icons.css',
    '~/assets/css/tailwind.css',
    '~/assets/css/style.css'
  ],
  app: {
    head: {
      htmlAttrs: { lang: 'en', class: 'dark' },
      title: 'Md. Asaduzzaman (Aminur) — IT & Digital Operations Specialist | Portfolio',
      meta: [
        { charset: 'UTF-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' },
        { name: 'color-scheme', content: 'dark light' },
        { name: 'description', content: 'IT professional since 2018 with 6.5+ years of hands-on employment across IT support, ERP systems (GPRO), web development (Vue, Laravel), and system integration. Based in Dhaka, Bangladesh.' },
        { name: 'keywords', content: 'IT Support Specialist Dhaka, ERP System Administrator, GPRO ERP, Web Developer Bangladesh, Vue.js Developer, Laravel Developer, Md. Asaduzzaman Aminur, IT Portfolio Bangladesh' },
        { name: 'author', content: 'Md. Asaduzzaman (Aminur)' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Md. Asaduzzaman (Aminur) — IT & Digital Operations Specialist' },
        { property: 'og:description', content: 'IT professional since 2018 with 6.5+ years of hands-on employment across IT support, ERP systems, web development, and system integration.' },
        { property: 'og:image', content: 'https://avatars.githubusercontent.com/u/214401422?v=4' },
        { property: 'og:image:width', content: '460' },
        { property: 'og:image:height', content: '460' },
        { property: 'og:url', content: 'https://amin670bd.github.io' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:site_name', content: 'Amin670BD Portfolio' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: 'Md. Asaduzzaman (Aminur) — IT & Digital Operations Specialist' },
        { name: 'twitter:description', content: 'IT professional since 2018 with 6.5+ years of hands-on employment across IT support, ERP, web dev, and system integration.' },
        { name: 'twitter:image', content: 'https://avatars.githubusercontent.com/u/214401422?v=4' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'canonical', href: 'https://amin670bd.github.io/' },
        { rel: 'preload', href: '/fonts/outfit-latin.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
        { rel: 'preload', href: '/fonts/outfit-latin-ext.woff2', as: 'font', type: 'font/woff2', crossorigin: '' }
      ],
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Md. Asaduzzaman",
            "alternateName": "Aminur",
            "url": "https://amin670bd.github.io",
            "email": "amin670bd@gmail.com",
            "telephone": "+880 1979 670601",
            "jobTitle": "IT & Digital Operations Specialist",
            "knowsAbout": ["IT Support","ERP Systems","Web Development","System Integration","Vue.js","Laravel","WordPress"],
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Savar, Dhaka",
              "addressCountry": "BD"
            },
            "sameAs": [
              "https://linkedin.com/in/aminur670bd",
              "https://github.com/amin360it"
            ]
          })
        }
      ]
    }
  },
  compatibilityDate: '2024-11-01'
})
