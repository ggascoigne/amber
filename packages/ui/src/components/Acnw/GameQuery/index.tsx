import { GameFieldsFragment, GameGmsFragment, SlotFieldsFragment, useGetGamesBySlotQuery } from 'client'
import React from 'react'

import { Edges } from '../../../utils/ts-utils'
import { GraphQLError } from '../GraphQLError'
import { Loader } from '../Loader'

export interface GameQueryChild {
  year: number
  slot: SlotFieldsFragment
  games?: Edges<GameFieldsFragment & GameGmsFragment>
}

interface GameQuery {
  year: number
  slot: SlotFieldsFragment

  children(props: GameQueryChild): React.ReactNode
}

export const GameQuery: React.FC<GameQuery> = ({ year, slot, children }) => {
  const { loading, error, data } = useGetGamesBySlotQuery({ variables: { year, slotId: slot.id } })
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
