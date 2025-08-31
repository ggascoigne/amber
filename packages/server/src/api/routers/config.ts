import { config } from '@amber/database/shared/config.ts'
import { env, safeConnectionString, parsePostgresConnectionString } from '@amber/environment'

import { createTRPCRouter, publicProcedure } from '../trpc'

export const configRouter = createTRPCRouter({
  getConfig: publicProcedure.query(async ({ ctx }) => {
    const connectionString = safeConnectionString(config.userDatabase)
    const dbDetails = parsePostgresConnectionString(connectionString)
    const { isAdmin } = ctx
    const { userDatabase } = config
    const summary = {
      local: !userDatabase.includes('aws'),
      databaseName: dbDetails.database,
      nodeVersion: process.version,
      authDomain: env.AUTH_DOMAIN,
    }
    return isAdmin ? { ...summary, url: safeConnectionString(userDatabase) } : { ...summary }
  }),
})
