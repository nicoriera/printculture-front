// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    minify: 'terser', // or 'esbuild'
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
