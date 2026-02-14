import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { createAppConfig } from '@amber/playwright/config'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const workspaceRoot = path.resolve(currentDir, '../..')
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:30001'

export default createAppConfig({
  baseURL,
  devServerCommand: 'PLAYWRIGHT=1 pnpm -F acus dev:test',
  testDir: './playwright',
  workspaceRoot,
})
