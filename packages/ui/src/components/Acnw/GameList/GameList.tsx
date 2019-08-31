import { GetSlots_slots_nodes } from '__generated__/GetSlots'
import { GameQuery, GameQueryChild } from 'components/Acnw/GameQuery'
import { SlotQuery } from 'components/Acnw/SlotQuery'
import { SlotSelector } from 'components/Acnw/SlotSelector'
import React from 'react'

interface GameList {
  small?: boolean
  year: number
  slotIdStr: string

  children(props: GameQueryChild): React.ReactNode
}

export const GameList: React.FC<GameList> = ({ small = false, year, slotIdStr, children }) => {
  return (
    <SlotQuery year={year}>
      {({ year, slots }) => (
        <SlotSelector small={small} year={year} slots={slots} selectedSlotId={parseInt(slotIdStr)}>
          {(slot: GetSlots_slots_nodes) => (
            <GameQuery year={year} slot={slot}>
              {({ year, slot, games }) => children({ year, slot, games })}
            </GameQuery>
          )}
        </SlotSelector>
      )}
    </SlotQuery>
  )
}
