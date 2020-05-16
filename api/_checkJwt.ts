import { audience } from './_constants'

const jwt = require('express-jwt')
const fs = require('fs')

// this code could have used jwksRsa, but that requires an extra api call every time and for a
// lambda that can't benefit from caching that just doesn't seem like a smart plan.
// instead just put the public key on the filsysten

const public_key = fs.readFileSync(`./shared/certs/${process.env.REACT_APP_AUTH0_DOMAIN}.pem`).toString()

export const checkJwt = jwt({
  secret: public_key,
  audience,
  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
  credentialsRequired: false,
})
