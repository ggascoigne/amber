import type { GameArray } from 'client'
import React, { useEffect } from 'react'
import { useScrollToHash, useUrlSource } from 'utils'

import { GameCard } from '../GameCard'
import { GameDecorator, GameDecoratorParams } from '../types'

export interface MatchParams {
  year: string
  slot?: string
}

interface GameListFullProps {
  year: number
  slot: number
  games: GameArray
  onEnterGame: any
  decorator?: (props: GameDecorator) => React.ReactNode
  decoratorParams?: GameDecoratorParams
}

export const GameListFull: React.FC<GameListFullProps> = ({
  year,
  slot: slotInput,
  games,
  onEnterGame,
  decorator,
  decoratorParams,
}) => {
  const [_, setUrlSource] = useUrlSource()
  const hasEnterGame = !!onEnterGame
  const firstGameId = games[0]?.node?.id
  const slot = slotInput || 0
  const firstSlug = `${year}/${slot}/${firstGameId}`

  useScrollToHash()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (firstGameId && hasEnterGame) {
      setUrlSource({ source: 'scroll', url: firstSlug })
    }
  }, [firstGameId, firstSlug, hasEnterGame, setUrlSource])

  return (
    <React.Fragment key={`slot_${slot}`}>
      {games.map(({ node: game }) =>
        game ? (
          <GameCard
            key={`game_${game.id}`}
            year={year}
            slot={slot}
            game={game}
            onEnter={onEnterGame}
            decorator={decorator}
            decoratorParams={decoratorParams}
          />
        ) : null
      )}
    </React.Fragment>
  )
}
