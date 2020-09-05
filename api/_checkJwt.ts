import { audience, authDomain } from './_constants'

const jwt = require('express-jwt')
const fs = require('fs')

// this code could have used jwksRsa, but that requires an extra api call every time and for a
// lambda that can't benefit from caching that just doesn't seem like a smart plan.
// instead just put the public key on the filsysten

const public_key = fs.readFileSync(`./shared/certs/${authDomain}.pem`).toString()

// note express-jwt doesn't just validate the token, it puts the decoded token on the request as `user`

export const checkJwt = jwt({
  secret: public_key,
  audience,
  issuer: `https://${authDomain}/`,
  algorithms: ['RS256'],
  credentialsRequired: false,
})

export const requireJwt = jwt({
  secret: public_key,
  audience,
  issuer: `https://${authDomain}/`,
  algorithms: ['RS256'],
  credentialsRequired: true,
})

export const getUserId = (user: any) => user?.[audience]?.userId

export const isAdmin = (user: any) => user[audience].roles.indexOf('ROLE_ADMIN') !== -1
