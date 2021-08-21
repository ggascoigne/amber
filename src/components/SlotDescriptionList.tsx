import React from 'react'

import { SlotFormat, configuration, getSlotDescription, isNotPacificTime, range } from '../utils'

export const SlotDescriptionList: React.FC = () => {
  const displayLocal = isNotPacificTime() && configuration.virtual
  return (
    <ul>
      {range(7).map((i) => {
        if (configuration.skippedSlots?.includes(i + 1)) {
          return null
        }
        const description = displayLocal
          ? getSlotDescription({
              year: configuration.year,
              slot: i + 1,
              local: false,
              altFormat: SlotFormat.ALT,
            }) +
            ' / ' +
            getSlotDescription({
              year: configuration.year,
              slot: i + 1,
              local: displayLocal,
              altFormat: SlotFormat.ALT_SHORT,
            })
          : getSlotDescription({
              year: configuration.year,
              slot: i + 1,
              local: false,
              altFormat: SlotFormat.ALT,
            })
        return <li key={i}>{description}</li>
      })}
    </ul>
  )
}
