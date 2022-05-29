import fs from 'fs'

import { expressjwt as jwt } from 'express-jwt'

import { audience, authDomain } from './_constants'
import { Handler } from './_standardHandler'

const public_key = fs.readFileSync(`${__dirname}/../shared/certs/${authDomain}.pem`).toString()

// note express-jwt doesn't just validate the token, it puts the decoded token on the request as `user`

export const checkJwt = jwt({
  secret: public_key,
  audience,
  issuer: `https://${authDomain}/`,
  algorithms: ['RS256'],
  credentialsRequired: false,
}) as unknown as Handler

export const requireJwt = jwt({
  secret: public_key,
  audience,
  issuer: `https://${authDomain}/`,
  algorithms: ['RS256'],
  credentialsRequired: true,
}) as unknown as Handler

export const getUserId = (user: any) => user?.[audience]?.userId

export const isAdmin = (user: any) => {
  const roles = user?.[audience]?.roles
  return roles && roles.indexOf('ROLE_ADMIN') !== -1
}
