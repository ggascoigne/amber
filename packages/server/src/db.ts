import fs from 'fs'
import os from 'os'
import path from 'path'

import { processEnv, isDev } from '@amber/environment/dotenv'
import { PrismaPg } from '@prisma/adapter-pg'
import Debug from 'debug'

import { PrismaClient } from './generated/prisma/client'

import { certs } from '../shared/dbCerts'

const env = processEnv()

const filename = path.join(os.tmpdir(), 'rds-cert.pem')

const dbLog = Debug('amber:db')
const dbQuery = dbLog.extend('query')
const dbInfo = dbLog.extend('info')
const dbWarn = dbLog.extend('warn')
const dbError = dbLog.extend('error')

// Route warn/error through console while honoring DEBUG filtering
// This keeps warnings/errors visible in common setups
// (debug still controls whether they emit at all)
dbWarn.log = console.warn.bind(console)
dbError.log = console.error.bind(console)
// Force error logger to always emit while keeping debug's formatting
dbError.enabled = true

function redactParams(params: string) {
  try {
    const parsed = JSON.parse(params)
    const redacted = JSON.stringify(parsed, (_k, v) => {
      if (typeof v === 'string' && v.length > 120) return `${v.slice(0, 120)}…`
      return v
    })
    return redacted
  } catch {
    return params.length > 200 ? `${params.slice(0, 200)}…` : params
  }
}

const attachLogging = (client: any, kind: 'ADMIN' | 'USER') => {
  // Forward Prisma engine logs to debug namespaces
  client.$on('query', (e: any) => {
    // Be conservative with params to avoid leaking secrets
    dbQuery('[%s] %s (%d ms) params=%s', kind, e.query, e.duration, redactParams(e.params))
  })
  client.$on('info', (e: any) => {
    dbInfo('[%s] %s', kind, e.message)
  })
  client.$on('warn', (e: any) => {
    dbWarn('[%s] %s', kind, e.message)
  })
  client.$on('error', (e: any) => {
    dbError('[%s] %s', kind, e.message)
  })

  // Note: Prisma middleware ($use) not used due to version/runtime constraints.
}
// DATABASE_SSL_CERT=../shared/rds-combined-ca-bundle.pem or is unset at this point
const createPrismaClient = (type: 'ADMIN' | 'USER') => {
  if (env.DATABASE_SSL_CERT) {
    const certName = path.basename(env.DATABASE_SSL_CERT ?? '', '.pem')
    if (!Object.prototype.hasOwnProperty.call(certs, certName)) {
      throw new Error(`SSL was enabled, but the named cert, '${certName}' is not installed.`)
    }
    fs.writeFileSync(filename, certs[certName]!)
  }
  const connectionString = type === 'ADMIN' ? env.ADMIN_DATABASE_URL : env.DATABASE_URL
  const adapter = new PrismaPg({ connectionString })
  const client = new PrismaClient({
    // Emit logs as events so we can route them through debug
    log: isDev
      ? [
          { level: 'query', emit: 'event' },
          { level: 'warn', emit: 'event' },
          { level: 'error', emit: 'event' },
          // Uncomment to include engine 'info' in dev if useful
          { level: 'info', emit: 'event' },
        ]
      : [
          { level: 'error', emit: 'event' },
          { level: 'warn', emit: 'event' },
        ],
    adapter,
  })

  attachLogging(client, type)
  return client
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
