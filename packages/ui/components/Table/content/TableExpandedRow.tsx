import type { ReactElement, ReactNode } from 'react'

import Box from '@mui/material/Box'
import type { Theme, SxProps } from '@mui/material/styles'

import { TableCell, TableRow } from '../components/TableStyles'
import { EXPAND_COLUMN_SIZE } from '../constants'

type TableExpandedRowProps = {
  children: ReactNode
  displayGutter: boolean
  expandedContentSx?: SxProps<Theme>
  pageElevation?: number
}

export const TableExpandedRow = ({
  children,
  displayGutter,
  expandedContentSx,
  pageElevation,
}: TableExpandedRowProps): ReactElement => (
  <TableRow
    pageElevation={pageElevation}
    sx={{
      display: 'flex',
      width: '100%',
    }}
  >
    <TableCell
      sx={[
        {
          flex: '1 1 auto',
          width: '100%',
          borderRight: 'none',
          backgroundColor: (theme: Theme) => theme.palette.action.hover,
          px: displayGutter ? 3 : 2,
        },
        ...(Array.isArray(expandedContentSx) ? expandedContentSx : [expandedContentSx]),
      ]}
    >
      <Box sx={{ pl: `${EXPAND_COLUMN_SIZE}px` }}>{children}</Box>
    </TableCell>
  </TableRow>
)
