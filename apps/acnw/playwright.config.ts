import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { createAppConfig } from '../../playwright/config'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const workspaceRoot = path.resolve(currentDir, '../..')
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:30000'

export default createAppConfig({
  baseURL,
  devServerCommand: 'pnpm -F acnw dev:test',
  testDir: './playwright',
  workspaceRoot,
})
