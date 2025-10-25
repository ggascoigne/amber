import { webhookHandler } from '@amber/api'
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

export default cors(webhookHandler as any) as (req: NextApiRequest, res: NextApiResponse) => Promise<void>
