export const range = (stop: number, start = 0, step = 1): Array<number> =>
  Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step)

// alternate version using iterators, sadly without map etc. on iterators this is far less useful than you'd hope.
export const range2 = (end: number, start = 0, step = 1) => {
  function* generateRange() {
    let x = start - step
    while (x < end - step) yield (x += step)
  }
  return {
    [Symbol.iterator]: generateRange,
  }
}
