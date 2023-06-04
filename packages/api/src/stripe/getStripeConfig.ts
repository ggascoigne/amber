import { NextApiRequest, NextApiResponse } from 'next'

import { stripePublishableKey } from '../constants'
import { handleError } from '../handleError'

// /api/getStripeConfig
// auth token: not required
// body: {}

export const getStripeConfigRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    res.send({
      publishableKey: stripePublishableKey,
      baseUrl: process.env.VERCEL_URL,
    })
  } catch (err) {
    handleError(err, res)
  }
}
