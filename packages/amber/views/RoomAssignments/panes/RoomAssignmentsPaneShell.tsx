import type { ReactNode } from 'react'

import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import { Box, IconButton, Typography } from '@mui/material'

type RoomAssignmentsPaneShellProps = {
  title: string
  subtitle?: string
  isExpanded: boolean
  onToggleExpand: () => void
  children: ReactNode
}

const RoomAssignmentsPaneShell = ({
  title,
  subtitle,
  isExpanded,
  onToggleExpand,
  children,
}: RoomAssignmentsPaneShellProps) => (
  <Box
    component='section'
    sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
      gap: 1,
      flex: 1,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Typography variant='h6' component='h2'>
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant='body2' color='text.secondary'>
            {subtitle}
          </Typography>
        ) : null}
      </Box>
      <IconButton aria-label={isExpanded ? 'Exit full view' : 'Expand panel'} onClick={onToggleExpand} size='small'>
        {isExpanded ? <CloseFullscreenIcon fontSize='small' /> : <OpenInFullIcon fontSize='small' />}
      </IconButton>
    </Box>
    {children}
  </Box>
)

export default RoomAssignmentsPaneShell
