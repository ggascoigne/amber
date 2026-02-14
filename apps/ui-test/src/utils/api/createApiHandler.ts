import type { ApiTypes } from './api'
import { apiHandler } from './api'
import type { EmptyRequest } from './constants'

const getPath = (p: string) => p.replace(/^\//, '')

export function createApiHandler<ApiResponse, ApiRequest = EmptyRequest, ResponseInput = unknown>({
  method,
  path,
  requestSchema,
  responseSchema,
}: ApiTypes<ApiResponse, ApiRequest, ResponseInput>): (
  data: ApiRequest,
  options?: {
    headers?: Record<string, string>
  },
) => Promise<ApiResponse> {
  return async (requestData: ApiRequest, options = {}) =>
    apiHandler({
      method,
      path: getPath(path),
      requestSchema,
      responseSchema,
      requestData,
      options,
      prefixUrl: process.env.NEXT_PUBLIC_BASE_URL ?? '',
    })
}
