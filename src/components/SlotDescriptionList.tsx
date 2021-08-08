import React from 'react'

import { SlotFormat, configuration, getSlotDescription, range } from '../utils'

export const SlotDescriptionList: React.FC = () => (
  <ul>
    {range(7).map((i) => (
      <li key={i}>
        {getSlotDescription({
          year: configuration.year,
          slot: i + 1,
          local: false,
          altFormat: SlotFormat.ALT,
        })}
      </li>
    ))}
  </ul>
)
