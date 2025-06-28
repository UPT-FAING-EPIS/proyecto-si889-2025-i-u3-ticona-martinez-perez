// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    // Asegurar que las variables de entorno estén disponibles
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL)
  },
  server: {
    port: 3000,
    host: true
  },
  preview: {
    port: 4173,
    host: true
  }
})