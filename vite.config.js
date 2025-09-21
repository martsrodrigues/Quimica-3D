import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,    // escolhe uma porta fixa que raramente será usada
    strictPort: true  // se a porta estiver ocupada, o Vite falha em vez de mudar
  }
});
