import React from 'react'

import { Theme, Typography } from '@mui/material'
import List from '@mui/material/List'
import { makeStyles } from 'tss-react/mui'

import type { GameArray } from '../../client-graphql'
import { useUrlSource } from '../../utils'
import { ListItemLink } from '../Navigation'
import { GameDecorator, GameDecoratorParams } from '../types'

const useStyles = makeStyles()((_theme: Theme) => ({
  listItem: {
    paddingTop: 5,
    paddingBottom: 5,
  },
}))

interface GameListIndexProps {
  year: number
  slot: number
  games: GameArray
  slugPrefix: string
  onEnterGame?: any
  decorator?: (props: GameDecorator) => React.ReactNode
  decoratorParams?: GameDecoratorParams
}

export const GameListIndex: React.FC<GameListIndexProps> = ({
  year,
  slot,
  games,
  slugPrefix,
  decorator,
  decoratorParams,
}) => {
  const { classes } = useStyles()
  const [urlSource] = useUrlSource()
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
            href={{ pathname: slug, hash: `#${game.id}` }}
          >
            <Typography variant='body1' noWrap>
              {game.name}
            </Typography>
            <div style={{ flex: 1 }} />
            {decorator?.({ year, slot, game, ...decoratorParams })}
          </ListItemLink>
        )
      })}
    </List>
  )
}
