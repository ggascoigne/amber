import React from 'react'

import { ExpandingFab } from '@amber/ui'
import NavigationIcon from '@mui/icons-material/Navigation'

import { GameMasterSlotDecorator, useGameMasterChoiceIds } from './GameBookSlotDecorator'

import { Page } from '../../components'
import { GameListFull, GameListNavigator } from '../../components/GameList'
import { useGameScroll } from '../../utils/useGameScroll'
import { useGameUrl } from '../../utils/useGameUrl'

const gotoTop = () => {
  window.scrollTo(0, 0)
}

const broken = true

const GameBookGamesPage = () => {
  const setNewUrl = useGameScroll()
  const { year } = useGameUrl()
  const { gameIds: gmGameIds, slotIds: gmSlotIds } = useGameMasterChoiceIds()

  return (
    <Page title={`Game Book ${year}`}>
      {!broken && (
        <ExpandingFab label='Goto Top' show onClick={gotoTop}>
          <NavigationIcon />
        </ExpandingFab>
      )}
      <div>
        <GameListNavigator decorator={GameMasterSlotDecorator} decoratorParams={{ gmSlotIds }}>
          {/* eslint-disable-next-line @typescript-eslint/no-shadow */}
          {({ year, slot, games }) => (
            <GameListFull
              year={year}
              slot={slot}
              games={games!}
              onEnterGame={setNewUrl}
              isTitleEmphasized={({ game }) => gmGameIds.has(game.id)}
            />
          )}
        </GameListNavigator>
      </div>
    </Page>
  )
}

export default GameBookGamesPage
