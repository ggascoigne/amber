import React from 'react'

import { GraphQLError, Loader } from 'ui'

import { GameArray, useGraphQL, GetGamesBySlotForSignupDocument } from '../../client'

interface GameQueryChild {
  year: number
  slot: number
  games?: GameArray
}

interface GameQueryProps {
  year: number
  slot: number
  children: (props: GameQueryChild) => React.ReactNode
}

export const GameSelectionQuery: React.FC<GameQueryProps> = ({ year, slot, children }) => {
  const { error, data } = useGraphQL(GetGamesBySlotForSignupDocument, {
    year,
    slotId: slot,
  })
  if (error) {
    return <GraphQLError error={error} />
  }
  if (!data) {
    return <Loader />
  }
  return (
    <React.Fragment key={`slot_${slot}`}>
      {children({ year, slot, games: data.games?.edges ?? undefined })}
    </React.Fragment>
  )
}
