'use strict'

import Joi from 'joi'
import { Model } from '../orm'

export default class Role extends Model {
  static get tableName () { return 'role' }

  static async deleteAll () {
    // Destroy all records - test setup and cleanup only
    return Role
      .query()
      .delete()
      .catch(err => {
        console.error(err.stack)
      })
  }

  static get schema () {
    return {
      authority: Joi.string().max(40)
    }
  }

  static get requiredSchema () {
    return Joi.object().keys(Role.schema)
      .requiredKeys('authority')
  }
}
