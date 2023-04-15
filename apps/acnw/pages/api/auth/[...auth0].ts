/* eslint-disable @typescript-eslint/no-shadow */
import { authHandlers } from '@amber/api'
import { handleAuth } from '@auth0/nextjs-auth0'

process.env.AUTH0_BASE_URL = process.env.AUTH0_BASE_URL ?? process.env.VERCEL_URL

export default handleAuth(authHandlers)
