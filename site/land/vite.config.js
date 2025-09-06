import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',     // 👈 Build gerada dentro de 'land/dist'
  }
})