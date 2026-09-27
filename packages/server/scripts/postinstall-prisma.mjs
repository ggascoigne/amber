import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'

if (process.env.SKIP_PRISMA_GENERATE === '1') {
  console.log('Skipping Prisma generate during postinstall because SKIP_PRISMA_GENERATE=1')
  process.exit(0)
}

const dbEnv = process.env.DB_ENV ?? 'acnw'
const envFile = `../../apps/${dbEnv}/.env`

const hasEnvFile = existsSync(envFile)

const cmd = hasEnvFile
  ? [
      'dotenv',
      'run',
      '-f',
      envFile,
      '--',
      'pnpm',
      'exec',
      'prisma',
      'generate',
      '--no-hints',
      '--schema',
      './prisma/schema.prisma',
      '--sql',
    ]
  : ['pnpm', 'exec', 'prisma', 'generate', '--no-hints', '--schema', './prisma/schema.prisma', '--sql']

const result = spawnSync(cmd[0], cmd.slice(1), {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    DB_ENV: process.env.DB_ENV ?? 'acnw',
  },
})

process.exit(result.status ?? 1)
