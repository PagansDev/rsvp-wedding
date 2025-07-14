import tailwindcss from "@tailwindcss/vite";


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/icon', '@nuxt/fonts'],
  css: ['~/assets/styles/main.css'],

  app: {
    head: {
      title: 'Convite - Paulo e Isa',
      meta: [
        { name: 'description', content: 'Convite - Paulo e Isa' }
        
      ]
    }
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  
  devServer: {
    host: '0.0.0.0',
    port: 3000
  }
  
  

})