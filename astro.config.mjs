// FILE: astro.config.mjs
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  output: 'server',
  // Domínio oficial do site (importante para gerar URLs absolutas no sitemap)
  site: 'https://rochabrindes.com',

  // Integrações do projeto
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),

    // Força a criação de /sitemap.xml ao invés de sitemap-index.xml
    sitemap({
      entryPoint: '/sitemap.xml'
    })
  ],

  // Geração totalmente estática para o Cloudflare Pages
  output: 'static',

  // Configurações do Vite
  vite: {
    resolve: {
      alias: {
        '@': '/src'
      }
    },

    // Importante: React Query precisa ser incluído no bundle SSR
    ssr: {
      noExternal: ['@tanstack/react-query']
    }
  }
})
