import { FormEvent, ReactElement, useCallback } from 'react'

import { Box, Button, Popover, Typography } from '@mui/material'
import type { TableInstance } from 'react-table'

interface FilterPageProps<T extends Record<string, unknown>> {
  instance: TableInstance<T>
  anchorEl?: Element
  onClose: () => void
  show: boolean
}

export function FilterPage<T extends Record<string, unknown>>({
  instance,
  anchorEl,
  onClose,
  show,
}: FilterPageProps<T>): ReactElement {
  const { allColumns, setAllFilters } = instance

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      onClose()
    },
    [onClose],
  )

  const resetFilters = useCallback(() => {
    setAllFilters([])
  }, [setAllFilters])

  return (
    <div>
      <Popover
        anchorEl={anchorEl}
        id='popover-filters'
        onClose={onClose}
        open={show}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 3, position: 'relative' }}>
          <Typography sx={{ fontWeight: 500, p: '0 24px 24px 0', textTransform: 'uppercase' }}>Filters</Typography>
          <form onSubmit={onSubmit}>
            <Button sx={{ position: 'absolute', top: 18, right: 21 }} color='primary' onClick={resetFilters}>
              Reset
            </Button>
            <Box
              sx={[
                {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 218px)',
                  gridColumnGap: 24,
                  gridRowGap: 24,
                },
                (theme) => ({
                  [theme.breakpoints.down('sm')]: { gridTemplateColumns: 'repeat(1, 180px)' },
                }),
              ]}
            >
              {allColumns
                .filter((it) => it.canFilter)
                .map((column) => (
                  <Box key={column.id} sx={{ width: '100%', display: 'inline-flex', flexDirection: 'column' }}>
                    {column.render('Filter')}
                  </Box>
                ))}
            </Box>
            <Button sx={{ display: 'none' }} type='submit'>
              &nbsp;
            </Button>
          </form>
        </Box>
      </Popover>
    </div>
  )
}
