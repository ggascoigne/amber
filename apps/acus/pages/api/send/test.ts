import path from 'path'
import fs from 'fs'

import { config } from '@amber/server/shared/config'
import { emailer, isAdmin, transport } from '@amber/api'
import { auth0 } from '@amber/server/src/auth/auth0'
import type { NextApiRequest, NextApiResponse } from 'next'

// /api/send/test
// Diagnostic endpoint to debug email sending issues on Vercel
// auth token: required (admin only)

export default auth0.withApiAuthRequired(async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await auth0.getSession(req)
  if (!isAdmin(session?.user)) {
    res.status(403).json({ error: 'admin access required' })
    return
  }

  const diagnostics: Record<string, unknown> = {}

  // 1. Environment
  diagnostics.nodeEnv = process.env.NODE_ENV
  diagnostics.cwd = process.cwd()

  // 2. Template path resolution
  const resolvedPath = path.resolve('pages', 'api', 'send', 'templates')
  diagnostics.resolvedTemplatePath = resolvedPath
  diagnostics.templatePathExists = fs.existsSync(resolvedPath)

  // List template dirs if path exists
  if (diagnostics.templatePathExists) {
    try {
      diagnostics.templateDirs = fs.readdirSync(resolvedPath)
    } catch (e: any) {
      diagnostics.templateDirError = e.message
    }
  }

  // 3. SMTP config (redacted)
  diagnostics.smtpHost = config.email.host
  diagnostics.smtpPort = config.email.port
  diagnostics.smtpUser = config.email.user ? `${config.email.user.slice(0, 4)}...` : '(empty)'
  diagnostics.smtpPassword = config.email.password ? '(set)' : '(empty)'
  diagnostics.fromAddress = config.email.fromAddress

  // 4. SMTP connection test
  try {
    await transport.verify()
    diagnostics.smtpConnection = 'OK'
  } catch (e: any) {
    diagnostics.smtpConnection = `FAILED: ${e.message}`
  }

  // 5. Try sending a real test email via nodemailer directly (bypasses email-templates)
  try {
    const directResult = await transport.sendMail({
      from: config.email.fromAddress,
      to: config.email.fromAddress,
      subject: 'Email diagnostic test (direct)',
      text: `Direct nodemailer test at ${new Date().toISOString()}`,
    })
    diagnostics.directSend = { status: 'OK', messageId: directResult.messageId }
  } catch (e: any) {
    diagnostics.directSend = { status: 'FAILED', error: e.message }
  }

  // 6. Try sending via emailer (email-templates) - this tests template resolution
  // Skip in development since preview mode blocks the response
  if (process.env.NODE_ENV === 'development') {
    diagnostics.emailerSend = { status: 'SKIPPED', reason: 'preview mode blocks response in development' }
    res.status(200).json(diagnostics)
    return
  }

  try {
    const emailerResult = await emailer.send({
      template: 'membershipConfirmation',
      message: {
        to: config.email.fromAddress,
      },
      locals: {
        name: 'Test User',
        year: 2025,
        update: false,
        email: config.email.fromAddress,
        url: 'https://example.com',
        paymentUrl: 'https://example.com',
        membership: {
          attendance: 'Full',
          interestLevel: 'Full',
          arrivalDate: '2025-01-01',
          departureDate: '2025-01-03',
          roomingPreferences: 'None',
          roomingWith: '',
          offerSubsidy: false,
          requestOldPrice: false,
          volunteer: false,
          message: '',
          slotsAttending: '',
        },
        slotDescriptions: [],
        virtual: false,
        owed: '$0',
        address: '',
        phoneNumber: '',
        room: null,
        contactEmail: config.email.fromAddress,
        gameEmail: config.email.fromAddress,
      },
    })
    diagnostics.emailerSend = { status: 'OK', messageId: emailerResult?.messageId }
  } catch (e: any) {
    diagnostics.emailerSend = { status: 'FAILED', error: e.message, stack: e.stack?.split('\n').slice(0, 5) }
  }

  res.status(200).json(diagnostics)
})
