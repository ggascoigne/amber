// import mg from 'nodemailer-mailgun-transport'
// import nodemailer from 'nodemailer'

import Boom from 'boom'
import _ from 'lodash'
import { Token, User } from '../../models'
import { TOKEN_EXPIRATION } from '../../models/token'
import { getScopes, validateToken } from './helpers'

// const mgConfig = {
//   auth: {
//     api_key: process.env.MAILGUN_API_KEY,
//     domain: process.env.MAILGUN_DOMAIN
//   }
// }
//
// const mailer = nodemailer.createTransport(mg(mgConfig))

async function sendMail (messageConfig) {
  // return new Promise((resolve, reject) => {
  //   mailer.sendMail(messageConfig, (error, info) => {
  //     if (error) return reject(error)
  //     resolve(info)
  //   })
  // })
}

function getEmailText (url, token) {
  return `
  Here is the link to reset your password!

  ${url}?token=${encodeURIComponent(token)}

  If you did not request this email please contact us at help@jasperdoes.xyz

  Cheers,
  The Jasper Team
  `
}

export async function authLoginHandler (req, reply) {
  const { username, password } = req.payload
  try {
    const user = await User.authenticate(username, password)
    const roles = user.roles.map(r => r.authority)
    const accessToken = await Token.accessToken(user)
    const refreshToken = await Token.refreshToken(user)

    if (_.get(user, 'account_locked') || !_.get(user, 'enabled')) {
      reply(Boom.unauthorized())
    } else {
      reply({
        success: true,
        username: user.username,
        roles: roles,
        token_type: 'Bearer',
        expires_in: TOKEN_EXPIRATION,
        access_token: accessToken,
        refresh_token: refreshToken
      })
    }
  } catch (error) {
    req.log('error', error)
    reply(Boom.unauthorized())
  }
}

export async function authValidateHandler (req, reply) {
  const token = req.auth.token

  try {
    const decoded = await Token.verify(token)

    reply({
      success: true,
      username: decoded.username,
      roles: decoded.roles,
      token_type: 'Bearer',
      expires_in: Math.trunc((decoded.exp - Date.now()) / 1000),
      access_token: token
    })
  } catch (error) {
    req.log('error', error)
    reply(Boom.unauthorized())
  }
}

export async function authRefreshHandler (req, reply) {
  const token = req.auth.token
  const { grant_type: grantType, refresh_token: refreshToken } = req.payload

  try {
    if (grantType !== 'refresh_token' || token !== refreshToken) {
      return reply(Boom.badRequest('Invalid Payload'))
    }
    const decoded = await Token.verify(token)
    const user = await User.findByUsername(decoded.username)

    if (_.get(user, 'account_locked') || !_.get(user, 'enabled')) {
      reply(Boom.unauthorized())
    } else {
      reply({
        success: true,
        username: _.get(user, 'username'),
        roles: _.get(user, 'roles').map(r => r.authority),
        token_type: 'Bearer',
        expires_in: TOKEN_EXPIRATION,
        access_token: await Token.accessToken(user),
        refresh_token: token
      })
    }
  } catch (error) {
    req.log('error', error)
    reply(Boom.unauthorized())
  }
}

export async function authRevokeHandler (req, reply) {
  const { cuid } = req.payload

  try {
    await Token.query()
      .where('cuid', cuid)
      .first()
      .delete()

    reply({
      success: true
    })
  } catch (error) {
    req.log('error', error)
    reply(Boom.unauthorized())
  }
}

// ////////////////////////////////////////////////////////////////////////

export async function authTokenHandler (req, reply) {
  const { cuid } = req.payload

  try {
    const token = await new Token({ cuid }).fetch({ require: true, withRelated: ['user'] })

    await validateToken(token)

    const user = token.related('user')

    reply({
      success: true,
      user: user.id,
      scope: getScopes(_.get(user, 'roles'))
    })
  } catch (error) {
    req.log('error', error)
    reply(Boom.unauthorized())
  }
}

export async function authenticateHandler (req, reply) {
  const { email, password } = req.payload

  try {
    const user = await User.authenticate(email, password)
    const token = await Token.tokenize(user.id)

    reply({
      success: true,
      payload: {
        token,
        user: user.id,
        scope: getScopes(_.get(user, 'roles'))
      }
    })

    const inactiveTokens = await user.inactiveTokens().fetch()
    inactiveTokens.invokeThen('destroy')
  } catch (error) {
    req.log('error', error)
    reply(Boom.unauthorized())
  }
}

export async function passwordResetHandler (req, reply) {
  const { email, url } = req.payload

  try {
    const user = new User({ email, active: true }).fetch({ require: true })
    const token = await Token.tokenize(user.id)
    const messageConfig = {
      to: email,
      from: 'no-reply@jasperdoes.xyz',
      subject: 'Jasper AI - Reset Password',
      text: getEmailText(url, token)
    }

    await sendMail(messageConfig)

    reply({
      success: true
    })
  } catch (error) {
    req.log('error', error)
    reply(Boom.unauthorized())
  }
}
