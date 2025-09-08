import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, './src'),
    },
  },
  define: {
    'import.meta.env.VITE_ENCRYPTION_KEY': JSON.stringify('8bff1e8c44575fc6ffe496cbb1e9d96b224e35e21e52e3a4aa5b6e0a4c2ad7a0')
  }
})
