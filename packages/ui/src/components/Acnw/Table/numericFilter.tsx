import { FilterType, FilterValue } from 'react-table'

const regex = /([=<>!]*)\s*((?:[0-9].?[0-9]*)+)/

function parseValue(filterValue: FilterValue) {
  // eslint-disable-next-line eqeqeq
  const defaultComparator = (val: any) => val == filterValue
  const tokens = regex.exec(filterValue)
  if (!tokens) return defaultComparator
  switch (tokens[1]) {
    case '>':
      return (val: any) => parseFloat(val) > parseFloat(tokens[2])
    case '<':
      return (val: any) => parseFloat(val) < parseFloat(tokens[2])
    case '<=':
      return (val: any) => parseFloat(val) <= parseFloat(tokens[2])
    case '>=':
      return (val: any) => parseFloat(val) >= parseFloat(tokens[2])
    case '=':
      return (val: any) => parseFloat(val) === parseFloat(tokens[2])
    case '!':
      return (val: any) => parseFloat(val) !== parseFloat(tokens[2])
  }
  return defaultComparator
}

export const numeric: FilterType<any> = (rows, id, filterValue) => {
  const comparator = parseValue(filterValue)
  return rows.filter(row => {
    const rowValue = row.values[id[0]]
    return comparator(rowValue)
  })
}
// Let the table remove the filter if the string is empty
numeric.autoRemove = val => !val
