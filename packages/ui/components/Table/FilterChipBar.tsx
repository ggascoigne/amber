import { ReactElement, useCallback } from 'react'

import { Box, Chip } from '@mui/material'
import type { ColumnInstance, FilterValue, IdType, TableInstance } from 'react-table'

interface FilterChipBarProps<T extends Record<string, unknown>> {
  instance: TableInstance<T>
}

const getFilterValue = (column: ColumnInstance<any>, filterValue: FilterValue) => {
  switch (column.filter) {
    case 'between': {
      const min = filterValue[0]
      const max = filterValue[1]
      return min ? (max ? `${min}-${max}` : `>=${min}`) : `<=${max}`
    }
    default:
      return filterValue
  }
}

export function FilterChipBar<T extends Record<string, unknown>>({
  instance,
}: FilterChipBarProps<T>): ReactElement | null {
  const {
    allColumns,
    setFilter,
    state: { filters },
  } = instance
  const handleDelete = useCallback(
    (id: string | number) => {
      setFilter(id as IdType<T>, undefined)
    },
    [setFilter],
  )

  return Object.keys(filters).length > 0 ? (
    <Box sx={{ p: '18px 0 5px 10px', width: '100%' }}>
      <Box component='span' sx={{ color: '#998', fontSize: '14px', pr: '10px' }}>
        Active filters:
      </Box>
      {filters &&
        allColumns.map((column) => {
          const filter = filters.find((f) => f.id === column.id)
          const value = filter?.value
          return (
            value && (
              <Chip
                sx={{ mr: 0.5, color: '#222' }}
                key={column.id}
                label={
                  <>
                    <Box component='span' sx={{ fontWeight: 500, mr: '5px' }}>
                      {column.render('Header')}:
                    </Box>
                    {getFilterValue(column, value)}
                  </>
                }
                onDelete={() => handleDelete(column.id)}
                variant='outlined'
              />
            )
          )
        })}
    </Box>
  ) : null
}
