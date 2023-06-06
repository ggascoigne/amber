import { NextApiRequest, NextApiResponse } from 'next'

import { stripePublishableKey } from '../constants'
import { handleError } from '../handleError'

// /api/getStripeConfig
// auth token: not required
// body: {}

export const getStripeConfigRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore
  console.log({ 'req.hostname': req.hostname, 'headers.host': req.headers.host, originalUrl: req.originalUrl })
  Object.entries(process.env)
    .filter(([k]) => k.startsWith('VERCEL'))
    .forEach(([k, v]) => console.log(`${k}=${v}`))

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
