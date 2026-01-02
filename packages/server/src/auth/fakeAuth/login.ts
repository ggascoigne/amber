import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { buildSessionCookie } from './session'

import { db } from '../../db'

const renderLoginForm = async (returnTo?: string) => {
  const users = await db.user.findMany({
    select: { email: true },
    orderBy: { email: 'asc' },
  })
  const options = users.map((u) => `<option value="${u.email}">${u.email}</option>`).join('')
  return `
    <html>
      <body>
        <h3>Test login</h3>
        <form method="post">
          <input type="hidden" name="returnTo" value="${returnTo ?? '/'}" />
          <label>Email:</label>
          <select name="email">${options}</select>
          <label>Password (ignored):</label>
          <input type="password" name="password" value="" />
          <input type="submit" value="Login" />
        </form>
      </body>
    </html>
  `
}

export const handleLogin = async (req: NextRequest) => {
  const { searchParams } = req.nextUrl

  if (req.method === 'GET') {
    const returnTo = searchParams.get('returnTo') ?? '/'
    const html = await renderLoginForm(returnTo)
    return new NextResponse(html, { headers: { 'content-type': 'text/html; charset=utf-8' } })
  }
  if (req.method !== 'POST') {
    return new NextResponse(null, { status: 405 })
  }
  const form = await req.formData()
  const email = (form.get('email') as string | null) ?? ''
  if (!email) {
    return NextResponse.json({ error: 'email required' }, { status: 400 })
  }

  const user = await db.user.findUnique({
    where: { email },
    include: { userRole: { include: { role: true } } },
  })
  if (!user) {
    return NextResponse.json({ error: 'invalid_user' }, { status: 401 })
  }

  const roles = user.userRole.map((r) => r.role.authority)
  const cookie = buildSessionCookie({ email: user.email, userId: user.id, roles })
  const returnTo = searchParams.get('returnTo') ?? '/'
  const response = NextResponse.redirect(new URL(returnTo, req.url))
  response.headers.append('Set-Cookie', cookie)
  return response
}
