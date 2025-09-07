import { ReactElement } from 'react'

import { Box } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { ColumnInstance } from 'react-table'

export const ResizeHandle = <T extends Record<string, unknown>>({
  column,
}: {
  column: ColumnInstance<T>
}): ReactElement => (
  <Box
    {...column.getResizerProps()}
    className={`resize-handle${column.isResizing ? ' handleActive' : ''}`}
    sx={[
      (theme: Theme) => ({
        position: 'absolute',
        cursor: 'col-resize',
        zIndex: 100,
        opacity: 0,
        borderLeft: `1px solid ${theme.palette.primary.light}`,
        borderRight: `1px solid ${theme.palette.primary.light}`,
        height: '50%',
        top: '25%',
        transition: 'all linear 100ms',
        right: -2,
        width: '3px',
        '&.handleActive': {
          opacity: 1,
          border: 'none',
          backgroundColor: theme.palette.primary.light,
          height: 'calc(100% - 4px)',
          top: '2px',
          right: -1,
          width: '1px',
        },
      }),
    ]}
  />
)
