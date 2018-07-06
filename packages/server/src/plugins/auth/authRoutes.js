import Joi from 'joi'

import _ from 'lodash'

import { authLoginHandler, authRefreshHandler, authRevokeHandler, authValidateHandler } from './authHandlers'

import { getScopes } from './helpers'

const config = require('../../utils/config')

const authLoginPayloadSchema = {
  username: Joi.string().max(32),
  password: Joi.string()
    .regex(/[a-zA-Z0-9@-_]{3,30}/)
    .required()
}

const authTokenPayloadSchema = {
  cuid: Joi.string().required()
}

const authRefreshPayloadSchema = {
  grant_type: Joi.string().max(32),
  refresh_token: Joi.string().required()
}

async function validate (decoded, request, next) {
  try {
    const exp = _.get(decoded, 'exp')
    const now = Date.now()
    if (exp && exp < now) {
      console.log(`exp: ${new Date(exp)} < ${new Date(now)}`)
      next(new Error('token expired'), false)
    } else {
      const username = decoded.username
      const scope = getScopes(decoded.roles)
      next(null, true, { username, scope, token: request.auth.token })
    }
  } catch (e) {
    next(e, false)
  }
}

export function routes (server, options, next) {
  server.auth.strategy('jwt', 'jwt', {
    key: config.get('jwt_secret'),
    validateFunc: validate,
    verifyOptions: { algorithms: ['HS256'] }
  })

  server.auth.default('jwt')

  server.route([
    {
      method: 'POST',
      path: '/auth/login',
      config: {
        tags: ['api'],
        auth: false,
        validate: {
          payload: authLoginPayloadSchema
        },
        handler: authLoginHandler
      }
    },
    {
      method: 'GET',
      path: '/auth/validate',
      config: {
        tags: ['api'],
        auth: {
          scope: ['acnw:auth:check']
        },
        handler: authValidateHandler
      }
    },
    {
      method: 'POST',
      path: '/auth/refresh',
      config: {
        tags: ['api'],
        auth: {
          // note that this means that you probably have to refresh using the refresh token as an auth token
          scope: ['acnw:auth:refresh']
        },
        validate: {
          payload: authRefreshPayloadSchema
        },
        handler: authRefreshHandler
      }
    },
    {
      method: 'POST',
      path: '/auth/revoke',
      config: {
        tags: ['api'],
        auth: {
          scope: ['acnw:tokens:delete']
        },
        validate: {
          payload: authTokenPayloadSchema
        },
        handler: authRevokeHandler
      }
    }
  ])

  next()
}
