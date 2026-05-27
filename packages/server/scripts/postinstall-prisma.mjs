import { spawnSync } from 'node:child_process'

if (process.env.SKIP_PRISMA_GENERATE === '1') {
  console.log('Skipping Prisma generate during postinstall because SKIP_PRISMA_GENERATE=1')
  process.exit(0)
}

const result = spawnSync('pnpm', ['prisma:generate'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    DB_ENV: process.env.DB_ENV ?? 'acnw',
  },
})

process.exit(result.status ?? 1)
