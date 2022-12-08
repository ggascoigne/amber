/* eslint-disable @typescript-eslint/no-shadow */
import { handleAuth, handleLogin, handleProfile, Session } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'
import JwtDecode from 'jwt-decode'
import { auth0Audience } from '@/pages/api/_constants'

export default handleAuth({
  async login(req, res) {
    try {
      await handleLogin(req, res, {
        authorizationParams: { audience: auth0Audience },
      })
    } catch (error: any) {
      res.status(error.status || 500).end(error.message)
    }
  },
  async profile(req, res) {
    try {
      await handleProfile(req, res, {
        refetch: true,
        afterRefetch: async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
          const decodedToken: Record<string, any> | undefined = session.accessToken
            ? JwtDecode(session.accessToken)
            : undefined
          return {
            ...session,
            user: {
              ...session.user,
              ...decodedToken?.[auth0Audience!],
            },
          }
        },
      })
    } catch (error: any) {
      res.status(error.status || 500).end(error.message)
    }
  },
})
