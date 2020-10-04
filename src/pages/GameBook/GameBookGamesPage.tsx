import { GameListFull, GameListNavigator, Page } from 'components/Acnw'
import React from 'react'
import { useGameScroll } from 'utils'

export const GameBookGamesPage: React.FC = () => {
  const setNewUrl = useGameScroll()

  return (
    <Page>
      <GameListNavigator>
        {({ year, slot, games }) => <GameListFull year={year} slot={slot} games={games!} onEnterGame={setNewUrl} />}
      </GameListNavigator>
    </Page>
  )
}
