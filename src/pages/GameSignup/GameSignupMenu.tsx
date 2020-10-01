import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { GameListNavigator } from 'components/Acnw/GameList'
import { ListItemLink } from 'components/Acnw/Navigation'
import React from 'react'
import { useHistory, useLocation } from 'react-router'
import { useGameFilterState, useUrlSourceState } from 'utils'

import { GameArray, SlotFieldsFragment } from '../../client'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontSize: '1.125rem',
      paddingTop: 6,
      paddingLeft: 5,
      [theme.breakpoints.up('sm')]: {
        paddingRight: 20,
      },
    },
    listItem: {
      paddingTop: 5,
      paddingBottom: 5,
    },
  })
)

export const GameSignupMenu: React.FC = () => {
  const classes = useStyles()
  const { year, slotId } = useGameFilterState((state) => state.gameFilter)

  return (
    <>
      <List>
        <ListItemLink button to='/'>
          <ListItemIcon>
            <ArrowBackIcon />
          </ListItemIcon>
          <ListItemText primary='Main Menu' />
        </ListItemLink>
      </List>
      <Divider />
      <Typography variant='h4' className={classes.title}>
        Game Signup {year}
      </Typography>
      <GameListNavigator small year={year} slotIdStr={`${slotId}`}>
        {({ year, slot, games }) => <GameListIndex year={year} slot={slot} games={games!} />}
      </GameListNavigator>
    </>
  )
}

interface GameListIndex {
  year: number
  slot: SlotFieldsFragment
  games: GameArray
  onEnterGame?: any
}

const GameListIndex: React.FC<GameListIndex> = ({ year, slot, games }) => {
  const classes = useStyles()
  const history = useHistory()
  const location = useLocation()
  const setUrlSource = useUrlSourceState((state) => state.setUrlSource)
  return (
    <List>
      {games.map(({ node: game }) => {
        if (!game) {
          return null
        }
        const slug = `/game-signup/${year}/${slot.id}/${game.id}`
        return (
          <ListItem
            key={game.id}
            button
            className={classes.listItem}
            selected={slug === location.pathname}
            onClick={async () => {
              await setUrlSource({ source: 'jump', url: slug })
              return history.replace(slug)
            }}
          >
            <Typography variant='body1' noWrap>
              {game.name}
            </Typography>
          </ListItem>
        )
      })}
    </List>
  )
}
