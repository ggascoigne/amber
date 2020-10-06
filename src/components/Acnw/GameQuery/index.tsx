import { GameArray, useGetGamesBySlotQuery } from 'client'
import React from 'react'

import { GraphQLError } from '../GraphQLError'
import { Loader } from '../Loader'

export interface GameQueryChild {
  year: number
  slot: number
  games?: GameArray
}

interface GameQuery {
  year: number
  slot: number
  children: (props: GameQueryChild) => React.ReactNode
}

export const GameQuery: React.FC<GameQuery> = ({ year, slot, children }) => {
  const { loading, error, data } = useGetGamesBySlotQuery({ variables: { year, slotId: slot } })
  if (error) {
    return <GraphQLError error={error} />
  }
  if (loading) {
    return <Loader />
  }
  return (
    <React.Fragment key={`slot_${slot}`}>
      {data && children && children({ year, slot, games: data?.games?.edges ?? undefined })}
    </React.Fragment>
  )
}
