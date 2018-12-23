import withStyles from '@material-ui/core/styles/withStyles'
import React from 'react'
import GridContainer from '../Grid/GridContainer'
import GridItem from '../Grid/GridItem'

const styles = {
  banner: {
    'max-width': '100%',
    'min-width': 300,
    width: 'auto',
    height: 'auto'
  }
}

export const BannerImage = withStyles(styles)(props => {
  const { classes } = props
  return (
    <GridContainer justify='center'>
      <GridItem xs={12} sm={12} md={4}>
        <img alt='Ambercon NW' src={require('../../assets/Banner2017.png')} className={classes.banner} />
      </GridItem>
    </GridContainer>
  )
})
