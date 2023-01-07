import { useTheme } from '@mui/material/styles'
import { Fab, Theme, Zoom } from '@mui/material'
import React, { PropsWithChildren, useState } from 'react'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme: Theme) => ({
  fab: {
    position: 'fixed',
    zIndex: 100,
    top: 64 + theme.spacing(2),
    right: theme.spacing(2),
    '&&.MuiFab-extended': {
      height: 48,
      borderRadius: 24,
      paddingRight: 13.5,
    },
  },
}))

export const ExpandingFab: React.FC<PropsWithChildren<{ label: string; show: boolean; onClick: () => void }>> = ({
  label,
  show,
  children,
  onClick,
}) => {
  const { classes } = useStyles()

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
        className={classes.fab}
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
