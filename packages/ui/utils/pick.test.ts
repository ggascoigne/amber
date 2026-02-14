import { test, expect } from 'vitest'

import { omit, pick } from './pick'

const person = {
  name: 'Jeff',
  dog: 'Daffodil',
  cat: 'Phoebe',
}

test('pick', () => {
  expect(pick(person, 'name', 'dog')).toStrictEqual({
    name: 'Jeff',
    dog: 'Daffodil',
  })
})

test('omit', () => {
  expect(omit(person, 'dog')).toStrictEqual({
    name: 'Jeff',
    cat: 'Phoebe',
  })
})
