import React from 'react'

import NavigationIcon from '@mui/icons-material/Navigation'
import { ExpandingFab, Page } from 'ui'

import { GameListFull, GameListNavigator } from '../../components/GameList'
import { useGameScroll, useGameUrl } from '../../utils'

const gotoTop = () => {
  window.scrollTo(0, 0)
}

const GameBookGamesPage: React.FC = () => {
  const setNewUrl = useGameScroll()
  const { year } = useGameUrl()

  return (
    <Page title={`Game Book ${year}`}>
      <ExpandingFab label='Goto Top' show onClick={gotoTop}>
        <NavigationIcon />
      </ExpandingFab>
      <div>
        <GameListNavigator>
          {/* eslint-disable-next-line @typescript-eslint/no-shadow */}
          {({ year, slot, games }) => <GameListFull year={year} slot={slot} games={games!} onEnterGame={setNewUrl} />}
        </GameListNavigator>
      </div>
    </Page>
  )
}

export default GameBookGamesPage
