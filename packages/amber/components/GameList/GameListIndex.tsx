import type React from 'react'

import type { GameArray } from '@amber/client'
import { Typography } from '@mui/material'
import List from '@mui/material/List'

import { useUrlSource } from '../../utils/useUrlSourceState'
import { ListItemLink } from '../Navigation'
import type { GameDecorator, GameDecoratorParams } from '../types'

interface GameListIndexProps {
  year: number
  slot: number
  games: GameArray
  slugPrefix: string
  onEnterGame?: any
  decorator?: (props: GameDecorator) => React.ReactNode
  decoratorParams?: GameDecoratorParams
  isTitleEmphasized?: (props: GameDecorator) => boolean
}

export const GameListIndex = ({
  year,
  slot,
  games,
  slugPrefix,
  decorator,
  decoratorParams,
  isTitleEmphasized,
}: GameListIndexProps) => {
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
            <Typography
              variant='body1'
              noWrap
              sx={{ fontWeight: isTitleEmphasized?.({ year, slot, game, ...decoratorParams }) ? 700 : 400 }}
            >
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
