import { env } from '@amber/environment'
import type { SessionData } from '@auth0/nextjs-auth0/types'
import type { NextApiRequest } from 'next'
import type { NextRequest } from 'next/server'

import { queryUserRoles } from '../apiAuthUtils'

export const fakeSessionCookieName = `${env.DB_ENV}-test-session-v4`

type StoredSession = {
  email: string
  roles?: Array<string>
  userId?: number
}

const getRolesAndId = async (email: string) => queryUserRoles(email)

export const serializeSession = (data: StoredSession) => {
  const json = JSON.stringify(data)
  return Buffer.from(json, 'utf8').toString('base64url')
}

const parseSession = (value?: string): StoredSession | undefined => {
  if (!value) return undefined
  try {
    const decoded = Buffer.from(value, 'base64url').toString('utf8')
    const parsed = JSON.parse(decoded) as StoredSession
    if (parsed?.email) return parsed
    return undefined
  } catch {
    return undefined
  }
}

const readCookie = (req?: NextApiRequest | NextRequest): StoredSession | undefined => {
  if (!req) return undefined
  const cookieHeader: string | undefined = (req as any)?.headers?.cookie ?? (req as NextRequest)?.headers?.get('cookie')
  if (!cookieHeader) return undefined
  const cookies = cookieHeader.split(';').map((p) => p.trim())
  const match = cookies.find((c) => c.startsWith(`${fakeSessionCookieName}=`))
  if (!match) return undefined
  const [, value] = match.split('=')
  return parseSession(value)
}

export const buildSession = async (req?: NextApiRequest | NextRequest): Promise<SessionData | null> => {
  const cookieSession = readCookie(req)
  const email = cookieSession?.email
  if (!email) return Promise.resolve(null)

  const { userId, roles } = (await getRolesAndId(email)) ?? {}
  const user: SessionData['user'] & { userId?: number; roles?: Array<string> } = {
    email,
    email_verified: true,
    sub: `dev|${email}`,
    userId,
    roles: cookieSession?.roles ?? roles,
  }
  return { user } as any as SessionData
}

export const buildSessionCookie = (data: StoredSession) =>
  `${fakeSessionCookieName}=${serializeSession(data)}; Path=/; HttpOnly; SameSite=Lax`
