import { GetSlots_slots_nodes } from '__generated__/GetSlots'
import { GameQuery, IGameQueryChild } from 'components/Acnw/GameQuery'
import { SlotQuery } from 'components/Acnw/SlotQuery'
import { SlotSelector } from 'components/Acnw/SlotSelector'
import React from 'react'

interface IGameList {
  small: boolean
  year: number
  slotIdStr: string

  children(props: IGameQueryChild): React.ReactNode
}

export const GameList = ({ small = false, year, slotIdStr, children }: IGameList) => {
  return (
    <SlotQuery year={year}>
      {({ year, slots }) => (
        <SlotSelector small={small} year={year} slots={slots} selectedSlotId={slotIdStr ? parseInt(slotIdStr) : null}>
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
