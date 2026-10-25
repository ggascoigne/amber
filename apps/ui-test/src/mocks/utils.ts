import type { ZodMiniType } from 'zod/mini'
import qs from 'qs'
import { parse } from 'zod/mini'

export const range = (stop: number, start = 0, step = 1): Array<number> =>
  Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step)

export const getQueryParamsBySchema = <Output>(searchParams: URLSearchParams, schema: ZodMiniType<Output>) => {
  const qsParams = qs.parse(searchParams.toString())
  return parse(schema, qsParams)
}
