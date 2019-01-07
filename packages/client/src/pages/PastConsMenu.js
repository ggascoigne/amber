import React from 'react'
import { GameFilterQuery } from 'client/resolvers/gameFilter'

export const PastConsMenu = () => {
  return <GameFilterQuery>{({ year, slot }) => `Test Menu: ${year} ${slot}`}</GameFilterQuery>
}
