import { Game } from 'components/Acnw/Game'
import { GameQuery } from 'components/Acnw/GameQuery'
import { Page } from 'components/Acnw/Page'
import { SlotQuery } from 'components/Acnw/SlotQuery'
import { SlotSelector } from 'components/Acnw/SlotSelector'
import React from 'react'

const GamesBySlot = ({ slot, games }) => {
  return (
    <React.Fragment key={`slot_${slot.id}`}>
      {games.map(({ node: game }) => (
        <Game key={`game_${game.id}`} game={game} />
      ))}
    </React.Fragment>
  )
}

const PastConsPage = () => {
  const year = 2017
  return (
    <Page>
      <SlotQuery year={year}>
        {({ year, slots }) => (
          <SlotSelector slots={slots}>
            {slot => (
              <GameQuery year={year} slot={slot}>
                {({ year, slot, games }) => <GamesBySlot slot={slot} games={games} />}
              </GameQuery>
            )}
          </SlotSelector>
        )}
      </SlotQuery>
    </Page>
  )
}

export default PastConsPage
