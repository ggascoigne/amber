// import path from 'path'

// eslint-disable-next-line import/no-extraneous-dependencies
import react from '@vitejs/plugin-react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    // alias: {
    //   '@': path.resolve(__dirname, './'),
    // },
  },
})
