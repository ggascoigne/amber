import type { ReactElement } from 'react'
import type React from 'react'
import { memo, useMemo, useRef, useState } from 'react'

import type { SxProps, Theme } from '@mui/material'
import { Box } from '@mui/material'
import useResizeObserver from '@react-hook/resize-observer'
import type { CellContext, RowData } from '@tanstack/react-table'

import { getTooltipId, useTableContext } from './TableContext'

type TooltipSharedCellProps = {
  alwaysShowTooltip?: boolean
  sx?: SxProps<Theme>
}

type TooltipNodeCellProps = TooltipSharedCellProps & {
  children: React.ReactNode
  tooltip: string
}

type TooltipStringCellProps = TooltipSharedCellProps & {
  text: string
  tooltip?: string
}

type TooltipCellProps = TooltipNodeCellProps | TooltipStringCellProps

export const hasText = (value: TooltipCellProps): value is TooltipStringCellProps =>
  Object.prototype.hasOwnProperty.call(value, 'text')

export const hasChildren = (value: TooltipCellProps): value is TooltipNodeCellProps =>
  Object.prototype.hasOwnProperty.call(value, 'children')

export const TooltipCell = (props: TooltipCellProps) => {
  const { alwaysShowTooltip = false, sx } = props

  const [{ tableIndex }] = useTableContext()

  const [isOverflowed, setIsOverflow] = useState(false)
  const cellRef = useRef<HTMLSpanElement>(null)
  const content = hasText(props) ? props.text : props.children

  useResizeObserver(cellRef, () => {
    const element = cellRef.current
    if (element) {
      setIsOverflow(element.scrollWidth > element.clientWidth)
    }
  })

  const tooltipText = hasText(props) ? (props.tooltip ?? props.text) : (props.tooltip ?? undefined)

  const enableTooltip = alwaysShowTooltip || isOverflowed

  const sxWrap = useMemo(
    () => [
      {
        display: 'block',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        // for Safari to prevent showing default tooltip when text overflow is hidden with ellipsis
        '&::after': {
          content: "''",
          display: 'block',
        },
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ],
    [sx],
  )

  const toolTipProps = enableTooltip
    ? {
        'data-tooltip-content': tooltipText,
        'data-tooltip-id': getTooltipId(tableIndex),
      }
    : {}

  return (
    <Box sx={sxWrap} data-testid='content' {...toolTipProps} ref={cellRef}>
      {content}
    </Box>
  )
}

export const getCellSx = <T extends RowData>({ column, cell }: CellContext<T, unknown>) => {
  const isGrouped = cell.getIsGrouped()
  const align = isGrouped ? 'left' : (column.columnDef.meta?.align ?? 'left')
  return [
    {
      textAlign: align,
    },
    isGrouped && { width: '100%' },
  ]
}

const InternalTooltipCellRenderer = <T extends RowData>(props: CellContext<T, unknown>) => {
  const { cell, column } = props
  const sx = getCellSx(props)
  const { alwaysShowTooltip = false } = column.columnDef.meta ?? {}
  return <TooltipCell text={cell.getValue() as string} alwaysShowTooltip={alwaysShowTooltip} sx={sx} />
}

export const TooltipCellRenderer = memo(InternalTooltipCellRenderer) as <T extends RowData>(
  props: CellContext<T, unknown>,
) => ReactElement
