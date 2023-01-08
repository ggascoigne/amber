/* eslint-disable @typescript-eslint/no-shadow */
import { handleAuth } from '@auth0/nextjs-auth0'
import { authHandlers } from '@amber/api'

process.env.AUTH0_BASE_URL = process.env.AUTH0_BASE_URL ?? process.env.VERCEL_URL

export default handleAuth(authHandlers)
