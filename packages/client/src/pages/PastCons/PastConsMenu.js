import { withStyles } from '@material-ui/core'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { GameFilterQuery } from 'client/resolvers/gameFilter'
import { GameList } from 'components/Acnw/GameList/GameList'
import { GameListIndex } from 'components/Acnw/GameList/GameListIndex'
import React from 'react'
import { Link } from 'react-router-dom'
import compose from 'recompose/compose'

const styles = theme => ({
  title: {
    fontSize: '1.125rem',
    paddingTop: 6,
    paddingLeft: 5,
    [theme.breakpoints.up('sm')]: {
      paddingRight: 20
    }
  }
})

export const _PastConsMenu = ({ classes }) => {
  return (
    <>
      <List>
        <ListItem button component={Link} to={'/pastCons'}>
          <ListItemIcon>
            <ArrowBackIcon />
          </ListItemIcon>
          <ListItemText primary={'Past Cons'} />
        </ListItem>
      </List>
      <Divider />
      <GameFilterQuery>
        {({ year, slot: slotIdStr }) => (
          <>
            <Typography variant='h4' className={classes.title}>
              Games for {year}
            </Typography>
            <GameList small year={year} slotIdStr={slotIdStr}>
              {({ year, slot, games }) => <GameListIndex year={year} slot={slot} games={games} />}
            </GameList>
          </>
        )}
      </GameFilterQuery>
    </>
  )
}

export const PastConsMenu = compose(withStyles(styles, { withTheme: true }))(_PastConsMenu)
