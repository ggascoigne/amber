import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { buildSession } from './session'

export const handleProfile = async (req: NextRequest) => {
  const session = await buildSession(req)
  if (!session) {
    return NextResponse.json({ error: 'not_authenticated' }, { status: 401 })
  }
  return NextResponse.json(session.user)
}
