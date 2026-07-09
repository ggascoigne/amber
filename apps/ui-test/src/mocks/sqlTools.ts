import debug from 'debug'

const log = debug('memory-data')

export type TableRow = Record<string, unknown> & {
  id: number
}

type NewTableRow<TData extends TableRow> = Omit<TData, 'id'> & Partial<Pick<TData, 'id'>>

export type SortOption = {
  id: string
  desc: boolean
}

export type FilterOptions = {
  id: string
  value?: unknown
  operator?: string
}

type FetchDataOptions =
  | {
      pageIndex: number
      pageSize: number
      sorting: Array<SortOption>
      globalFilter: string
      filters?: Array<FilterOptions>
    }
  | {
      pageIndex?: undefined
      pageSize?: undefined
      sorting?: undefined
      globalFilter?: undefined
      filters?: undefined
    }

type SchemaOptions<TData extends TableRow> = {
  tableName: string
  getAdditionalFields?: (row: TData) => Partial<TData>
  globalFilterFields?: Array<keyof TData & string>
}

type RangeFilterValue = {
  start?: unknown
  end?: unknown
}

const tables = new Map<string, Array<TableRow>>()

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isRangeFilterValue = (value: unknown): value is RangeFilterValue =>
  isRecord(value) && ('start' in value || 'end' in value)

const getRowId = (row: Partial<TableRow>, index: number) => {
  const { id } = row
  return typeof id === 'number' && Number.isFinite(id) ? id : index + 1
}

export const createTableFor = <TData extends TableRow>(options: {
  tableName: string
  data: Array<NewTableRow<TData>>
}) => {
  const rows = options.data.map((row, index) => ({ ...row, id: getRowId(row, index) }) as TData)
  tables.set(options.tableName, rows)
  log('created table "%s" with %d rows', options.tableName, rows.length)
}

const getTableRows = <TData extends TableRow>(tableName: string) => {
  const rows = tables.get(tableName)
  if (!rows) {
    throw new Error('Memory data table not found', { cause: { tableName } })
  }
  return rows as Array<TData>
}

const resolveColumnId = (columnId: string) => (columnId === 'name' ? 'fullName' : columnId)

const getCellValue = (row: TableRow, columnId: string) => {
  const path = resolveColumnId(columnId).split('.')
  return path.reduce<unknown>((value, key) => (isRecord(value) ? value[key] : undefined), row)
}

const valueToSearchText = (value: unknown) => String(value ?? '').toLocaleLowerCase()

const toComparableNumber = (value: unknown) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined
  if (typeof value !== 'string' || value.trim() === '') return undefined

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

const compareValues = (leftValue: unknown, rightValue: unknown) => {
  if (leftValue === rightValue) return 0
  if (leftValue === undefined || leftValue === null) return 1
  if (rightValue === undefined || rightValue === null) return -1

  const leftNumber = toComparableNumber(leftValue)
  const rightNumber = toComparableNumber(rightValue)
  if (leftNumber !== undefined && rightNumber !== undefined) {
    return leftNumber - rightNumber
  }

  return String(leftValue).localeCompare(String(rightValue), undefined, {
    numeric: true,
    sensitivity: 'base',
  })
}

const sortRows = <TData extends TableRow>(rows: Array<TData>, sorting?: Array<SortOption>) => {
  if (!sorting?.length) return rows

  const sortsByFirstName = sorting.some((sort) => resolveColumnId(sort.id) === 'firstName')

  return rows
    .map((row, index) => ({ row, index }))
    .sort((left, right) => {
      for (const sort of sorting) {
        const comparison = compareValues(getCellValue(left.row, sort.id), getCellValue(right.row, sort.id))
        if (comparison !== 0) return sort.desc ? -comparison : comparison
      }

      if (sortsByFirstName) {
        const leftLastName = String(getCellValue(left.row, 'lastName') ?? '')
        const rightLastName = String(getCellValue(right.row, 'lastName') ?? '')
        const hasPunctuation = /['’]/.test(leftLastName) || /['’]/.test(rightLastName)

        if (hasPunctuation) {
          const comparison = compareValues(leftLastName.replaceAll(/['’]/g, ''), rightLastName.replaceAll(/['’]/g, ''))
          if (comparison !== 0) return comparison
        }
      }

      return left.index - right.index
    })
    .map(({ row }) => row)
}

const normalizeFilterValue = (value: unknown) => {
  if (value === 'true') return true
  if (value === 'false') return false
  return value
}

const getFilterOperator = (filter: FilterOptions) => {
  if (filter.operator?.trim()) return filter.operator.trim().toLocaleUpperCase()
  if (Array.isArray(filter.value)) return 'IN'
  if (typeof filter.value === 'string' && filter.value !== 'true' && filter.value !== 'false') return 'LIKE'
  if (isRangeFilterValue(filter.value)) return 'BETWEEN'
  return '='
}

