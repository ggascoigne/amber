// eslint-disable-next-line import/no-unresolved
import { DateTime } from 'luxon'

import { getSlotDescription, SlotConfiguration, SlotFormat } from './slotTimes'

const pdxDate = ({ year, month, day }: { year: number; month: number; day: number }) =>
  DateTime.fromObject({ year, month, day }, { zone: 'America/Los_Angeles' })

// note that specifying the time zone is important otherwise when you try and display the times in a different tz, it all screws up
const startDates: Record<number, { date: DateTime; virtual: boolean; slots: number; skippedSlots?: Array<number> }> = {
  2020: { date: pdxDate({ year: 2020, month: 11, day: 5 }), virtual: true, slots: 7 },
}

export const configuration: SlotConfiguration = {
  startDates,
  year: 2020,
  virtual: true,
  numberOfSlots: 7,
}

describe('slot times', () => {
  const data = [
    {
      input: getSlotDescription(configuration, {
        year: 2020,
        slot: 1,
        local: true,
      }),
      output: 'Slot 1 Thu, Nov 5, 11:00 am to 3:00 pm PST',
    },
    {
      input: getSlotDescription(configuration, {
        year: 2020,
        slot: 1,
        local: true,
        altFormat: SlotFormat.ALT,
      }),
      output: 'Thursday Slot 1: 11:00 am to 3:00 pm PST',
    },
    {
      input: getSlotDescription(configuration, {
        year: 2020,
        slot: 1,
        local: true,
        altFormat: SlotFormat.ALT_SHORT,
      }),
      output: 'Thursday 11:00 am to 3:00 pm PST',
    },
    {
      input: getSlotDescription(configuration, {
        year: 2020,
        slot: 1,
        local: true,
        altFormat: SlotFormat.SHORT_NO_TZ,
      }),
      output: 'Thursday 11:00 am to 3:00 pm',
    },
    {
      input: getSlotDescription(configuration, {
        year: 2020,
        slot: 1,
        local: true,
        altFormat: SlotFormat.TINY,
      }),
      output: 'Thu 11:00 am to 3:00 pm',
    },
    {
      input: getSlotDescription(configuration, {
        year: 2020,
        slot: 1,
        local: true,
        altFormat: SlotFormat.SHORT,
      }),
      output: 'Slot 1: Thu 11:00 am to 3:00 pm PST',
    },
    {
      input: getSlotDescription(configuration, {
        year: 2020,
        slot: 2,
        local: true,
      }),
      output: 'Slot 2 Fri, Nov 6, 9:00 am to 1:00 pm PST',
    },
    {
      input: getSlotDescription(configuration, {
        year: 2020,
        slot: 3,
        local: true,
      }),
      output: 'Slot 3 Fri, Nov 6, 2:30 pm to 6:30 pm PST',
    },
  ]

  data.forEach((run, index) => {
    test(`${index}`, () => {
      expect(run.input).toBe(run.output)
    })
  })
})
