import type { ReactElement } from 'react'

import { css as emotionCss } from '@emotion/css'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { Box, LinearProgress, TableSortLabel, Tooltip } from '@mui/material'
import type { Theme, SxProps } from '@mui/material/styles'
import { css } from '@mui/material/styles'
import type { RowData, Table as TableInstance } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'

import { ResizeHandle, TableHeadRow } from './components/TableHeadRow'
import { TableHead, TableHeadCell } from './components/TableStyles'
import { isUserColumnId } from './utils/tableUtils'
import type { RowStyleType } from './utils/tableUtils'

const tableSortClasses = {
  iconDirectionAsc: emotionCss(
    css({
      transform: 'rotate(-180deg)  !important',
    }).styles,
  ),
  iconDirectionDesc: emotionCss(
    css({
      transform: 'rotate(0deg) !important',
    }).styles,
  ),
}

export const TableHeader = <T extends RowData>({
  table,
  sx,
  displayLoading,
  isLoading,
  isFetching,
  displayGutter,
  rowStyle = 'flex',
  compact,
}: {
  table: TableInstance<T>
  sx?: SxProps<Theme>
  isLoading?: boolean
  isFetching?: boolean
  displayLoading: boolean
  compact: boolean
  displayGutter: boolean
  rowStyle: RowStyleType
}): ReactElement => {
  const headerGroups = table.getHeaderGroups()
  const showProgress = displayLoading && isFetching && !isLoading

  return (
    <TableHead sx={sx} data-testid='TableHeader'>
      {headerGroups.map((headerGroup, headerGroupIndex) => {
        const isLastHeaderGroup = headerGroupIndex + 1 === headerGroups.length

        return (
          <TableHeadRow
            key={headerGroup.id}
            sx={[
              displayGutter
                ? {
                    '& >div:first-of-type': {
                      pl: 3,
                      pr: 1,
                    },
                    '& >div:last-of-type': {
                      pr: 3,
                    },
                  }
                : {},
              rowStyle === 'flex' && {
                display: 'flex',
              },
            ]}
          >
            {headerGroup.headers.map((header, headerIndex) => {
              const isLastHeader = headerIndex + 1 === headerGroup.headers.length
              const align = header.column.getIsGrouped()
                ? 'left'
                : header.column.columnDef?.meta?.align === 'right'
                  ? 'right'
                  : 'left'
              const columnCanResize =
                rowStyle === 'fixed' ? header.column.getCanResize() && !isLastHeader : header.column.getCanResize()

              const isSystemColumn =
                !isUserColumnId(header.id) || header.subHeaders?.some((sub) => !isUserColumnId(sub.id))

              return (
                <TableHeadCell
                  key={header.id}
                  data-testid={`header-${header.id}`}
                  colSpan={header.colSpan}
                  sx={[
                    {
                      py: compact ? 1 : 2,
                      width: header.getSize(),
                      textAlign: align,
                      display: 'flex',
                      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
                    },
                    rowStyle === 'flex' &&
                      !isSystemColumn && {
                        flex: `${header.getSize()} 0 auto`,
                      },
                    rowStyle === 'fixed' && {
                      '&:last-of-type': {
                        flex: '1 1 auto',
                      },
                    },
                    headerGroupIndex === 0 && {
                      borderTopWidth: '1px',
                      borderTopStyle: 'solid',
                      borderTopColor: 'divider',
                    },
                    isLastHeaderGroup && {
                      borderBottomWidth: '2px',
                    },
                  ]}
                >
                  {header.isPlaceholder ? null : (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      {/* I only want the leaves of columns to show grouping */}
                      {header.column.getCanGroup() && headerGroup.depth + 1 === headerGroups.length && (
                        <Tooltip title='Toggle Grouping'>
                          <TableSortLabel
                            active
                            direction={header.column.getIsGrouped() ? 'desc' : 'asc'}
                            IconComponent={KeyboardArrowRightIcon}
                            data-col-group={
                              header.column.getIsGrouped()
                                ? `${header.column.getGroupedIndex()}:${header.column.getIsGrouped()}`
                                : 'false'
                            }
                            data-testid='toggle-group-button'
                            sx={{
                              '& svg': {
                                width: '16px',
                                height: '16px',
                                marginRight: 0,
                                marginLeft: '-4px',
                              },
                            }}
                            onClick={header.column.getToggleGroupingHandler()}
                          />
                        </Tooltip>
                      )}
                      {header.column.getCanSort() ? (
                        <TableSortLabel
                          active={!!header.column.getIsSorted()}
                          direction={header.column.getIsSorted() || 'asc'}
                          onClick={header.column.getToggleSortingHandler()}
                          classes={tableSortClasses}
                          data-testid='toggle-sort-button'
                          sx={[
                            {
                              '& svg': {
                                width: '16px',
                                height: '16px',
                                marginTop: 0,
                                marginLeft: '2px',
                              },
                              display: 'flex',
                            },
                            header.column.columnDef.meta?.align === 'right' && {
                              flexDirection: 'row-reverse',
                            },
                          ]}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </TableSortLabel>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </Box>
                  )}
                  {columnCanResize && (
                    <ResizeHandle
                      header={header}
                      isLast={header.column.getCanResize() && headerIndex + 1 === headerGroup.headers.length}
                    />
                  )}
                </TableHeadCell>
              )
            })}
          </TableHeadRow>
        )
      })}
      {showProgress && (
        <LinearProgress
          sx={{
            marginBottom: '-4px',
          }}
        />
      )}
    </TableHead>
  )
}
