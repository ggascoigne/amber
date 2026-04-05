import { stripeWebhookHandler } from '@amber/server/src/api/services/payments/webhook'
import Cors from 'micro-cors'
import type { NextApiRequest, NextApiResponse } from 'next'

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
}

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
})

export default cors(stripeWebhookHandler as any) as (req: NextApiRequest, res: NextApiResponse) => Promise<void>
