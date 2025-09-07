import React, { PropsWithChildren, useState } from 'react'

import { Fab, Zoom } from '@mui/material'
import { useTheme } from '@mui/material/styles'

export const ExpandingFab: React.FC<PropsWithChildren<{ label: string; show: boolean; onClick: () => void }>> = ({
  label,
  show,
  children,
  onClick,
}) => {
  const [inHover, setHover] = useState(false)
  const theme = useTheme()

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  }

  return (
    <Zoom in={show} timeout={transitionDuration} unmountOnExit>
      <Fab
        color='primary'
        aria-label='top'
        size='medium'
        variant={inHover ? 'extended' : undefined}
        sx={[
          (t) => ({
            position: 'fixed',
            zIndex: 100,
            top: `calc(64px + ${t.spacing(2)})`,
            right: t.spacing(2),
            '&.MuiFab-extended': {
              height: 48,
              borderRadius: 24,
              paddingRight: 13.5,
            },
          }),
        ]}
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {inHover ? label : null}
        {children}
      </Fab>
    </Zoom>
  )
}
