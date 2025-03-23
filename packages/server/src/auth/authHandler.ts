import { env } from '@amber/environment'
import { AfterCallback, handleCallback } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'

import { getUserRoles } from './apiAuthUtils.ts'

process.env.AUTH0_BASE_URL = env.AUTH0_BASE_URL ?? env.VERCEL_URL

const afterCallback: AfterCallback = async (_req, _res, session, _state) => {
  const authorization = await getUserRoles(session)
  if (authorization) {
    return {
      ...session,
      user: {
        ...session.user,
        ...authorization,
      },
    }
  } else {
    return session
  }
}

export const authHandlers = {
  async callback(req: NextApiRequest, res: NextApiResponse) {
    try {
      await handleCallback(req, res, {
        afterCallback,
      })
    } catch (error: any) {
      res.status(error.status || 500).end(error.message)
    }
  },
}
