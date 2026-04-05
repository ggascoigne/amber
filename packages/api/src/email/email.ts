import path from 'path'

import { config } from '@amber/server/shared/config'
import Email from 'email-templates'

import { transport } from './transport'

export const emailer = new Email({
  views: {
    // directory where email templates reside
    root: path.resolve(process.cwd(), 'content', 'email'),
  },
  message: {
    from: config.email.fromAddress,
  },
  // note toggle this next line to send real emails in dev mode
  // send: true,
  transport,
})
