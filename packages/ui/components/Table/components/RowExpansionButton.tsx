import type { MouseEvent } from 'react'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { IconButton } from '@mui/material'
import type { Row, RowData } from '@tanstack/react-table'

type RowExpansionButtonProps<TData extends RowData> = {
  row: Row<TData>
}

export const RowExpansionButton = <TData extends RowData>({ row }: RowExpansionButtonProps<TData>) => {
  if (!row.getCanExpand()) return null
  const isExpanded = row.getIsExpanded()
  const label = isExpanded ? 'Collapse row' : 'Expand row'

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    const container = (event.currentTarget as HTMLElement).closest<HTMLElement>('[data-testid="TableContainerSortOf"]')
    const scrollTop = container?.scrollTop ?? 0
    const scrollLeft = container?.scrollLeft ?? 0
    row.toggleExpanded()
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
      sx={{ p: 0, width: 24, height: 24, margin: '-10px 0px -8px -16px' }}
      data-testid='row-expansion-toggle'
    >
      {isExpanded ? <KeyboardArrowDownIcon fontSize='small' /> : <KeyboardArrowRightIcon fontSize='small' />}
    </IconButton>
  )
}
