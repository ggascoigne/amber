import path from 'path'

import { config } from '../../../../shared/config'

export type EmailSendOptions = {
  locals: Record<string, unknown>
  message: Record<string, unknown>
  template: string
}

export type Emailer = {
  send: (options: EmailSendOptions) => Promise<unknown>
}

let emailerPromise: Promise<Emailer> | null = null

export const getEmailer = () => {
  emailerPromise ??= (async () => {
    const [{ default: Email }, { default: nodemailer }] = await Promise.all([
      import('email-templates'),
      import('nodemailer'),
    ])

    const transport = nodemailer.createTransport({
      auth: {
        pass: config.email.password,
        user: config.email.user,
      },
      host: config.email.host,
      port: config.email.port,
      secure: true,
    })

    return new Email({
      message: {
        from: config.email.fromAddress,
      },
      transport,
      views: {
        root: path.resolve(process.cwd(), 'pages', 'api', 'send', 'templates'),
      },
    })
  })()

  return emailerPromise
}

export const sendTemplateEmail = async (emailer: Emailer, options: EmailSendOptions) => {
  try {
    return await emailer.send(options)
  } catch (error) {
    const membership =
      options.locals.membership && typeof options.locals.membership === 'object'
        ? Object.keys(options.locals.membership as Record<string, unknown>).sort()
        : undefined
    const room =
      options.locals.room && typeof options.locals.room === 'object'
        ? Object.keys(options.locals.room as Record<string, unknown>).sort()
        : undefined
    const game =
      options.locals.game && typeof options.locals.game === 'object'
        ? Object.keys(options.locals.game as Record<string, unknown>).sort()
        : undefined
    const gameChoices =
      Array.isArray(options.locals.gameChoices) &&
      options.locals.gameChoices[0] &&
      typeof options.locals.gameChoices[0] === 'object'
        ? Object.keys(options.locals.gameChoices[0] as Record<string, unknown>).sort()
        : undefined

    console.error('email.send failed', {
      cwd: process.cwd(),
      error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      game,
      gameChoices,
      localsKeys: Object.keys(options.locals).sort(),
      membership,
      messageKeys: Object.keys(options.message).sort(),
      room,
      template: options.template,
    })
    throw error
  }
}
