import { config } from '@amber/database/shared/config.ts'
import { env, safeConnectionString, parsePostgresConnectionString } from '@amber/environment'

import { createTRPCRouter, publicProcedure } from '../trpc'

type EnvRecord = Record<string, string | undefined>

export function filterVercelVars(input: EnvRecord): EnvRecord {
  const includedEnvName = /^(?:VERCEL.*|NODE_ENV)$/
  return Object.fromEntries(
    Object.entries(input)
      .filter(([name]) => includedEnvName.test(name))
      .filter(([, value]) => value !== undefined),
  )
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
      env: filterVercelVars(env),
    }
    return isAdmin ? { ...summary, url: safeConnectionString(userDatabase) } : { ...summary }
  }),
})
