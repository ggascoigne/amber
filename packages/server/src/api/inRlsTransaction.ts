import debug from 'debug'

import type { Context } from './context'

// eslint-disable-next-line import/no-relative-packages
import type { Prisma } from '../generated/prisma/client'

export type TransactionClient = Prisma.TransactionClient

const log = debug('amber:server:rls')

// One day Prisma might have RLS support, but today is not that day, there are a ton of awkward workarounds
// on the Prisma issue list, but for now this seems to be the simplest.
// see https://github.com/prisma/prisma/issues/12735

export const inRlsTransaction = async <T>(ctx: Context, fn: (tx: TransactionClient) => T | Promise<T>) =>
  ctx.db.$transaction(async (tx: TransactionClient) => {
    if (ctx.userId) {
      await tx.$executeRawUnsafe(`SET LOCAL "user.id" = '${ctx.userId}'`)
      await tx.$executeRawUnsafe(`SET LOCAL "user.admin" = '${ctx.isAdmin ? 'true' : 'false'}'`)
      // console.log(`prisma: userId(${ctx.userId}) is ${ctx.isAdmin ? 'admin' : 'not-admin'}`)
      log('prisma2: user.admin after SET LOCAL', await tx.$queryRawUnsafe(`SHOW "user.admin"`))
      log('prisma2:current_user_is_admin', await tx.$queryRawUnsafe('select current_user_is_admin()'))
    }
    return fn(tx)
  })
