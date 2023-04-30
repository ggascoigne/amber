import React from 'react'

import { range } from 'ui'

import { getSlotDescription, isNotPacificTime, SlotFormat, useConfiguration } from '../utils'

export const SlotDescriptionList: React.FC = () => {
  const configuration = useConfiguration()
  const displayLocal = isNotPacificTime(configuration) && configuration.virtual
  return (
    <ul>
      {range(configuration.numberOfSlots).map((i) => {
        const description = displayLocal
          ? `${getSlotDescription(configuration, {
              year: configuration.year,
              slot: i + 1,
              local: false,
              altFormat: SlotFormat.ALT,
            })} / ${getSlotDescription(configuration, {
              year: configuration.year,
              slot: i + 1,
              local: displayLocal,
              altFormat: SlotFormat.ALT_SHORT,
            })}`
          : getSlotDescription(configuration, {
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
