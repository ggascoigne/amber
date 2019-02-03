import { GameQuery } from 'components/Acnw/GameQuery'
import { SlotQuery } from 'components/Acnw/SlotQuery'
import { SlotSelector } from 'components/Acnw/SlotSelector'
import React from 'react'

export const GameList = ({ small = false, year, slotIdStr, children }) => {
  return (
    <SlotQuery year={year}>
      {({ year, slots }) => (
        <SlotSelector small={small} year={year} slots={slots} selectedSlotId={slotIdStr ? parseInt(slotIdStr) : null}>
          {slot => (
            <GameQuery year={year} slot={slot}>
              {({ year, slot, games }) => children({ year, slot, games })}
            </GameQuery>
          )}
        </SlotSelector>
      )}
    </SlotQuery>
  )
}
