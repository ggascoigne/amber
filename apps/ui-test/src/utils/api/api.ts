import debug from 'debug'
import { compile, pathToRegexp } from 'path-to-regexp'
import qs from 'qs'
import type { z } from 'zod'
import { ZodError } from 'zod'

import type { HTTPMethod } from './constants'
import { HTTPError } from './HTTPError'
import { isEmpty } from './isEmpty'

const log = debug('api')

export type RequestTypes<ApiRequest> = {
  method: HTTPMethod
  path: string
  requestSchema: z.ZodType<ApiRequest>
}

export type ApiTypes<ApiResponse, ApiRequest, ResponseInput> = RequestTypes<ApiRequest> & {
  responseSchema: z.ZodType<ApiResponse, ResponseInput>
}

export type AppApiTypes<ApiRequest> = {
  requestData: ApiRequest
  options: {
    useBareUrl?: boolean
    headers?: Record<string, string>
  }
  prefixUrl?: string
}

export const cleanUrl = (url: string) => {
  const segments = url.split('/')

  const cleanedSegments = segments.reduce((result, segment) => {
    if (segment === '..') {
      result.pop()
    } else {
      result.push(segment)
    }
    return result
  }, [] as string[])

  return cleanedSegments.join('/')
}

export const buildUrl = (input: string, prefix?: string) => {
  let result
  if (prefix && input.startsWith('/')) {
    throw new Error('`input` must not begin with a slash when using `prefixUrl`')
  }
  if (prefix) {
    result = prefix.endsWith('/') ? `${prefix}${input}` : `${prefix}/${input}`
  } else {
    result = input
  }
  return cleanUrl(result)
}

const splitUrl = (url: string) => {
  // strip off scheme and domain name since pathToRegex can't cope with it
  const matchResult = /^(https?:\/\/[^/]+)(\/.*)/.exec(url)
  let strippedSection
  let path
  if (matchResult) {
    ;[, strippedSection, path] = matchResult
  } else {
    strippedSection = ''
    path = url
  }
  return [strippedSection, path]
}

const handleSearchParams = (url: string, params: any) => {
  const [strippedSection, path] = splitUrl(url)

  // get set of placeholder values from the url and delete them from the params
  // only desired for the searchParams
  const { keys } = pathToRegexp(path)
  const newParams = { ...params }
  const pathParams = { ...params }
  keys.forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(params, key.name)) {
      throw new Error(`url ${url} requires a '${key.name}' parameter`)
    }
    delete newParams[key.name]
    const value = params[key.name]
    pathParams[key.name] = value === null || value === undefined ? value : String(value)
  })

  const toPath = compile(path)
  const withPlaceholders = toPath(pathParams)
  const searchParams = qs.stringify(newParams, {
    // arrayFormat: 'repeat',
  })
  const result = searchParams
    ? strippedSection + withPlaceholders.replace(/(?:\?.*?)?(?=#|$)/, `?${searchParams}`)
    : strippedSection + withPlaceholders
  log('%o', {
    url: result,
    queryObject: newParams,
    decodedQueryString: decodeURIComponent(searchParams),
  })
  return result
}

const handlePositionalParams = (url: string, params: any) => {
  const [strippedSection, path] = splitUrl(url)
  const { keys } = pathToRegexp(path)
  const pathParams = { ...params }
  keys.forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(params, key.name)) {
      throw new Error(`url ${url} requires a '${key.name}' parameter`)
    }
    const value = params[key.name]
    pathParams[key.name] = value === null || value === undefined ? value : String(value)
  })
  const toPath = compile(path)
  const withPlaceholders = toPath(pathParams)
  const result = strippedSection + withPlaceholders
  log('%o', {
    url: result,
  })
  return result
}

const buildRequest = ({
  headers: originalHeaders,
  path,
  prefixUrl,
  method,
  request,
}: {
  headers: Record<string, string>
  path: string
  prefixUrl?: string
  method: HTTPMethod
  request: any
}): Request => {
  const headers = new Headers(originalHeaders)

  let url = buildUrl(path, prefixUrl)
  const fetchOptions: RequestInit = {
    method,
    headers,
  }
  // we only support searchParams on gets
  if (method === 'GET') {
    url = isEmpty(request) ? url : handleSearchParams(url, request)
    if (!headers.get('Accept')) {
      headers.append('Accept', 'application/json')
    }
  } else if (request) {
    // everything else passes a payload in the request body
    url = handlePositionalParams(url, request)
    fetchOptions.body = JSON.stringify(request)
    headers.append('Content-Type', 'application/json')
  }

  return new Request(url, fetchOptions)
}

export const getResponse = async <ApiRequest>(
  params: RequestTypes<ApiRequest> & AppApiTypes<ApiRequest>,
): Promise<Response> => {
  const { method, path, requestSchema, requestData, options, prefixUrl } = params
  let request = requestData
  try {
    request = process.env.NODE_ENV === 'production' ? requestData : requestSchema.parse(requestData)
  } catch (error) {
    console.error('Error validating request for', path, requestData, error)
    return Promise.reject(error)
  }

  try {
    const req = buildRequest({
      headers: { ...options.headers },
      path,
      prefixUrl,
      method,
      request,
    })

    const result = await fetch(req)
      .then((res) => {
        if (!res.ok) {
          throw new HTTPError(res, req)
        }
        return res
      })
      .catch((error) => {
        console.warn(error)
        throw error
      })
    return result
  } catch (error) {
    return Promise.reject(error)
  }
}

export const apiHandler = async <ApiResponse, ApiRequest, ResponseInput>(
  params: ApiTypes<ApiResponse, ApiRequest, ResponseInput> & AppApiTypes<ApiRequest>,
): Promise<ApiResponse> => {
  const { path, responseSchema } = params
  try {
    const json = await getResponse(params)
      .then((res) => {
        if (res.headers.get('Content-Type')?.includes('application/json')) {
          return res.json()
        } else {
          console.warn('Expected application/json Content-Type header in response')
          return undefined
        }
      })
      .catch((error) => {
        console.warn(error)
        throw error
      })

    if (process.env.NODE_ENV === 'production') {
      responseSchema?.safeParseAsync(json).then((res) => {
        if (!res.success) {
          const err = new Error('API validation error')
          err.stack = res.error.message
          throw err
        }
      })

      return json as ApiResponse
    }
    try {
      return responseSchema.parse(json) as ApiResponse
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('Error validating the response for', path, json, error)
      }
      return await Promise.reject(error)
    }
  } catch (error) {
    return Promise.reject(error)
  }
}
