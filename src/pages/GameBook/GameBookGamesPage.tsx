import NavigationIcon from '@material-ui/icons/Navigation'
import React from 'react'
import { useGameScroll, useGameUrl } from 'utils'

import { ExpandingFab } from '../../components/ExpandingFab'
import { GameListFull, GameListNavigator } from '../../components/GameList'
import { Page } from '../../components/Page'

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
          {({ year, slot, games }) => <GameListFull year={year} slot={slot} games={games!} onEnterGame={setNewUrl} />}
        </GameListNavigator>
      </div>
    </Page>
  )
}

export default GameBookGamesPage
