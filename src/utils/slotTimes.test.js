import { SlotFormat, getSlotDescription } from './slotTimes'

describe('slot times', () => {
  const data = [
    {
      input: getSlotDescription({
        year: 2020,
        slot: 1,
        local: true,
      }),
      output: 'Slot 1 Thu, Nov 5, 11:00 am to 3:00 pm PST',
    },
    {
      input: getSlotDescription({
        year: 2020,
        slot: 1,
        local: true,
        altFormat: SlotFormat.ALT,
      }),
      output: 'Thursday Slot 1: 11:00 am to 3:00 pm PST',
    },
    {
      input: getSlotDescription({
        year: 2020,
        slot: 1,
        local: true,
        altFormat: SlotFormat.SHORT,
      }),
      output: 'Slot 1: Thu 11:00 am to 3:00 pm PST',
    },
    {
      input: getSlotDescription({
        year: 2020,
        slot: 2,
        local: true,
      }),
      output: 'Slot 2 Fri, Nov 6, 9:00 am to 1:00 pm PST',
    },
    {
      input: getSlotDescription({
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
