import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
<<<<<<< Updated upstream
  plugins: [react()],
=======
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 3000
  }
>>>>>>> Stashed changes
})
