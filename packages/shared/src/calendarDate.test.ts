import { describe, expect, it } from 'vitest'

import { normalizeCalendarDateForTimeZone } from './calendarDate'

describe('normalizeCalendarDateForTimeZone', () => {
  it('persists a browser-selected calendar date at midnight in the venue time zone', () => {
    const easternBrowserMidnight = new Date('2024-11-06T05:00:00.000Z')

    expect(normalizeCalendarDateForTimeZone(easternBrowserMidnight, 'America/Los_Angeles').toISOString()).toBe(
      '2024-11-06T08:00:00.000Z',
    )
  })
})
