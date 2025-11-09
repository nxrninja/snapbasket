import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'SnapBasket',
        short_name: 'SnapBasket',
        description: 'SnapBasket is a mobile-first shopping platform designed to simplify your daily grocery and essentials shopping experience.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone', // key to prevent it being a shortcut
        start_url: '/',        // makes it launch at the home page
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
          { src: '/pwa-apple-180x180.png', sizes: '180x180', type: 'image/png', purpose: 'any maskable' }, // for iOS
        ],
      },
    }),
  ],
  server: {
    port: 5175,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          vendor: [
            'axios',
            'jwt-decode',
            'react-hot-toast',
            'react-router-dom',
            'framer-motion',
            'react-icons',
            'react-feather',
            'lucide-react',
            'react-toastify',
            'styled-components',
          ],
        },
      },
    },
  },
})
