import React from 'react'

import { Grid } from '@mui/material'
import type { GridProps } from '@mui/material/Grid'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => ({
  grid: {
    width: 'auto',
  },
}))

interface GridContainerProps extends GridProps {
  className?: string
}

export const GridContainer: React.FC<GridContainerProps> = ({ children, className = '', ...rest }) => {
  const { classes } = useStyles()
  return (
    <Grid container {...rest} className={`${classes.grid} ${className}`}>
      {children}
    </Grid>
  )
}
