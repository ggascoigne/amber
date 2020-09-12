import { Theme, Typography, makeStyles } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import createStyles from '@material-ui/core/styles/createStyles'
import type { GameArray, SlotFieldsFragment } from 'client'
import React from 'react'
import { useHistory, useLocation } from 'react-router'
import { useUrlSourceState } from 'utils'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      paddingTop: 5,
      paddingBottom: 5,
    },
  })
)

interface GameListIndex {
  year: number
  slot: SlotFieldsFragment
  games: GameArray
  onEnterGame?: any
}

export const GameListIndex: React.FC<GameListIndex> = ({ year, slot, games }) => {
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
        const slug = `/pastCons/${year}/${slot.id}/${game.id}`
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
