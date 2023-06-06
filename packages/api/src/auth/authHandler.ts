/* eslint-disable @typescript-eslint/no-shadow */
import { AfterCallback, handleCallback } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'

import { getUserRoles } from './apiAuthUtils'

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
    console.log(JSON.stringify(req, null, 2))

    try {
      await handleCallback(req, res, {
        afterCallback,
      })
    } catch (error: any) {
      res.status(error.status || 500).end(error.message)
    }
  },
}
