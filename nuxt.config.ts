// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss' , '@pinia/nuxt'],
   typescript: {
    strict: true,
   },
   runtimeConfig: {
    notionApiKey:      process.env.NOTION_API_KEY,
    notionQuestionDb:  process.env.NOTION_QUESTIONS_DB_ID,
  },
  app: {
    head: {
      title: 'MindCheck — Mental Wellness Assessment',
      meta: [
        { name: 'description', content: 'Assess your anxiety and depression levels and get a personalised 30-day routine.' },
        { name: 'viewport',    content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap',
        },
      ],
    },
  },
})
