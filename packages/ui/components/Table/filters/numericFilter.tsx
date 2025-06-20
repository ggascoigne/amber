import type { FilterValue, IdType, Row } from 'react-table'

const regex = /([=<>!]*)\s*((?:[0-9].?[0-9]*)+)/

function parseValue(filterValue: FilterValue) {
  // eslint-disable-next-line eqeqeq
  const defaultComparator = (val: any) => val == filterValue
  const tokens = regex.exec(filterValue)
  if (!tokens) {
    return defaultComparator
  }
  switch (tokens[1]) {
    case '>':
      return (val: any) => parseFloat(val) > parseFloat(tokens[2]!)
    case '<':
      return (val: any) => parseFloat(val) < parseFloat(tokens[2]!)
    case '<=':
      return (val: any) => parseFloat(val) <= parseFloat(tokens[2]!)
    case '>=':
      return (val: any) => parseFloat(val) >= parseFloat(tokens[2]!)
    case '=':
      return (val: any) => parseFloat(val) === parseFloat(tokens[2]!)
    case '!':
      return (val: any) => parseFloat(val) !== parseFloat(tokens[2]!)
    default:
      throw new Error(`Unknown comparator ${tokens[1]}`)
  }
  return defaultComparator
}

export function numericTextFilter<T extends Record<string, unknown>>(
  rows: Array<Row<T>>,
  id: Array<IdType<T>>,
  filterValue: FilterValue,
) {
  const comparator = parseValue(filterValue)
  return rows.filter((row) => comparator(row.values[id[0]!]))
}

// Let the table remove the filter if the string is empty
numericTextFilter.autoRemove = (val: any) => !val
