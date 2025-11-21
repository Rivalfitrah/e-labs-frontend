// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ['~/assets/css/main.css',],
  ssr: false,
  app: {
    head: {
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect', 
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap'
        }
      ]
    }
  },
  runtimeConfig: {
    public: {
      NUXT_PUBLIC_API_URL: process.env.NUXT_PUBLIC_API_URL,
      NUXT_PUBLIC_STORAGE_URL: process.env.NUXT_PUBLIC_STORAGE_URL,
    }
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  devServer: {
    port: 5137, // ganti aja sesuai keinginan (misal 4000, 8080, 5174, dll)
    host: 'localhost',
  }
});
