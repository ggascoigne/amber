import type { ReactNode } from 'react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import AddIcon from '@mui/icons-material/Add'
import { Button, Paper, Stack, Typography, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import type { SxProps, Theme } from '@mui/material/styles'
import TableContainer from '@mui/material/TableContainer'
import useResizeObserver from '@react-hook/resize-observer'
import type { Row, RowData, Table as TableInstance } from '@tanstack/react-table'
import { dequal as deepEqual } from 'dequal'
import { match } from 'ts-pattern'

import type { Action } from './actions'
import { TableContentSkeleton } from './components/TableContentSkeleton'
import { TableContextProvider } from './components/TableContext'
import { TableTable, tableDecorationZIndex } from './components/TableStyles'
import { TableToolbar } from './components/TableToolbar'
import type { DataTableEditingConfig } from './editing/types'
import type { TableEditingState } from './editing/useTableEditing'
import { useTableEditing } from './editing/useTableEditing'
import { TableFilterBar } from './filter/TableFilterBar'
import { TableContent } from './TableContent'
import { TableFooter } from './TableFooter'
import { TableHeader } from './TableHeader'

import { isDev } from '../../utils'

export type DataTableProps<T extends RowData> = {
  tableInstance: TableInstance<T>
  title?: string

  isLoading?: boolean
  isFetching?: boolean
  toolbarActions?: ReadonlyArray<Action<T>>
  systemActions?: ReadonlyArray<Action<T>>
  rowActions?: ReadonlyArray<Action<T>>
  onRowClick?: (row: Row<T>) => void
  rowCount?: number
  displayPagination?: 'always' | 'never' | 'asNeeded'
  sx?: SxProps<Theme>
  scrollBehavior?: 'none' | 'bounded'
  elevation?: number
  compact?: boolean
  displayGutter?: boolean
  rowStyle?: 'flex' | 'fixed'
  emptyDataComponent?: ReactNode
  highlightRow?: (row: Row<T>) => boolean
  debug?: boolean
  debugLogging?: boolean
  dataTestid?: string
  useVirtualRows?: boolean
  hideHeader?: boolean
  paginationStyle?: 'compact' | 'default'
  paginationPageSizes?: Array<number>
  variant?: 'elevation' | 'outlined'
  cellEditing?: DataTableEditingConfig<T>
  renderExpandedContent?: (row: Row<T>) => ReactNode
  getRowCanExpand?: (row: Row<T>) => boolean
  addRowAction?: {
    onAddRow: () => void
  }
  expandedContentSx?: SxProps<Theme>
}

const defaultHighlightRow = () => false

const defaultSystemActions: Action<any>[] = [
  {
    action: 'columnSelect',
  },
]

type TableEditingFooterProps<T extends RowData> = {
  editing: TableEditingState<T>
  addRowAction?: DataTableProps<T>['addRowAction']
}

const TableEditingFooter = <T extends RowData>({ editing, addRowAction }: TableEditingFooterProps<T>) => {
  const { hasChanges, hasErrors, editedRowCount, isSaving, saveChanges, discardChanges } = editing
  const rowLabel = editedRowCount === 1 ? '1 row' : `${editedRowCount} rows`
  const message = hasChanges ? `You have unsaved changes (${rowLabel})` : null

  return (
    <Stack direction='row' alignItems='center' spacing={2} sx={{ py: 1, pr: 1 }}>
      {addRowAction ? (
        <Button
          variant='text'
          size='small'
          startIcon={<AddIcon fontSize='small' />}
          onClick={addRowAction.onAddRow}
          disabled={isSaving}
        >
          Add Row
        </Button>
      ) : null}
      {message ? <Typography variant='body2'>{message}</Typography> : null}
      {hasErrors ? (
        <Typography variant='body2' color='error'>
          Fix validation errors before saving.
        </Typography>
      ) : null}
      {hasChanges ? (
        <>
          <Button variant='contained' size='small' onClick={saveChanges} disabled={hasErrors || isSaving}>
            Save
          </Button>
          <Button variant='text' size='small' onClick={discardChanges} disabled={isSaving}>
            Discard
          </Button>
        </>
      ) : null}
    </Stack>
  )
}

export const DataTable = <T extends RowData>({
  tableInstance,
  title,
  isLoading,
  isFetching,
  sx,
  scrollBehavior = 'none',
  toolbarActions,
  systemActions = defaultSystemActions,
  rowActions,
  onRowClick,
  rowCount,
  displayPagination = 'always',
  elevation = 1,
  emptyDataComponent,
  highlightRow = defaultHighlightRow,
  compact = false,
  displayGutter = true,
  rowStyle = 'flex',
  debug = isDev,
  debugLogging = false,
  dataTestid,
  useVirtualRows = true,
  hideHeader = false,
  paginationStyle = 'default',
  paginationPageSizes,
  variant: userVariant = 'elevation',
  cellEditing,
  renderExpandedContent,
  addRowAction,
  expandedContentSx,
}: DataTableProps<T>) => {
  const theme = useTheme()
  const [headingHeight, setHeadingHeight] = useState(0)
  const headingRef = useRef<HTMLDivElement>(null)
  const scrollPositionRef = useRef({ top: 0, left: 0 })
  const expandedState = tableInstance.getState().expanded
  const previousExpandedRef = useRef(expandedState)
  const { pageIndex } = tableInstance.getState().pagination
  const editing = useTableEditing({ table: tableInstance, config: cellEditing })
  const hasExpandedContent = !!renderExpandedContent

  // The virtualizer needs to know the scrollable container element
  const tableContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = tableContainerRef.current
    if (!element) {
      return () => {}
    }
    const handleScroll = () => {
      scrollPositionRef.current = { top: element.scrollTop, left: element.scrollLeft }
    }
    handleScroll()
    element.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      element.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useLayoutEffect(() => {
    if (!hasExpandedContent) {
      previousExpandedRef.current = expandedState
      return
    }
    if (deepEqual(previousExpandedRef.current, expandedState)) return
    const element = tableContainerRef.current
    if (element) {
      const { top, left } = scrollPositionRef.current
      element.scrollTop = top
      element.scrollLeft = left
    }
    previousExpandedRef.current = expandedState
  }, [expandedState, hasExpandedContent])

  useEffect(() => {
    if (pageIndex === 0) {
      tableContainerRef?.current?.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto',
      })
    }
  }, [pageIndex])

  const shouldDisplayPagination = match(displayPagination)
    .with('always', () => true)
    .with('asNeeded', () => tableInstance.options.data.length > tableInstance.getState()?.pagination?.pageSize)
    .with('never', () => false)
    .exhaustive()

  const displayToolbar = !!toolbarActions?.length || !!systemActions?.length
  const paginationBlocked = editing.enabled && (editing.isEditing || editing.hasChanges)
  const shouldShowEditingFooter = editing.enabled && (editing.hasChanges || !!addRowAction)
  const footerContent = shouldShowEditingFooter ? (
    <TableEditingFooter editing={editing} addRowAction={addRowAction} />
  ) : null

  useResizeObserver(headingRef, () => {
    const element = headingRef.current
    if (element) {
      const { height } = element.getBoundingClientRect()
      setHeadingHeight(height)
    }
  })

  const overrideOutline = userVariant === 'outlined' && elevation !== 0
  const variant = overrideOutline ? 'elevation' : userVariant

  const tableContent = isLoading ? (
    <TableContentSkeleton
      table={tableInstance}
      rowStyle={rowStyle}
      tableContainerRef={tableContainerRef}
      compact={compact}
      useVirtualRows={useVirtualRows}
    />
  ) : tableInstance.getRowModel().flatRows.length === 0 && emptyDataComponent ? (
    emptyDataComponent
  ) : (
    <TableContent
      table={tableInstance}
      onRowClick={editing.enabled ? undefined : onRowClick}
      rowActions={rowActions}
      tableContainerRef={tableContainerRef}
      highlightRow={highlightRow}
      compact={compact}
      displayGutter={displayGutter}
      rowStyle={rowStyle}
      pageElevation={elevation}
      useVirtualRows={useVirtualRows}
      scrollBehavior={scrollBehavior}
      editing={editing}
      renderExpandedContent={renderExpandedContent}
      expandedContentSx={expandedContentSx}
    />
  )

  return (
    <Paper
      elevation={elevation}
      variant={variant}
      sx={[
        {
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '4px',
          '--table-compact-spacing': compact ? theme.spacing(1) : theme.spacing(2),
        },
        scrollBehavior === 'bounded' && {
          flexGrow: 1,
          minHeight: 0,
          overflow: 'hidden',
        },
        overrideOutline && {
          border: (t: Theme) => `1px solid ${t.palette.divider}`,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <TableContextProvider trace={debugLogging}>
        <TableContainer
          ref={tableContainerRef}
          sx={{
            borderTopRightRadius: '4px',
            borderTopLeftRadius: '4px',
            borderBottomRightRadius: '4px',
            borderBottomLeftRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            minHeight: 0,
            overflow: scrollBehavior === 'bounded' ? 'auto' : undefined,
          }}
          data-testid={dataTestid}
        >
          <Box
            ref={headingRef}
            sx={[
              {
                position: 'sticky',
                top: 0,
                left: 0,
                zIndex: tableDecorationZIndex,
                backgroundColor: 'background.paper',
              },
              tableInstance.options.enableGlobalFilter || tableInstance.options.enableColumnFilters ? { pt: 1 } : {},
            ]}
            data-testid='TableHeading'
          >
            {title && (
              <Typography
                variant='h4'
                component='h1'
                color='textPrimary'
                sx={{ px: displayGutter ? 3 : 2, pt: 2 }}
                data-testid={`TableHeading-Title:${title}`}
              >
                {title}
              </Typography>
            )}
            {(tableInstance.options.enableColumnFilters || tableInstance.options.enableGlobalFilter) && (
              <TableFilterBar<T> table={tableInstance} displayGutter={displayGutter} />
            )}
            {displayToolbar ? (
              <TableToolbar
                table={tableInstance}
                toolbarActions={toolbarActions}
                systemActions={systemActions}
                displayGutter={displayGutter}
                sx={{
                  borderRadius: 0,
                }}
              />
            ) : null}
          </Box>
          {hideHeader ? null : (
            <TableHeader
              table={tableInstance}
              sx={{
                width: '100%',
                position: 'sticky',
                top: headingHeight,
              }}
              displayLoading
              isLoading={isLoading}
              isFetching={isFetching}
              compact={compact}
              displayGutter={displayGutter}
              rowStyle={rowStyle}
            />
          )}
          <TableTable data-testid='MainTable'>{tableContent}</TableTable>
          <TableFooter
            table={tableInstance}
            rowCount={rowCount}
            sx={{
              bottom: 0,
              borderRadius: '0 0 4px 4px',
            }}
            debug={debug}
            displayPagination={shouldDisplayPagination && !paginationBlocked}
            pagination={paginationStyle}
            paginationPageSizes={paginationPageSizes}
            compact={compact}
            footerContent={footerContent}
          />
        </TableContainer>
      </TableContextProvider>
    </Paper>
  )
}
