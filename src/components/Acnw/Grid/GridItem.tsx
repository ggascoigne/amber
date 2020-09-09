import { Grid, createStyles, makeStyles } from '@material-ui/core'
import type { GridProps } from '@material-ui/core/Grid'
import React from 'react'

const useStyles = makeStyles(() =>
  createStyles({
    grid: {
      position: 'relative',
      width: '100%',
      minHeight: '1px',
      flexBasis: 'auto',
    },
  })
)

interface GridItem extends GridProps {
  className?: string
}

export const GridItem: React.FC<GridItem> = ({ children, className = '', ...rest }) => {
  const classes = useStyles()
  return (
    <Grid item {...rest} className={classes.grid + ' ' + className}>
      {children}
    </Grid>
  )
}
