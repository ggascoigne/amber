import { GetGames_games_edges } from '__generated__/GetGames'
import { GetSlots_slots_nodes } from '__generated__/GetSlots'
import { useGameQuery } from 'client'
import React from 'react'

import { GraphQLError } from '../GraphQLError'
import { Loader } from '../Loader'

export interface GameQueryChild {
  year: number
  slot: GetSlots_slots_nodes
  games?: GetGames_games_edges[]
}

interface GameQuery {
  year: number
  slot: GetSlots_slots_nodes

  children(props: GameQueryChild): React.ReactNode
}

export const GameQuery: React.FC<GameQuery> = ({ year, slot, children }) => {
  const { loading, error, data } = useGameQuery({ year: year, slotId: slot.id })
  if (loading) {
    return <Loader />
  }
  if (error) {
    return <GraphQLError error={error} />
  }
  return (
    <React.Fragment key={`slot_${slot.id}`}>
      {data && children && children({ year, slot, games: data && data.games ? data.games.edges : undefined })}
    </React.Fragment>
  )
}
