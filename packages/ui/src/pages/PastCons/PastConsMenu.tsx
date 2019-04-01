import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { WithGameFilter, withGameFilter } from 'client/resolvers/gameFilter'
import { GameList, GameListIndex } from 'components/Acnw/GameList'
import React from 'react'
import { Link } from 'react-router-dom'
import compose from 'recompose/compose'

const styles = (theme: Theme) =>
  createStyles({
    title: {
      fontSize: '1.125rem',
      paddingTop: 6,
      paddingLeft: 5,
      [theme.breakpoints.up('sm')]: {
        paddingRight: 20
      }
    }
  })

interface IPastConsMenu extends WithStyles<typeof styles>, WithGameFilter {}

export const _PastConsMenu: React.FC<IPastConsMenu> = ({ classes, gameFilter: { year, slot: filterSlot } }) => {
  return (
    <>
      <List>
        <ListItem button component={() => <Link to='/pastCons' />}>
          <ListItemIcon>
            <ArrowBackIcon />
          </ListItemIcon>
          <ListItemText primary={'Past Cons'} />
        </ListItem>
      </List>
      <Divider />
      <Typography variant='h4' className={classes.title}>
        Games for {year}
      </Typography>
      <GameList small year={year} slotIdStr={`${filterSlot.id}`}>
        {({ year, slot, games }) => <GameListIndex year={year} slot={slot} games={games} />}
      </GameList>
    </>
  )
}

export const PastConsMenu = compose<IPastConsMenu, {}>(
  withGameFilter,
  withStyles(styles, { withTheme: true })
)(_PastConsMenu)
