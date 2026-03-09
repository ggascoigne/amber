import { env, safeConnectionString, parsePostgresConnectionString, isProd } from '@amber/environment'

import { config } from '../../../shared/config'
import { createTRPCRouter, publicProcedure } from '../trpc'

type EnvRecord = Record<string, any | undefined>

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
    const databaseVersionResult = isAdmin
      ? await ctx.db.$queryRaw<Array<{ version: string }>>`select version();`
      : undefined
    const databaseVersion = databaseVersionResult?.[0]?.version.match(/^PostgreSQL\s+\S+/)?.[0] ?? undefined
    const { userDatabase } = config

    return filterUndefinedVars({
      local: !userDatabase.includes('aws'),
      isTestDb: dbDetails.database.includes('test'),
      isFakeAuth: env.USE_FAKE_AUTH === 'true',
      databaseName: dbDetails.database,
      databaseVersion,
      nodeVersion: process.version,
      appBaseUrl: env.APP_BASE_URL,
      url: isAdmin ? safeConnectionString(userDatabase) : undefined,
      env: isProd ? filterVercelVars(env) : filterUndefinedVars(env),
    })
  }),
})
