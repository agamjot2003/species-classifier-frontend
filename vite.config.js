import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Any request your React app makes to /preprocess
      // gets forwarded to the backend on port 8000.
      // This means in development you don't need to type
      // the full http://localhost:8000 URL everywhere.
      '/preprocess': 'http://localhost:8000',
      '/health':     'http://localhost:8000',
    },
  },
})