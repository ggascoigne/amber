import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { WithGameFilter, withGameFilter } from 'client/resolvers/gameFilter'
import { GameList, GameListIndex } from 'components/Acnw/GameList'
import { ListItemLink } from 'components/Acnw/Navigation'
import React from 'react'
import compose from 'recompose/compose'

const useStyles = makeStyles((theme: Theme) =>
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
)

interface IPastConsMenu extends WithGameFilter {}

export const _PastConsMenu: React.FC<IPastConsMenu> = ({ gameFilter: { year, slot: filterSlot } }) => {
  const classes = useStyles()
  return (
    <>
      <List>
        <ListItemLink button to='/pastCons'>
          <ListItemIcon>
            <ArrowBackIcon />
          </ListItemIcon>
          <ListItemText primary={'Past Cons'} />
        </ListItemLink>
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

export const PastConsMenu = compose<IPastConsMenu, {}>(withGameFilter)(_PastConsMenu)
