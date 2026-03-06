import { defineConfig } from 'astro/config'

export default defineConfig({
  base: process.env.ASTRO_BASE ?? '/',
  outDir: './dist',
})
