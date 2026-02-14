import { auth0 } from '@amber/server/src/auth/auth0'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  return auth0.middleware(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
}
