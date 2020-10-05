import type { GameArray } from 'client'
import { GameCard, GameCardChild } from 'components/Acnw'
import React, { useEffect } from 'react'
import { useScrollToHash, useUrlSourceState } from 'utils'

export interface MatchParams {
  year: string
  slot?: string
}

interface GameListFull {
  year: number
  slot: number
  games: GameArray
  onEnterGame: any
  selectionComponent?: (props: GameCardChild) => React.ReactNode
}

export const GameListFull: React.FC<GameListFull> = ({
  year,
  slot: slotInput,
  games,
  onEnterGame,
  selectionComponent,
}) => {
  const setUrlSource = useUrlSourceState((state) => state.setUrlSource)
  const hasEnterGame = !!onEnterGame
  const firstGameId = games?.[0]?.node?.id
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
            selectionComponent={selectionComponent}
          />
        ) : null
      )}
    </React.Fragment>
  )
}
