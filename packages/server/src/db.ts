import fs from 'fs'
import path from 'path'

import { env, isDev } from '@amber/environment'
import { certs } from 'database/shared/dbCerts'

// eslint-disable-next-line import/no-relative-packages
import { PrismaClient } from './generated/prisma/client'

const filename = '/tmp/rds-cert.pem'

const createPrismaClient = (type: 'ADMIN' | 'USER') => {
  if (env.DATABASE_SSL_CERT) {
    const certName = path.basename(env.DATABASE_SSL_CERT ?? '', '.pem')
    // eslint-disable-next-line no-prototype-builtins
    if (!certs.hasOwnProperty(certName)) {
      throw new Error(`SSL was enabled, but the named cert, '${certName}' is not installed.`)
    }
    fs.writeFileSync(filename, certs[certName]!)
  }
  return new PrismaClient({
    log: isDev ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: { url: type === 'ADMIN' ? env.ADMIN_DATABASE_URL : env.DATABASE_URL },
    },
  })
}

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
