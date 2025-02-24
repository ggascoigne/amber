import { describe, test, expect } from 'vitest'
import { getOrdinalWord } from './ordinal'

describe('ordinals', () => {
  const data = [
    { input: 0, output: '0' },
    { input: 100, output: '100' },
    { input: 1, output: 'first' },
    { input: 10, output: 'tenth' },
    { input: 19, output: 'nineteenth' },
    { input: 20, output: 'twentieth' },
    { input: 40, output: 'fortieth' },
    { input: 21, output: 'twenty-first' },
    { input: 34, output: 'thirty-fourth' },
    { input: 78, output: 'seventy-eighth' },
    { input: 90, output: 'ninetieth' },
  ]

  data.forEach((run, index) => {
    test(`${index}`, () => {
      expect(getOrdinalWord(run.input)).toBe(run.output)
    })
  })
})
