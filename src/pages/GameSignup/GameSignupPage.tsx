import { GameArray } from 'client'
import { GameCardChild, GameListFull, GameListNavigator, Page } from 'components/Acnw'
import React from 'react'
import { useGameScroll } from 'utils'

interface GameListFull {
  year: number
  slot: number
  games: GameArray
  onEnterGame?: any
}

export const GameChoiceSelector: React.FC<GameCardChild> = ({ year, slot, gameId }) => (
  <>
    {year}/{slot}/{gameId}
  </>
)

export const GameSignupPage: React.FC = () => {
  const setNewUrl = useGameScroll()
  return (
    <Page>
      <GameListNavigator name='page'>
        {({ year, slot, games }) => (
          <GameListFull
            year={year}
            slot={slot}
            games={games!}
            onEnterGame={setNewUrl}
            selectionComponent={GameChoiceSelector}
          />
        )}
      </GameListNavigator>
    </Page>
  )
}

// @ts-ignore
GameSignupPage.whyDidYouRender = true
