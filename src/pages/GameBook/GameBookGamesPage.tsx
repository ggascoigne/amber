import { MatchParams, Page } from 'components/Acnw'
import React from 'react'
import { useParams } from 'react-router'
import { configuration, useGameScroll } from 'utils'

import { GameBookPageGameList } from './GameBookPageGameList'

export const GameBookGamesPage: React.FC = () => {
  const setNewUrl = useGameScroll()
  const { year: yearStr, slot: slotIdStr } = useParams<MatchParams>()
  const year = yearStr ? parseInt(yearStr) : configuration.year

  return (
    <Page>
      <GameBookPageGameList year={year} slotIdStr={slotIdStr || '1'} onEnterGame={setNewUrl} />
    </Page>
  )
}
