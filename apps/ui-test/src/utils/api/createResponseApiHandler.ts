import type { RequestTypes } from './api'
import { getResponse } from './api'

const getPath = (p: string) => p.replace(/^\//, '')

export function createResponseApiHandler<ApiRequest>({ method, path, requestSchema }: RequestTypes<ApiRequest>): (
  data: ApiRequest,
  options?: {
    headers?: Record<string, string>
  },
) => Promise<Response> {
  return async (requestData: ApiRequest, options = {}) =>
    getResponse({
      method,
      path: getPath(path),
      requestSchema,
      requestData,
      options,
      prefixUrl: process.env.NEXT_PUBLIC_BASE_URL ?? '',
    })
}
