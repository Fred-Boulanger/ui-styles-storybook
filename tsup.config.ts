import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/main.js'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: [
    'storybook',
    "vite",
    'glob',
    'yaml',
    'node:fs',
    'node:fs/promises',
    'node:path'
  ],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client"'
    }
  }
})