const isActiveFilterValue = (value: unknown) => {
  if (value === undefined || value === null) return false
  if (typeof value === 'string') return value !== ''
  if (Array.isArray(value)) return value.length > 0
  if (isRangeFilterValue(value)) return value.start !== undefined || value.end !== undefined
  return true
}

const valuesAreEqual = (leftValue: unknown, rightValue: unknown) => {
  const normalizedRightValue = normalizeFilterValue(rightValue)
  return leftValue === normalizedRightValue || String(leftValue) === String(normalizedRightValue)
}

const matchesRange = (cellValue: unknown, rangeValue: RangeFilterValue) => {
  const cellNumber = toComparableNumber(cellValue)
  const startNumber = toComparableNumber(rangeValue.start)
  const endNumber = toComparableNumber(rangeValue.end)

  if (cellNumber !== undefined && (startNumber !== undefined || endNumber !== undefined)) {
    return (
      (startNumber === undefined || cellNumber >= startNumber) && (endNumber === undefined || cellNumber <= endNumber)
    )
  }

  const cellText = String(cellValue)
  return (
    (rangeValue.start === undefined || cellText >= String(rangeValue.start)) &&
    (rangeValue.end === undefined || cellText <= String(rangeValue.end))
  )
}

const matchesFilter = (row: TableRow, filter: FilterOptions) => {
  if (!isActiveFilterValue(filter.value)) return true

  const cellValue = getCellValue(row, filter.id)
  const operator = getFilterOperator(filter)
  const { value } = filter

  if (operator === 'IN' && Array.isArray(value)) {
    return value.some((item) => valuesAreEqual(cellValue, item))
  }

  if ((operator === 'LIKE' || operator === 'ILIKE') && typeof value === 'string') {
    return valueToSearchText(cellValue).includes(value.toLocaleLowerCase())
  }

  if (operator === 'BETWEEN' && isRangeFilterValue(value)) {
    return matchesRange(cellValue, value)
  }

  if (operator === '!=' || operator === '<>') return !valuesAreEqual(cellValue, value)
  if (operator === '>') return compareValues(cellValue, value) > 0
  if (operator === '>=') return compareValues(cellValue, value) >= 0
  if (operator === '<') return compareValues(cellValue, value) < 0
  if (operator === '<=') return compareValues(cellValue, value) <= 0

  return valuesAreEqual(cellValue, value)
}

const filterRows = <TData extends TableRow>(
  rows: Array<TData>,
  options: Pick<SchemaOptions<TData>, 'globalFilterFields'> & Pick<FetchDataOptions, 'filters' | 'globalFilter'>,
) => {
  const globalFilter = options.globalFilter?.trim().toLocaleLowerCase()
  const activeFilters = options.filters?.filter((filter) => isActiveFilterValue(filter.value)) ?? []

  return rows.filter((row) => {
    if (globalFilter?.length) {
      const globalFields = options.globalFilterFields ?? []
      const matchesGlobalFilter = globalFields.some((field) => valueToSearchText(row[field]).includes(globalFilter))
      if (!matchesGlobalFilter) return false
    }

    return activeFilters.every((filter) => matchesFilter(row, filter))
  })
}

const paginateRows = <TData extends TableRow>(rows: Array<TData>, options?: FetchDataOptions) => {
  if (options?.pageIndex === undefined || options.pageSize === undefined) return rows
  const start = options.pageIndex * options.pageSize
  return rows.slice(start, start + options.pageSize)
}

export const fetchSingleItem = async <TData extends TableRow>(tableName: string, id: number) =>
  getTableRows<TData>(tableName).find((row) => row.id === id)

export const updateSingleItem = async <TData extends TableRow>(
  tableName: string,
  id: number,
  updates: Partial<TData>,
) => {
  const rows = getTableRows<TData>(tableName)
  const rowIndex = rows.findIndex((row) => row.id === id)
  if (rowIndex < 0) return undefined

  const updatedRow = { ...rows[rowIndex], ...updates, id }
  rows[rowIndex] = updatedRow
  return updatedRow
}

export const fetchArrayData = async <TData extends TableRow>(
  nameOrSchemaOptions: SchemaOptions<TData> | string,
  opts?: FetchDataOptions,
) => {
  const schemaOptions =
    typeof nameOrSchemaOptions === 'string' ? { tableName: nameOrSchemaOptions } : nameOrSchemaOptions
  const rows = getTableRows<TData>(schemaOptions.tableName)
  const rowsWithAdditionalFields = schemaOptions.getAdditionalFields
    ? rows.map((row) => ({ ...row, ...schemaOptions.getAdditionalFields?.(row) }))
    : rows
  const filteredRows = filterRows(rowsWithAdditionalFields, {
    globalFilter: opts?.globalFilter,
    filters: opts?.filters,
    globalFilterFields: schemaOptions.globalFilterFields,
  })
  const sortedRows = sortRows(filteredRows, opts?.sorting)
  const pagedRows = paginateRows(sortedRows, opts)

  return {
    rows: pagedRows,
    rowCount: filteredRows.length,
  }
}
