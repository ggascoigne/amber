import type { ReactElement } from 'react'
import { useCallback, useMemo, useState, useEffect } from 'react'

import { Add as AddIcon, Clear as ClearIcon } from '@mui/icons-material'
import { Box, MenuItem, Typography, Button } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import type { RowData, Column, Table as TableInstance } from '@tanstack/react-table'

import { FilterButtonMenu } from './FilterButtonMenu'
import { FilterContextProvider } from './FilterContext'
import { CLEAR_FILTERS_MESSAGE, clearSearch, emitter } from './filterEmitter'
import { SearchInput } from './SearchInput'

import { notEmpty } from '../../../utils/ts-utils'
import { SELECTION_COLUMN_ID } from '../constants'
import { columnName } from '../utils/tableUtils'

export type Filter<T extends RowData> = {
  name: string
  id?: string
  component: (table: TableInstance<T>) => ReactElement
  alwaysShow?: boolean
  formFilter?: boolean
  loading?: boolean
  clear: (type?: string) => void
  canBeCleared?: () => boolean
}

type TableFilterBarProps<T extends RowData> = {
  table: TableInstance<T>
  sx?: SxProps<Theme>
  displayGutter?: boolean
}

type GenericFilter<T extends RowData> = {
  type: 'table' | 'other'
  component: (table: TableInstance<T>) => ReactElement | undefined
  alwaysShow: boolean
  name: string
  id: string
  clear: () => void
  canBeCleared?: () => boolean
}

type FilterSelectProps<T extends RowData> = {
  filters: GenericFilter<T>[]
  onClick: (name: string) => void
}

const FilterSelect = <T extends RowData>(props: FilterSelectProps<T>) => (
  <FilterButtonMenu
    title={
      <>
        <AddIcon sx={{ color: 'action.active', mr: '4px' }} />
        <Typography variant='body2' sx={{ color: 'action.active' }}>
          Filter
        </Typography>
      </>
    }
    renderChildren={({ closePopup }) =>
      props.filters.map((f) => (
        <MenuItem
          key={f.name}
          onClick={() => {
            props.onClick(f.name)
            closePopup()
          }}
          sx={{ fontSize: '0.875rem' }}
        >
          {f.name}
        </MenuItem>
      ))
    }
  />
)

const columnToGenericFilter =
  <T extends RowData>(table: TableInstance<T>) =>
  (column: Column<T, unknown>): GenericFilter<T> | undefined => {
    const {
      clear = () => column.setFilterValue(undefined),
      canBeCleared = () => false,
      alwaysShow = false,
      filterRender,
    } = column.columnDef.meta?.filterFlags ?? {}
    const name = columnName(column)
    const { id } = column

    return filterRender
      ? ({
          type: 'table',
          component: () =>
            filterRender?.({
              table,
              column,
              clear,
            }),
          alwaysShow,
          name,
          id,
          clear,
          canBeCleared,
        } as const)
      : undefined
  }

