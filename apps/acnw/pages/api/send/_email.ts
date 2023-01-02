import path from 'path'

import Email from 'email-templates'

import { transport } from './_transport'

export const emailer = new Email({
  views: {
    // directory where email templates reside
    root: path.resolve('pages', 'api', 'send', 'templates'),
  },
  message: {
    from: '"AmberCon NW" <acnw@wyrdrune.com>',
  },
  // note toggle this next line to send real emails in dev mode
  // send: true,
  transport,
})
