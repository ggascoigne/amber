'use strict'

import { Model } from '../orm'
import Joi from 'joi'

export default class Profile extends Model {
  static get tableName () {
    return 'profile'
  }

  static get schema () {
    return {
      full_name: Joi.string().max(64),
      email: Joi.string()
        .email()
        .max(64),
      snail_mail_address: Joi.string().max(250),
      phone_number: Joi.string().max(32)
    }
  }

  static get requiredSchema () {
    return Joi.object()
      .keys(Profile.schema)
      .requiredKeys('full_name', 'email')
  }
}
