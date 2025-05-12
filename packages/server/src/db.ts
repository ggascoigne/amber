import { env, isDev } from '@amber/environment'

// eslint-disable-next-line import/no-relative-packages
import { PrismaClient } from './generated/prisma/client'

const createPrismaClient = (type: 'ADMIN' | 'USER') =>
  new PrismaClient({
    log: isDev ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: { url: type === 'ADMIN' ? env.ADMIN_DATABASE_URL : env.DATABASE_URL },
    },
  })

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
  prismaAdmin: ReturnType<typeof createPrismaClient> | undefined
}

export const db = globalForPrisma.prisma ?? createPrismaClient('USER')
export const dbAdmin = globalForPrisma.prismaAdmin ?? createPrismaClient('ADMIN')

if (isDev) globalForPrisma.prisma = db
if (isDev) globalForPrisma.prismaAdmin = dbAdmin

// db.$use(async (params, next) => {
//   const result = await next(params)
//   console.log(`Prisma: ${params.model}.${params.action}`, result)
//   return result
// })
