import type { FilterFn, RowData } from '@tanstack/react-table'

const comparatorRegex = /^\s*([=<>!]{0,2})\s*(-?\d+(?:\.\d+)?)\s*$/

type Comparator = (value: unknown) => boolean

const toNumber = (value: unknown) => {
  if (value === null || value === undefined) return null
  if (typeof value === 'number') {
    return Number.isNaN(value) ? null : value
  }
  const parsed = parseFloat(String(value))
  return Number.isNaN(parsed) ? null : parsed
}

const createComparator = (rawFilter: string): Comparator => {
  // eslint-disable-next-line eqeqeq
  const defaultComparator: Comparator = (val) => val == rawFilter
  const tokens = comparatorRegex.exec(rawFilter)

  if (!tokens || tokens[2] === undefined) {
    return defaultComparator
  }

  const [, rawComparator = '', numericValueRaw] = tokens
  const numericValue = parseFloat(numericValueRaw)

  switch (rawComparator) {
    case '>':
      return (val) => {
        const candidate = toNumber(val)
        return candidate !== null && candidate > numericValue
      }
    case '<':
      return (val) => {
        const candidate = toNumber(val)
        return candidate !== null && candidate < numericValue
      }
    case '<=':
      return (val) => {
        const candidate = toNumber(val)
        return candidate !== null && candidate <= numericValue
      }
    case '>=':
      return (val) => {
        const candidate = toNumber(val)
        return candidate !== null && candidate >= numericValue
      }
    case '=':
    case '==':
      return (val) => {
        const candidate = toNumber(val)
        return candidate !== null && candidate === numericValue
      }
    case '!':
    case '!=':
      return (val) => {
        const candidate = toNumber(val)
        return candidate !== null && candidate !== numericValue
      }
    default:
      return defaultComparator
  }
}

export const numericTextFilter: FilterFn<RowData> = (row, columnId, filterValue) => {
  if (filterValue === undefined || filterValue === null) {
    return true
  }

  const filterText = String(filterValue).trim()
  if (!filterText.length) {
    return true
  }

  const comparator = createComparator(filterText)
  return comparator(row.getValue(columnId))
}

numericTextFilter.autoRemove = (value: unknown) => {
  if (value === undefined || value === null) return true
  if (typeof value === 'string') {
    return value.trim().length === 0
  }
  return false
}
