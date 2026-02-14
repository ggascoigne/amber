import { env } from '@amber/environment'
import type { NextApiRequest, NextApiResponse } from 'next'

import { handleError } from '../handleError'

// /api/getStripeConfig
// auth token: not required
// body: {}

export const getStripeConfigHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const baseUrl = env.VERCEL_URL?.startsWith('http') ? env.VERCEL_URL : `https://${env.VERCEL_URL}`

  try {
    res.send({
      publishableKey: env.STRIPE_PUBLISHABLE_KEY,
      baseUrl,
    })
  } catch (err) {
    handleError(err, res)
  }
}
