import { describe, test, expect } from 'vitest'

import { mergeGet } from './mergeGet'

describe('mergeGet', () => {
  const data = [
    {
      input: [{ defaults: { x: true } }, { defaults: { y: 'foo' } }, { defaults: { z: 123 } }],
      output: { x: true, y: 'foo', z: 123 },
    },
    {
      input: [{ defaults: { x: true, y: 'bar' } }, { defaults: { y: 'foo' } }, { defaults: { z: { a: 'a', b: 'b' } } }],
      output: { x: true, y: 'foo', z: { a: 'a', b: 'b' } },
    },
    {
      input: [
        { defaults: { x: true, y: 'bar' } },
        { defaults: { y: 'foo', z: { a: 'a', b: 'b' } } },
        { defaults: { z: { a: 'a2', c: 'c' } } },
      ],
      output: { x: true, y: 'foo', z: { a: 'a2', c: 'c' } },
    },
  ]

  data.forEach((run, index) => {
    test(`${index}`, () => {
      expect(mergeGet('defaults')(run.input)).toStrictEqual(run.output)
    })
  })
})
