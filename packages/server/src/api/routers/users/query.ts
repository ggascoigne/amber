import type { UserColumnFilter, UserGlobalFilter, UserSortInput } from './schemas'

type SortOrder = 'asc' | 'desc'
export type UserOrderBy = Record<string, SortOrder>
export type UserWhereClause = Record<string, unknown>

const defaultUserOrderBy: Array<UserOrderBy> = [{ lastName: 'asc' }, { firstName: 'asc' }]

const sortableUserFieldIds = ['fullName', 'firstName', 'lastName', 'displayName', 'email', 'balance'] as const
type SortableUserFieldId = (typeof sortableUserFieldIds)[number]

const stringColumnFilterFieldIds = ['fullName', 'firstName', 'lastName', 'displayName', 'email'] as const
type StringColumnFilterFieldId = (typeof stringColumnFilterFieldIds)[number]

const profileColumnFilterFieldById = {
  phoneNumber: 'phoneNumber',
  snailMailAddress: 'snailMailAddress',
} as const

type ProfileColumnFilterFieldId = keyof typeof profileColumnFilterFieldById

const isSortableUserFieldId = (value: string): value is SortableUserFieldId =>
  sortableUserFieldIds.some((fieldId) => fieldId === value)

const isStringColumnFilterFieldId = (value: string): value is StringColumnFilterFieldId =>
  stringColumnFilterFieldIds.some((fieldId) => fieldId === value)

const hasOwn = <Target extends object>(target: Target, key: PropertyKey): key is keyof Target =>
  Object.prototype.hasOwnProperty.call(target, key)

const buildContainsClause = (fieldName: string, value: string): UserWhereClause => ({
  [fieldName]: {
    contains: value,
    mode: 'insensitive',
  },
})

const buildProfileContainsClause = (fieldName: ProfileColumnFilterFieldId, value: string): UserWhereClause => ({
  profile: {
    some: buildContainsClause(fieldName, value),
  },
})

const getSortOrder = (desc?: boolean): SortOrder => (desc ? 'desc' : 'asc')

export const normaliseFilterValue = (value: UserGlobalFilter): string | undefined => {
  if (value === null || value === undefined) {
    return undefined
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed.length ? trimmed : undefined
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  return undefined
}

export const buildUserOrderBy = (sorting?: UserSortInput): Array<UserOrderBy> => {
  const orderBy =
    sorting?.flatMap((sort) => (isSortableUserFieldId(sort.id) ? [{ [sort.id]: getSortOrder(sort.desc) }] : [])) ?? []

  return orderBy.length ? orderBy : defaultUserOrderBy
}

export const buildColumnFilter = (filter: UserColumnFilter): UserWhereClause | null => {
  const { id, value } = filter

  if (value === undefined || value === null) {
    return null
  }

  if (id === 'balance') {
    const numeric = typeof value === 'number' ? value : Number(value)
    return Number.isNaN(numeric) ? null : { balance: numeric }
  }

  const stringValue = normaliseFilterValue(value)
  if (!stringValue) {
    return null
  }

  if (isStringColumnFilterFieldId(id)) {
    return buildContainsClause(id, stringValue)
  }

  if (hasOwn(profileColumnFilterFieldById, id)) {
    return buildProfileContainsClause(profileColumnFilterFieldById[id], stringValue)
  }

  return null
}

const buildGlobalUserSearch = (value: string): Array<UserWhereClause> => [
  ...stringColumnFilterFieldIds.map((fieldId) => buildContainsClause(fieldId, value)),
  {
    profile: {
      some: {
        OR: Object.values(profileColumnFilterFieldById).map((fieldId) => buildContainsClause(fieldId, value)),
      },
    },
  },
]

export const buildUserWhere = ({
  columnFilters,
  globalFilter,
}: {
  columnFilters?: Array<UserColumnFilter>
  globalFilter?: UserGlobalFilter
}): UserWhereClause | undefined => {
  const andFilters =
    columnFilters?.map(buildColumnFilter).filter((filter): filter is UserWhereClause => filter !== null) ?? []
  const globalValue = normaliseFilterValue(globalFilter)
  const globalSearch = globalValue ? buildGlobalUserSearch(globalValue) : undefined

  if (!andFilters.length && !globalSearch) {
    return undefined
  }

  return {
    ...(globalSearch ? { OR: globalSearch } : {}),
    ...(andFilters.length ? { AND: andFilters } : {}),
  }
}
