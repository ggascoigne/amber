import React from 'react'

import { GameArray, useTRPC } from '@amber/client'
import { useQuery } from '@tanstack/react-query'
import { Loader } from 'ui'

import { TransportError } from '../TransportError'

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

export const GameSelectionQuery = ({ year, slot, children }: GameQueryProps) => {
  const trpc = useTRPC()
  const { error, data } = useQuery(
    trpc.games.getGamesBySlotForSignup.queryOptions({
      year,
      slotId: slot,
    }),
  )
  if (error) {
    return <TransportError error={error} />
  }
  if (!data) {
    return <Loader />
  }
  return <React.Fragment key={`slot_${slot}`}>{children({ year, slot, games: data })}</React.Fragment>
}
