import { Grid } from '@mui/material'
import type { GridProps } from '@mui/material/Grid'
import React from 'react'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => ({
  grid: {
    position: 'relative',
    width: '100%',
    minHeight: '1px',
    flexBasis: 'auto',
  },
}))

interface GridItemProps extends GridProps {
  className?: string
}

export const GridItem: React.FC<GridItemProps> = ({ children, className = '', ...rest }) => {
  const { classes } = useStyles()
  return (
    <Grid item {...rest} className={classes.grid + ' ' + className}>
      {children}
    </Grid>
  )
}
