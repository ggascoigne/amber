import type { output } from 'zod/mini'
import { object } from 'zod/mini'

export const HTTPMethods = ['GET', 'POST', 'PUT', 'DELETE'] as const
export type HTTPMethod = (typeof HTTPMethods)[number]
export const HTTPStatusOK = 200

export const emptySchema = object({})
export type EmptyRequest = output<typeof emptySchema>
