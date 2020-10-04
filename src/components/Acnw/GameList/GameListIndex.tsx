import { Theme, Typography, makeStyles } from '@material-ui/core'
import List from '@material-ui/core/List'
import createStyles from '@material-ui/core/styles/createStyles'
import type { GameArray } from 'client'
import React from 'react'
import { useUrlSourceState } from 'utils'

import { ListItemLink } from '../Navigation'

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
  slot: number
  games: GameArray
  slugPrefix: string
  onEnterGame?: any
}

export const GameListIndex: React.FC<GameListIndex> = ({ year, slot, games, slugPrefix }) => {
  const classes = useStyles()
  const urlSource = useUrlSourceState((state) => state.urlSource)
  return (
    <List>
      {games.map(({ node: game }) => {
        if (!game) {
          return null
        }
        const selectionKey = `${year}/${slot}/${game.id}`
        const slug = `/${slugPrefix}/${year}/${slot}`
        return (
          <ListItemLink
            key={game.id}
            className={classes.listItem}
            selected={selectionKey === urlSource.url}
            button
            to={{ pathname: slug, hash: `#${game.id}`, state: { fromClick: true } }}
          >
            <Typography variant='body1' noWrap>
              {game.name}
            </Typography>
          </ListItemLink>
        )
      })}
    </List>
  )
}
