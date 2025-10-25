import qs from 'qs'
import type { z } from 'zod'

export const range = (stop: number, start = 0, step = 1): Array<number> =>
  Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step)

export const getQueryParamsBySchema = <O>(searchParams: URLSearchParams, schema: z.ZodType<O>) => {
  const qsParams = qs.parse(searchParams.toString())
  return schema.parse(qsParams) as O
}
