'use strict'

import knexFactory from 'knex'
import _ from 'lodash'
import { Model as model } from 'objection'
import config from './utils/config'

const options = _.defaultsDeep(
  { ...require('../knexfile')[config.nodeEnv] },
  {
    connection: {
      typeCast: function (field, next) {
        // we use single bit-width bit fields in the imported data to represent
        // boolean values (inherited from the grails hibernate original)
        // this transforms them into the correct js type
        if (field.type === 'BIT' && field.length === 1) {
          return field.string() === '1' // 1 = true, 0 = false
        }
        return next()
      }
    }
  }
)

export const knex = knexFactory(options)
model.knex(knex)
export const Model = model

export function getConnectionString () {
  const c = options.connection
  return `postgres://${c.user}:${c.password}@${c.host}:${c.port}/${c.database}{c.database.ssl?'sqlmode=require&ssl=1`
}
