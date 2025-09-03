import { rolesHandler } from '@amber/api'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  rolesHandler(req, res)
}
