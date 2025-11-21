// FILE: astro.config.mjs
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap' // Importante para SEO

export default defineConfig({
  // 🚨 AQUI ESTÁ O SEGREDO: Isso diz ao Layout.astro que o .com é o oficial
  site: 'https://rochabrindes.com',

  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap() // Gera o mapa para o Google achar suas páginas
  ],

  output: 'static',
  
  vite: {
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    ssr: {
      noExternal: ['@tanstack/react-query']
    }
  }
})