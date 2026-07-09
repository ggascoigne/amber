import type { MouseEvent } from 'react'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { IconButton } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import type { Row, RowData } from '@tanstack/react-table'

import { useTableScrollContainerRef } from './TableScrollContainerContext'

type RowExpansionButtonProps<TData extends RowData> = {
  row: Row<TData>
  sx?: SxProps<Theme>
}

export const RowExpansionButton = <TData extends RowData>({ row, sx }: RowExpansionButtonProps<TData>) => {
  const tableContainerRef = useTableScrollContainerRef()

  if (!row.getCanExpand()) return null
  const isExpanded = row.getIsExpanded()
  const label = isExpanded ? 'Collapse row' : 'Expand row'

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    const container = tableContainerRef?.current ?? null
    const scrollTop = container?.scrollTop ?? 0
    const scrollLeft = container?.scrollLeft ?? 0
    row.toggleExpanded(!isExpanded)
    if (container) {
      requestAnimationFrame(() => {
        container.scrollTop = scrollTop
        container.scrollLeft = scrollLeft
      })
    }
  }

  return (
    <IconButton
      size='small'
      aria-label={label}
      aria-expanded={isExpanded}
      onClick={handleClick}
      sx={[{ p: 0, width: 24, height: 24, margin: '-10px 0px -8px -16px' }, ...(Array.isArray(sx) ? sx : [sx])]}
      data-testid='row-expansion-toggle'
    >
      {isExpanded ? <KeyboardArrowDownIcon fontSize='small' /> : <KeyboardArrowRightIcon fontSize='small' />}
    </IconButton>
  )
}
