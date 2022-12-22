import nodemailer from 'nodemailer'

import { config } from 'database/shared/config'

export const transport = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: true,
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
})
