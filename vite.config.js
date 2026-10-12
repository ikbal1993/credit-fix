
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base:"/credit-fix"
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})

