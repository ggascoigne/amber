import { useId, type ReactNode } from 'react'

import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import { Box, IconButton, Typography } from '@mui/material'

type RoomAssignmentsPaneShellProps = {
  title: string
  subtitle?: string
  isExpanded: boolean
  onToggleExpand: () => void
  controls?: ReactNode
  children: ReactNode
}

const RoomAssignmentsPaneShell = ({
  title,
  subtitle,
  isExpanded,
  onToggleExpand,
  controls,
  children,
}: RoomAssignmentsPaneShellProps) => {
  const titleId = useId()

  return (
    <Box
      component='section'
      role='region'
      aria-labelledby={titleId}
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
          <Typography id={titleId} variant='h6' component='h2'>
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant='body2' color='text.secondary'>
              {subtitle}
            </Typography>
          ) : null}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {controls}
          <IconButton aria-label={isExpanded ? 'Exit full view' : 'Expand panel'} onClick={onToggleExpand} size='small'>
            {isExpanded ? <CloseFullscreenIcon fontSize='small' /> : <OpenInFullIcon fontSize='small' />}
          </IconButton>
        </Box>
      </Box>
      {children}
    </Box>
  )
}

export default RoomAssignmentsPaneShell
