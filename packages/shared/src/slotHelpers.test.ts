import { DateTime } from 'luxon'
import { describe, expect, test } from 'vitest'

import { getSlotDescription, getSlotTimes, SlotFormat, slotDateTimePairsByCount } from './slotHelpers'
import type { SlotConfiguration } from './slotHelpers'

const pdxDate = ({ year, month, day }: { year: number; month: number; day: number }) =>
  DateTime.fromObject({ year, month, day }, { zone: 'America/Los_Angeles' })

const startDates: Record<number, { date: DateTime; virtual: boolean; slots: number }> = {
  2020: {
    date: pdxDate({ year: 2020, month: 11, day: 5 }),
    virtual: true,
    slots: 7,
  },
}

const configuration: SlotConfiguration = {
  startDates,
  year: 2020,
  virtual: true,
  numberOfSlots: 7,
}

describe('slot helpers', () => {
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

  test('slotDateTimePairsByCount matches configured slot times', () => {
    expect(slotDateTimePairsByCount(startDates[2020]!.date, 7, true)).toEqual(getSlotTimes(configuration, 2020))
  })
})
