import { Grid, createStyles, makeStyles } from '@material-ui/core'
import type { GridProps } from '@material-ui/core/Grid'
import React from 'react'

const useStyles = makeStyles(() =>
  createStyles({
    grid: {
      width: 'auto',
    },
  })
)

interface GridContainerProps extends GridProps {
  className?: string
}

export const GridContainer: React.FC<GridContainerProps> = ({ children, className = '', ...rest }) => {
  const classes = useStyles()
  return (
    <Grid container {...rest} className={classes.grid + ' ' + className}>
      {children}
    </Grid>
  )
}
