export const range = (stop: number, start = 0, step = 1): Array<number> =>
  Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step)
