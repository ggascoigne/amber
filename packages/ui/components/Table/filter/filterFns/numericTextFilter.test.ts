import { describe, expect, test } from 'vitest'

import { numericTextFilter } from './numericTextFilter'

const matches = (dataValue: unknown, filterValue: unknown) =>
  numericTextFilter.filter(dataValue, filterValue, undefined as never, '')

describe('numericTextFilter', () => {
  test.each([
    [10, '> 5', true],
    [5, '> 5', false],
    [5, '>= 5', true],
    ['12', '< 20', true],
    [5, '!= 5', false],
    [12, '12', true],
    ['not-a-number', '> 1', false],
  ])('matches %p against %p', (dataValue, filterValue, expected) => {
    expect(matches(dataValue, filterValue)).toBe(expected)
  })

  test('keeps empty filters behaviorally neutral and removable', () => {
    expect(matches(12, '   ')).toBe(true)
    expect(numericTextFilter.autoRemove?.('   ')).toBe(true)
  })
})
