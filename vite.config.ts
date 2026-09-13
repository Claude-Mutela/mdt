import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import adonisjs from '@adonisjs/vite/client'
import inertia from '@adonisjs/inertia/vite'

export default defineConfig({
  plugins: [
    adonisjs({
      entrypoints: ['inertia/app.tsx'],
      reload: ['resources/views/**/*.edge'],
    }),
    inertia({
      ssr: {
        enabled: false,
      },
    }),
    react(),
  ],

  /**
   * Define aliases for importing modules from
   * your frontend code
   */
  resolve: {
    alias: {
      '~/': `${import.meta.dirname}/inertia/`,
      '@generated': `${import.meta.dirname}/.adonisjs/client/`,
    },
  },

  build: {
    target: 'esnext',
    cssMinify: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React + Inertia dans le même chunk — Inertia dépend de React,
          // les séparer cause un race condition (createContext undefined)
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/@inertiajs/')
          ) {
            return 'vendor-framework'
          }
          // Icônes lucide (tree-shakeable mais souvent large)
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons'
          }
          // Reste node_modules → vendor générique
          if (id.includes('node_modules/')) {
            return 'vendor-misc'
          }
        },
      },
    },
  },

  server: {
    watch: {
      ignored: ['**/storage/**', '**/tmp/**'],
    },
  },
})
