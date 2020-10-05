import { GameListFull, GameListNavigator, Page } from 'components/Acnw'
import React from 'react'
import { useGameScroll, useGameUrl } from 'utils'

import { GameChoiceSelector } from './GameChoiceSelector'
import { SignupInstructions } from './SignupInstructions'

export const GameSignupPage: React.FC = () => {
  const { slot, year } = useGameUrl()
  const setNewUrl = useGameScroll()
  return (
    <Page>
      {slot === 1 && <SignupInstructions year={year} />}
      <GameListNavigator name='page' selectQuery>
        {({ year, slot, games }) => (
          <>
            <GameListFull
              year={year}
              slot={slot}
              games={games!}
              onEnterGame={setNewUrl}
              selectionComponent={GameChoiceSelector}
            />
          </>
        )}
      </GameListNavigator>
    </Page>
  )
}
