import type { GameArray, SlotFieldsFragment } from 'client'
import { GameCard } from 'components/Acnw/GameCard'
import React, { useEffect } from 'react'
import { useParams } from 'react-router'

export interface MatchParams {
  year: string
  slot?: string
  game?: string
}

interface GameListFull {
  year: number
  slot: SlotFieldsFragment
  games: GameArray
  onEnterGame: any
}

export const GameListFull: React.FC<GameListFull> = ({ year, slot, games, onEnterGame }) => {
  const firstGameId = games?.[0]?.node?.id
  const { year: yearStr, slot: slotIdStr } = useParams<MatchParams>()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (firstGameId && (slotIdStr !== `${slot.id}` || year !== parseInt(yearStr))) {
      onEnterGame(`/game-book/${year}/${slot.id}/${firstGameId}`)
    }
  }, [slotIdStr, firstGameId, onEnterGame, slot.id, year, yearStr])

  return (
    <React.Fragment key={`slot_${slot.id}`}>
      {games.map(({ node: game }) =>
        game ? (
          <GameCard
            key={`game_${game.id}`}
            year={year}
            slot={slot}
            game={game}
            onEnter={() => onEnterGame(`/game-book/${year}/${slot.id}/${game.id}`)}
          />
        ) : null
      )}
    </React.Fragment>
  )
}
