import { validatePasswordHandler } from '@amber/api'
import type { NextApiRequest, NextApiResponse } from 'next'

// /api/validatePassword
// auth token: required
// body: { password: string }

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  validatePasswordHandler(req, res)
}
