import { NextApiRequest, NextApiResponse } from 'next'

import { stripePublishableKey } from '../constants'
import { handleError } from '../handleError'

// /api/getStripeConfig
// auth token: not required
// body: {}

export const getStripeConfigHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const baseUrl = process.env.VERCEL_URL?.startsWith('http')
    ? process.env.VERCEL_URL
    : `https://${process.env.VERCEL_URL}`

  try {
    res.send({
      publishableKey: stripePublishableKey,
      baseUrl,
    })
  } catch (err) {
    handleError(err, res)
  }
}