export const useFilterValues = <T extends RowData>(
  table: TableInstance<T>,
): {
  hasFiltersToDisplay: boolean
  removeFilter: (name: string) => void
  addNewFilter: (name: string, noJustAddedFilterNeeded?: boolean) => void
  selectableFilters: GenericFilter<T>[]
  visibleFilters: GenericFilter<T>[]
  clearAllFilters: () => void
  showClearButton: boolean
  justAddedFilter: string | undefined
} => {
  const { getAllLeafColumns } = table
  const filtersEnabled = (table.options.enableColumnFilters ?? true) && (table.options.enableFilters ?? true)

  const [justAddedFilter, setJustAddedFilter] = useState<undefined | string>()

  const allFilters: GenericFilter<T>[] = useMemo(() => {
    const allColumns = getAllLeafColumns()
      .filter((column) => column.id !== SELECTION_COLUMN_ID)
      .filter((column) => column.getCanFilter())

    const tableFilters = allColumns.map(columnToGenericFilter(table)).filter(notEmpty)

    return tableFilters.sort((a, b) => a.name.localeCompare(b.name))
  }, [getAllLeafColumns, table])

  const alreadySetFilterNames = useMemo(() => {
    const existingFilterIds = table.getState().columnFilters?.map((f) => f.id)
    return allFilters.map((f) => (existingFilterIds.includes(f.id) ? f.name : undefined)).filter(notEmpty)
  }, [table, allFilters])

  const [selectedFilterNames, setSelectedFilterNames] = useState<string[]>(alreadySetFilterNames)

  const addFilter = useCallback((name: string) => {
    setSelectedFilterNames((old) => [...new Set([...old, name])])
  }, [])

  const removeFilter = useCallback((name: string) => {
    setSelectedFilterNames((old) => old.filter((item) => item !== name))
  }, [])

  const addNewFilter = useCallback(
    (name: string, noJustAddedFilterNeeded = false) => {
      setJustAddedFilter(noJustAddedFilterNeeded ? undefined : name)
      addFilter(name)
    },
    [addFilter],
  )

  const [requiredFilters, optionalFilter] = useMemo(() => {
    let [required, optional] = [allFilters.filter((f) => f.alwaysShow), allFilters.filter((f) => !f.alwaysShow)]

    if (optional.length === 1) {
      required = [...required, ...optional]
      optional = []
    }
    return [required, optional]
  }, [allFilters])

  const displayedFilters = useMemo(
    // ordered like this to retain selection order
    () => selectedFilterNames.map((name) => optionalFilter.find((f) => f.name === name)!).filter(notEmpty),
    [optionalFilter, selectedFilterNames],
  )

  const selectableFilters = useMemo(
    () => optionalFilter.filter((f) => !selectedFilterNames.includes(f.name)).filter(notEmpty),
    [optionalFilter, selectedFilterNames],
  )

  const clearAllFilters = useCallback(() => {
    allFilters.forEach((f) => f.clear())
    setSelectedFilterNames([])
    table.setGlobalFilter('')
    clearSearch()
  }, [allFilters, table])

  useEffect(() => {
    emitter.addEventListener(CLEAR_FILTERS_MESSAGE, clearAllFilters)
    return () => {
      emitter.removeEventListener(CLEAR_FILTERS_MESSAGE, clearAllFilters)
    }
  }, [clearAllFilters])

  const hasSomethingToClear = requiredFilters.reduce((previous, filter) => previous || !!filter.canBeCleared?.(), false)

  const { globalFilter } = table.getState()
  const globalFilterValue = typeof globalFilter === 'object' ? globalFilter.value : globalFilter

  const showClearButton =
    (requiredFilters.length > 0 && hasSomethingToClear) || globalFilterValue || displayedFilters.length > 0
  const visibleFilters = [...requiredFilters, ...displayedFilters]
  const hasFiltersToDisplay = filtersEnabled && !!(visibleFilters.length || selectableFilters.length)

  return {
    hasFiltersToDisplay,
    justAddedFilter,
    removeFilter,
    addNewFilter,
    selectableFilters,
    clearAllFilters,
    visibleFilters,
    showClearButton,
  }
}

export const TableFilterBar = <T extends RowData>({ table, sx, displayGutter }: TableFilterBarProps<T>) => {
  const searchEnabled = (table.options.enableGlobalFilter ?? true) && (table.options.enableFilters ?? true)
  const searchValue = table.getState().globalFilter
  const searchValueChange = table.setGlobalFilter

  const {
    hasFiltersToDisplay,
    justAddedFilter,
    removeFilter,
    addNewFilter,
    selectableFilters,
    clearAllFilters,
    visibleFilters,
    showClearButton,
  } = useFilterValues(table)

  return (
    <>
      {(hasFiltersToDisplay || searchEnabled) && (
        <Box
          sx={[
            {
              width: '100%',
              display: 'flex',
              flexGrow: 1,
              flexDirection: 'row',
              flexWrap: 'wrap',
              p: (theme: Theme) => theme.spacing(1, 3, 0.5, 3),
              gap: 1.5,
              backgroundColor: 'background.paper',
              px: displayGutter ? 3 : 2,
              '@media (min-width: 600px)': {
                px: displayGutter ? 3 : 2,
              },
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ]}
        >
          {hasFiltersToDisplay &&
            visibleFilters.map((f) => (
              <FilterContextProvider
                key={f.name}
                value={{
                  clear: f.clear,
                  preClear: () => removeFilter(f.name),
                  autoOpen: justAddedFilter === f.name,
                }}
              >
                {f.component(table)}
              </FilterContextProvider>
            ))}
          {hasFiltersToDisplay && selectableFilters.length ? (
            <FilterSelect filters={selectableFilters} onClick={addNewFilter} />
          ) : null}
          {searchEnabled && <SearchInput value={searchValue} onChange={searchValueChange!} />}
          {showClearButton ? (
            <Button startIcon={<ClearIcon />} size='small' onClick={clearAllFilters}>
              Clear All
            </Button>
          ) : null}
        </Box>
      )}
    </>
  )
}
