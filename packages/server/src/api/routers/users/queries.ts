import { buildUserOrderBy, buildUserWhere } from './query'
import type {
  GetAllUsersAndProfilesWithQueryInput,
  GetAllUsersByInput,
  GetUserByEmailInput,
  GetUserByIdInput,
} from './schemas'

import type { Prisma } from '../../../generated/prisma/client'
import type { TransactionClient } from '../../inRlsTransaction'

const userWithProfileInclude = {
  profile: true,
} satisfies Prisma.UserInclude

const userListOrderBy = {
  lastName: 'asc',
} satisfies Prisma.UserOrderByWithRelationInput

const attendingMembershipInclude = {
  membership: {
    where: { attending: true },
    select: {
      id: true,
      year: true,
    },
  },
} satisfies Prisma.UserInclude

export const getUserByEmail = ({ tx, input }: { tx: TransactionClient; input: GetUserByEmailInput }) =>
  tx.user.findUnique({
    where: { email: input.email },
    include: userWithProfileInclude,
  })

export const getUserAndProfile = ({ tx, input }: { tx: TransactionClient; input: GetUserByIdInput }) =>
  tx.user.findUnique({
    where: { id: input.id },
    include: userWithProfileInclude,
  })

export const getUser = ({ tx, input }: { tx: TransactionClient; input: GetUserByIdInput }) =>
  tx.user.findUnique({
    where: { id: input.id },
  })

export const getAllUsers = ({ tx }: { tx: TransactionClient }) =>
  tx.user.findMany({
    orderBy: userListOrderBy,
  })

export const getAllUsersAndProfiles = ({ tx }: { tx: TransactionClient }) =>
  tx.user.findMany({
    orderBy: userListOrderBy,
    include: userWithProfileInclude,
  })

export const getAllUsersAndProfilesWithQuery = async ({
  tx,
  input,
}: {
  tx: TransactionClient
  input?: GetAllUsersAndProfilesWithQueryInput
}) => {
  const orderBy = buildUserOrderBy(input?.sort)
  const where = buildUserWhere({
    columnFilters: input?.columnFilters,
    globalFilter: input?.globalFilter ?? undefined,
  })
  const pagination = input?.pagination
  const take = pagination?.pageSize
  const skip = pagination ? pagination.pageIndex * pagination.pageSize : undefined
  const whereClause = where as any

  const [rowCount, data] = await Promise.all([
    tx.user.count({ where: whereClause }),
    tx.user.findMany({
      include: userWithProfileInclude,
      orderBy,
      where: whereClause,
      skip,
      take,
    }),
  ])

  return {
    data,
    rowCount,
  }
}

export const getAllUsersBy = ({ tx, input }: { tx: TransactionClient; input: GetAllUsersByInput }) =>
  tx.user.findMany({
    where: {
      fullName: {
        contains: input.query,
        mode: 'insensitive',
      },
    },
    orderBy: userListOrderBy,
    include: attendingMembershipInclude,
  })
