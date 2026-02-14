import { z } from 'zod'

export const HTTPMethods = ['GET', 'POST', 'PUT', 'DELETE'] as const
export type HTTPMethod = (typeof HTTPMethods)[number]
export const HTTPStatusOK = 200

export const emptySchema = z.object({})
export type EmptyRequest = z.infer<typeof emptySchema>
