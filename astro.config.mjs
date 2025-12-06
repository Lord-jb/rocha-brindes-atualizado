// FILE: astro.config.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import solidJs from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    }
  }),

  site: 'https://rochabrindes.com',

  integrations: [
    solidJs(),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap()
  ],

  vite: {
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    ssr: {
      noExternal: ['@tanstack/solid-query']
    },
    build: {
      // Otimizações para mobile
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          passes: 2
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['solid-js'],
            'query': ['@tanstack/solid-query'],
          }
        }
      }
    }
  },

  // Otimizações de build
  build: {
    inlineStylesheets: 'auto',
  }
});
