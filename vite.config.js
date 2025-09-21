import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuração para Netlify/GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/', // em Netlify pode ser '/', em GitHub Pages teria de ser './'
})


