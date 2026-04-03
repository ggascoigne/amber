import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,tsup,build}.config.*',
      '**/playwright/**', // Exclude Playwright tests
    ],
    // alias: {
    //   '@': path.resolve(__dirname, './'),
    // },
  },
})
