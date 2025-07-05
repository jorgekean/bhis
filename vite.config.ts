import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa' // Import the plugin
import basicSsl from '@vitejs/plugin-basic-ssl' // 1. Import the SSL plugin

export default defineConfig({
  plugins: [react(),
  tailwind(),
  VitePWA({
    registerType: 'autoUpdate',
    // Caching strategies
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg}']
    },
    // The manifest for the PWA
    manifest: {
      name: 'Barangay Health Information System',
      short_name: 'BHIS',
      description: 'A health records management app for barangay health workers.',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: 'logo_bhis.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'logo_bhis.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'logo_bhis.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        }
      ]
    }
  }),
  basicSsl() // 2. Add the plugin to the array
  ],

})
