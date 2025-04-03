import React from 'react'

import { Loader } from 'ui'

import { GameArray, useGraphQL, GetGamesBySlotDocument } from '../../client-graphql'
import { TransportError } from '../TransportError'

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
  const { error, data } = useGraphQL(GetGamesBySlotDocument, {
    year,
    slotId: slot,
  })
  if (error) {
    return <TransportError error={error} />
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
