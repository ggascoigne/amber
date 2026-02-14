import { NextResponse, type NextRequest } from 'next/server'

import { fakeSessionCookieName } from './session'

export const handleLogout = async (req: NextRequest) => {
  const response = NextResponse.redirect(new URL('/', req.url))
  const cookie = `${fakeSessionCookieName}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`
  response.headers.append('Set-Cookie', cookie)
  return response
}
