import { z } from 'zod'

import { inRlsTransaction } from '../inRlsTransaction'
import { createTRPCRouter, protectedProcedure } from '../trpc'

const generalQueryOptionsSchema = z.object({
  sort: z
    .array(
      z.object({
        id: z.string(),
        desc: z.boolean().optional(),
      }),
    )
    .optional(),
  columnFilters: z
    .array(
      z.object({
        id: z.string(),
        value: z.union([z.string(), z.number(), z.boolean()]).optional(),
      }),
    )
    .optional(),
  globalFilter: z.union([z.string(), z.number(), z.boolean()]).optional().nullable(),
  pagination: z
    .object({
      pageIndex: z.number().int().min(0),
      pageSize: z.number().int().min(1),
    })
    .optional(),
})

type GeneralQueryOptions = z.infer<typeof generalQueryOptionsSchema>

type SortOrder = 'asc' | 'desc'
type UserOrderBy = Record<string, SortOrder>
type UserWhereClause = Record<string, unknown>

const buildUserOrderBy = (sorting?: GeneralQueryOptions['sort']): UserOrderBy[] => {
  if (!sorting?.length) {
    return [{ lastName: 'asc' }, { firstName: 'asc' }]
  }

  const orderBy: UserOrderBy[] = []

  for (const sort of sorting) {
    const direction: SortOrder = sort.desc ? 'desc' : 'asc'
    switch (sort.id) {
      case 'fullName':
      case 'firstName':
      case 'lastName':
      case 'displayName':
      case 'email':
      case 'balance':
        orderBy.push({ [sort.id]: direction })
        break
      default:
        // Unsupported sort fields (e.g. relation columns) fall back to default ordering
        break
    }
  }

  if (!orderBy.length) {
    orderBy.push({ lastName: 'asc' }, { firstName: 'asc' })
  }

  return orderBy
}

const normaliseFilterValue = (value: GeneralQueryOptions['globalFilter']) => {
  if (value === null || value === undefined) return undefined
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed.length ? trimmed : undefined
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  return undefined
}

const buildColumnFilter = (
  filter: NonNullable<GeneralQueryOptions['columnFilters']>[number],
): UserWhereClause | null => {
  const { id, value } = filter

  if (value === undefined || value === null) {
    return null
  }

  switch (id) {
    case 'balance': {
      const numeric = typeof value === 'number' ? value : Number(value)
      if (Number.isNaN(numeric)) return null
      return { balance: numeric }
    }
    case 'fullName':
    case 'firstName':
    case 'lastName':
    case 'displayName':
    case 'email': {
      const stringValue = normaliseFilterValue(value)
      if (!stringValue) return null
      return { [id]: { contains: stringValue, mode: 'insensitive' } }
    }
    case 'snailMailAddress':
    case 'phoneNumber': {
      const stringValue = normaliseFilterValue(value)
      if (!stringValue) return null
      const relationField = id === 'snailMailAddress' ? 'snailMailAddress' : 'phoneNumber'
      return {
        profile: {
          some: {
            [relationField]: { contains: stringValue, mode: 'insensitive' },
          },
        },
      }
    }
    default:
      return null
  }
}

const buildUserWhere = ({
  columnFilters,
  globalFilter,
}: Pick<GeneralQueryOptions, 'columnFilters' | 'globalFilter'>): UserWhereClause | undefined => {
  const where: UserWhereClause = {}
  const andFilters: UserWhereClause[] = []

  if (columnFilters?.length) {
    for (const filter of columnFilters) {
      const filterClause = buildColumnFilter(filter)
      if (filterClause) {
        andFilters.push(filterClause)
      }
    }
  }

  const globalValue = normaliseFilterValue(globalFilter ?? undefined)
  if (globalValue) {
    where.OR = [
      { fullName: { contains: globalValue, mode: 'insensitive' } },
      { firstName: { contains: globalValue, mode: 'insensitive' } },
      { lastName: { contains: globalValue, mode: 'insensitive' } },
      { displayName: { contains: globalValue, mode: 'insensitive' } },
      { email: { contains: globalValue, mode: 'insensitive' } },
      {
        profile: {
          some: {
            OR: [
              {
                snailMailAddress: {
                  contains: globalValue,
                  mode: 'insensitive',
                },
              },
              { phoneNumber: { contains: globalValue, mode: 'insensitive' } },
            ],
          },
        },
      },
    ]
  }

  if (andFilters.length) {
    where.AND = andFilters
  }

  if (!where.OR && !where.AND) {
    return undefined
  }

  return where
}

export const usersRouter = createTRPCRouter({
  // TODO: rename tp getUserAndProfileByEmail
  getUserByEmail: protectedProcedure
    .input(
      z.object({
        email: z.email(),
      }),
    )
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) =>
        tx.user.findUnique({
          where: { email: input.email },
          include: {
            profile: true,
          },
        }),
      ),
    ),

  getUserAndProfile: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) =>
        tx.user.findUnique({
          where: { id: input.id },
          include: {
            profile: true,
          },
        }),
      ),
    ),

  getUser: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) =>
        tx.user.findUnique({
          where: { id: input.id },
        }),
      ),
    ),

  getAllUsers: protectedProcedure.query(async ({ ctx }) =>
    inRlsTransaction(ctx, async (tx) =>
      tx.user.findMany({
        orderBy: { lastName: 'asc' },
      }),
    ),
  ),

  getAllUsersAndProfiles: protectedProcedure.query(async ({ ctx }) =>
    inRlsTransaction(ctx, async (tx) =>
      tx.user.findMany({
        orderBy: { lastName: 'asc' },
        include: {
          profile: true,
        },
      }),
    ),
  ),

  getAllUsersAndProfiles2: protectedProcedure
    .input(generalQueryOptionsSchema.optional())
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
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
            include: {
              profile: true,
            },
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
      }),
    ),

  getAllUsersBy: protectedProcedure
    .input(
      z.object({
        query: z.string(),
      }),
    )
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) =>
        tx.user.findMany({
          where: {
            fullName: {
              contains: input.query,
              mode: 'insensitive',
            },
          },
          orderBy: { lastName: 'asc' },
          include: {
            membership: {
              where: { attending: true },
              select: {
                id: true,
                year: true,
              },
            },
          },
        }),
      ),
    ),

  updateUser: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          email: z.email().optional(),
          fullName: z.string().optional(),
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          displayName: z.string().optional(),
          balance: z.number().optional(),
        }),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const updatedUser = await tx.user.update({
          where: { id: input.id },
          data: input.data,
        })
        return { user: updatedUser }
      }),
    ),

  createProfile: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        phoneNumber: z.string(),
        snailMailAddress: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const profile = await tx.profile.create({
          data: {
            userId: input.userId,
            phoneNumber: input.phoneNumber,
            snailMailAddress: input.snailMailAddress,
          },
        })
        return { profile }
      }),
    ),

  updateProfile: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: z.object({
          phoneNumber: z.string().optional(),
          snailMailAddress: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => {
        const updatedProfile = await tx.profile.update({
          where: { id: input.id },
          data: input.data,
        })
        return { profile: updatedProfile }
      }),
    ),
})
