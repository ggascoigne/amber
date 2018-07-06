'use strict'
import Boom from 'boom'
import cuid from 'cuid'
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import { knex, Model } from '../orm'
import User from './user'

const config = require('../utils/config')
export const TOKEN_EXPIRATION = 3600

export default class Token extends Model {
  static get tableName () {
    return 'token'
  }

  static get relationMappings () {
    return {
      user: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'token.user_id',
          to: 'user.id'
        }
      }
    }
  }

  static accessToken (user) {
    const issueDate = Date.now()
    const expirationDate = issueDate + TOKEN_EXPIRATION * 1000

    return jwt.sign(
      {
        username: _.get(user, 'username'),
        roles: _.get(user, 'roles').map(r => r.authority),
        exp: expirationDate,
        iat: issueDate
      },
      config.get('jwt_secret')
    )
  }

  static refreshToken (user) {
    const unique = cuid()

    return new Promise((resolve, reject) => {
      Token.query()
        .insert({ cuid: unique, user_id: user.id, last_used: knex.fn.now() })
        .then(token =>
          jwt.sign(
            {
              cuid: _.get(token, 'cuid'),
              username: _.get(user, 'username'),
              roles: ['ROLE_TOKEN_REFRESH'],
              iat: Date.now()
            },
            config.get('jwt_secret')
          )
        )
        .then(jwt => resolve(jwt))
        .catch(error => reject(error))
    })
  }

  static tokenize (userId) {
    const unique = cuid()

    return new Promise((resolve, reject) => {
      Token.query()
        .insert({ cuid: unique, user_id: userId, last_used: knex.fn.now() })
        .then(token =>
          jwt.sign(
            {
              cuid: _.get(token, 'cuid'),
              user_id: _.get(token, 'user_id')
            },
            config.get('jwt_secret')
          )
        )
        .then(jwt => resolve(jwt))
        .catch(error => reject(error))
    })
  }

  static async verify (token) {
    return new Promise((resolve, reject) => {
      if (!token) {
        return reject(Boom.unauthorized('Token expired!'))
      }

      const decoded = jwt.verify(token, config.get('jwt_secret'))
      if (Token.isExpired(decoded)) {
        return reject(Boom.unauthorized('Token expired!'))
      }

      const cuid = _.get(decoded, 'cuid')
      if (cuid) {
        Token.query()
          .where('cuid', cuid)
          .first()
          .throwIfNotFound()
          .patch({ last_used: new Date() })
          .then(() => resolve(decoded))
          .catch(e => reject(e))
      } else {
        resolve(decoded)
      }
    })
  }

  static isExpired (token) {
    const expiration = _.get(token, 'exp')
    return expiration ? expiration < Date.now() : false
  }
}
