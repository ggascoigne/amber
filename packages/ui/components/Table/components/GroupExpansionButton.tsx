import { css as emotionCss } from '@emotion/css'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { TableSortLabel } from '@mui/material'
import { css } from '@mui/material/styles'
import type { Row, RowData } from '@tanstack/react-table'

const tableExpandClasses = {
  iconDirectionAsc: emotionCss(
    css({
      transform: 'rotate(90deg) !important',
    }).styles,
  ),
  iconDirectionDesc: emotionCss(
    css({
      transform: 'rotate(180deg)  !important',
    }).styles,
  ),
}

const groupSvgSx = {
  '& svg': {
    width: '16px',
    height: '16px',
  },
}

export const GroupExpansionButton = <T extends RowData>({ row }: { row: Row<T> }) => (
  <TableSortLabel
    classes={tableExpandClasses}
    active
    direction={row.getIsExpanded() ? 'desc' : 'asc'}
    IconComponent={KeyboardArrowUpIcon}
    onClick={row.getToggleExpandedHandler()}
    sx={groupSvgSx}
  />
)
