import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true, // para desarrollo
  },
  build: {
    outDir: 'dist',
  },
  preview: {
    port: 4173,
  }
})





