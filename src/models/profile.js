'use strict'

import { Model } from '../orm'
import Joi from 'joi'

export default class Profile extends Model {
  static get tableName () { return 'profile' }

  static async deleteAll () {
    // Destroy all records - test setup and cleanup only
    return Profile
      .query()
      .delete()
      .catch(err => {
        console.error(err.stack)
      })
  }

  static get schema () {
    return {
      full_name: Joi.string().max(64),
      email: Joi.string().email().max(64),
      snail_mail_address: Joi.string().max(250),
      phone_number: Joi.string().max(32)
    }
  }

  static get requiredSchema () {
    return Joi.object().keys(Profile.schema)
      .requiredKeys('full_name', 'email')
  }
}
