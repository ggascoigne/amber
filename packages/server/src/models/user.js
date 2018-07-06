'use strict'

import Boom from 'boom'
import crypto from 'crypto'
import Joi from 'joi'
import { Model } from '../orm'
import Profile from './profile'
import Role from './role'

export const userGraphUpdateOptions = {
  unrelate: ['roles'],
  relate: ['roles'],
  noDelete: ['roles']
}

export default class User extends Model {
  static get tableName () {
    return 'user'
  }

  static get relationMappings () {
    return {
      profile: {
        relation: Model.HasOneRelation,
        modelClass: Profile,
        join: {
          from: 'user.profile_id',
          to: 'profile.id'
        }
      },
      roles: {
        relation: Model.ManyToManyRelation,
        modelClass: Role,
        join: {
          from: 'user.id',
          through: {
            // user_role is the join table.
            from: 'user_role.user_id',
            to: 'user_role.role_id'
          },
          to: 'role.id'
        }
      }
    }
  }

  static get schema () {
    return {
      username: Joi.string().max(32),
      password: Joi.string()
        .max(64)
        .regex(/[a-zA-Z0-9@-_]{3,30}/),
      profile_id: Joi.number(),
      account_expired: Joi.boolean(),
      account_locked: Joi.boolean(),
      enabled: Joi.boolean(),
      password_expired: Joi.boolean(),
      roles: Joi.array()
    }
  }

  static get requiredSchema () {
    return Joi.object()
      .keys(User.schema)
      .requiredKeys('username', 'password', 'profile_id')
  }

  static validatePassword (given, actual) {
    return User.hashPassword(given) === actual
  }

  static async findByUsername (username) {
    return User.query()
      .where('user.username', username)
      .first()
      .eager('[profile, roles]')
      .throwIfNotFound()
  }

  static async findByUsernameOrEmail (nameOrEmail) {
    return User.query()
      .where('profile.email', nameOrEmail)
      .orWhere('user.username', nameOrEmail)
      .join('profile', 'user.profile_id', 'profile.id')
      .first()
      .eager('[profile, roles]')
      .throwIfNotFound()
  }

  static async authenticate (nameOrEmail, password) {
    let user
    let valid

    try {
      user = await User.findByUsernameOrEmail(nameOrEmail)
    } catch (error) {
      if (error.message === 'NotFoundError') {
        return Promise.reject(Boom.unauthorized())
      }

      return Promise.reject(error)
    }

    try {
      valid = User.validatePassword(password, user.password)
    } catch (error) {
      return Promise.reject(error)
    }

    if (!valid) {
      return Promise.reject(Boom.unauthorized())
    }
    return Promise.resolve(user)
  }

  static hashPassword (password) {
    const hash = crypto.createHash('sha256')
    hash.update(password)
    return hash.digest('hex')
  }
}
