export const range = (stop: number, start = 0, step = 1): Array<number> =>
  Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step)

// alternate version using iterators, sadly without map etc. on iterators this is far less useful than you'd hope.
export const range2 = (stop: number, start = 0, step = 1) => {
  function* generateRange() {
    let x = start - step
    while (x < stop - step) yield (x += step)
  }
  return {
    [Symbol.iterator]: generateRange,
  }
}

// here's a more complete version of a lazy range generator that supports map, filter, and reduce
// honestly it's interesting, but I'm not sure that in most cases its worth the complexity over just
// using a regular array with map/filter/reduce.
export const lazyRange = (stop: number, start = 0, step = 1) => ({
  *[Symbol.iterator]() {
    for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
      yield i
    }
  },
  map<U>(fn: (val: number, idx: number) => U): Iterable<U> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    return {
      *[Symbol.iterator]() {
        let idx = 0
        // eslint-disable-next-line no-restricted-syntax
        for (const val of self) {
          yield fn(val, idx++)
        }
      },
    }
  },
  filter(predicate: (val: number, idx: number) => boolean): Iterable<number> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    return {
      *[Symbol.iterator]() {
        let idx = 0
        // eslint-disable-next-line no-restricted-syntax
        for (const val of self) {
          if (predicate(val, idx++)) yield val
        }
      },
    }
  },
  reduce<U>(reducer: (acc: U, val: number, idx: number) => U, initial: U): U {
    let acc = initial
    let idx = 0
    // eslint-disable-next-line no-restricted-syntax
    for (const val of this) {
      acc = reducer(acc, val, idx++)
    }
    return acc
  },
})

// Usage
// for (const v of lazyRange(7).map((v) => v + 1)) {
//   console.log(v)
// }
// const sum = lazyRange(5)
//   .filter(n => n % 2 === 1)
//   .reduce((acc, val) => acc + val, 0)

// console.log(sum) // 1 + 3 = 4

// also see https://github.com/GreLI/es-range-generator/blob/main/index.js
