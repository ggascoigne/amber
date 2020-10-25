import { GameArray, useGetGamesBySlotQuery } from 'client'
import React from 'react'

import { GraphQLError } from '../GraphQLError'
import { Loader } from '../Loader'

export interface GameQueryChild {
  year: number
  slot: number
  games?: GameArray
}

interface GameQueryProps {
  year: number
  slot: number
  children: (props: GameQueryChild) => React.ReactNode
}

export const GameQuery: React.FC<GameQueryProps> = ({ year, slot, children }) => {
  const { error, data } = useGetGamesBySlotQuery({
    variables: { year, slotId: slot },
    fetchPolicy: 'cache-and-network',
  })
  if (error) {
    return <GraphQLError error={error} />
  }
  if (!data) {
    return <Loader />
  }
  return (
    <React.Fragment key={`slot_${slot}`}>
      {data && children && children({ year, slot, games: data?.games?.edges ?? undefined })}
    </React.Fragment>
  )
}
