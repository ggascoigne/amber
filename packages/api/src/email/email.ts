import path from 'path'

import { config } from '@amber/database/shared/config'
import Email from 'email-templates'

import { transport } from './transport'

export const emailer = new Email({
  views: {
    // directory where email templates reside
    root: path.resolve('pages', 'api', 'send', 'templates'),
  },
  message: {
    from: config.email.fromAddress,
  },
  // note toggle this next line to send real emails in dev mode
  // send: true,
  transport,
})
