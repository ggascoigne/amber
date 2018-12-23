import Typography from '@material-ui/core/Typography'
import ErrorOutline from '@material-ui/icons/ErrorOutline'
import React from 'react'
import GridContainer from '../components/Grid/GridContainer'
import GridItem from '../components/Grid/GridItem'

const NotFound = () => (
  <GridContainer>
    <GridItem xs={1} sm={1} md={1}>
      <ErrorOutline style={{ fontSize: '48pt' }} />
    </GridItem>
    <GridItem xs={8} sm={8} md={8}>
      <Typography variant='h1' gutterBottom component='h1'>
        Page Not Found
      </Typography>
    </GridItem>
  </GridContainer>
)

export default NotFound
