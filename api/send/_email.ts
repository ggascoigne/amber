import path from 'path'

import Email from 'email-templates'
import { Request } from 'express'

import { EmailConfirmation } from '../../src/utils/apiTypes'
import { transport } from './_transport'

export type RequestOf<T extends EmailConfirmation> = Request<Record<string, unknown>, T['body'], T['body']>

export const emailer = new Email({
  views: {
    // directory where email templates reside
    root: path.resolve('api', 'send', 'templates'),
  },
  message: {
    from: '"AmberCon NW" <acnw@wyrdrune.com>',
  },
  // note toggle this next line to send real emails in dev mode
  // send: true,
  transport,
})
