import { env, safeConnectionString, parsePostgresConnectionString, isProd } from '@amber/environment'

import { config } from '../../../shared/config'
import { createTRPCRouter, publicProcedure } from '../trpc'

type EnvRecord = Record<string, string | undefined>

function filterVercelVars(input: EnvRecord): EnvRecord {
  const includedEnvName = /^(?:VERCEL.*|NODE_ENV)$/
  return Object.fromEntries(
    Object.entries(input)
      .filter(([name]) => includedEnvName.test(name))
      .filter(([, value]) => value !== undefined),
  )
}

function filterUndefinedVars(input: EnvRecord): EnvRecord {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined))
}

export const configRouter = createTRPCRouter({
  getConfig: publicProcedure.query(async ({ ctx }) => {
    const connectionString = safeConnectionString(config.userDatabase)
    const dbDetails = parsePostgresConnectionString(connectionString)
    const { isAdmin } = ctx
    const { userDatabase } = config
    const isLocal = !userDatabase.includes('aws')
    const summary = {
      local: isLocal,
      databaseName: dbDetails.database,
      nodeVersion: process.version,
      appBaseUrl: env.APP_BASE_URL,
      env: isProd ? filterVercelVars(env) : filterUndefinedVars(env),
    }
    return isAdmin ? { ...summary, url: safeConnectionString(userDatabase) } : { ...summary }
  }),
})
