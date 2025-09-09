import React from 'react'

import { GameArray } from '@amber/client'
import { Typography } from '@mui/material'
import List from '@mui/material/List'

import { useUrlSource } from '../../utils'
import { ListItemLink } from '../Navigation'
import { GameDecorator, GameDecoratorParams } from '../types'

interface GameListIndexProps {
  year: number
  slot: number
  games: GameArray
  slugPrefix: string
  onEnterGame?: any
  decorator?: (props: GameDecorator) => React.ReactNode
  decoratorParams?: GameDecoratorParams
}

export const GameListIndex = ({ year, slot, games, slugPrefix, decorator, decoratorParams }: GameListIndexProps) => {
  const [urlSource] = useUrlSource()
  return (
    <List>
      {games.map((game) => {
        if (!game) {
          return null
        }
        const selectionKey = `${year}/${slot}/${game.id}`
        const slug = `/${slugPrefix}/${year}/${slot}`
        return (
          <ListItemLink
            key={game.id}
            style={{ paddingTop: 5, paddingBottom: 5 }}
            sx={{ color: 'primary.main' }}
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
