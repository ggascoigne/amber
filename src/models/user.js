'use strict'

import Joi from 'joi'
import { Model } from '../orm'
import Profile from './profile'

export default class User extends Model {
  static get tableName () { return 'user' }

  static get relationMappings () {
    return {
      profile: {
        relation: Model.HasOneRelation,
        modelClass: Profile,
        join: {
          from: 'user.profile_id',
          to: 'profile.id'
        }
      }
    }
  }

  static async deleteAll () {
    return User
      .query()
      .delete()
      .then(numDeleted => {
        // console.log(`deleted ${numDeleted} users`)
      })
      .catch(err => {
        console.error(err.stack)
      })
  }

  static get schema () {
    return {
      username: Joi.string().max(32),
      password: Joi.string().max(64).regex(/[a-zA-Z0-9@-_]{3,30}/),
      profile_id: Joi.number(),
      account_expired: Joi.boolean(),
      account_locked: Joi.boolean(),
      enabled: Joi.boolean(),
      password_expired: Joi.boolean()
    }
  }

  static get requiredSchema () {
    return Joi.object().keys(User.schema)
      .requiredKeys('username', 'password', 'profile_id')
  }
}
