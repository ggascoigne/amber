'use strict'

import bookshelfFactory from 'bookshelf'
import config from './utils/config'
import knexFactory from 'knex'
import _ from 'lodash'

const options =
  _.defaultsDeep(
    {...require('../knexfile')[config.util.getEnv('NODE_ENV')]},
    {
      connection: {
        typeCast: function (field, next) {
          // we use single bit-width bit fields in the imported data to represent
          // boolean values (inherited from the grails hibernate original)
          // this transforms them into the correct js type
          if (field.type === 'BIT' && field.length === 1) {
            return (field.string() === '1') // 1 = true, 0 = false
          }
          return next()
        }
      }
    })

export const knex = knexFactory(options)

const bookshelf = bookshelfFactory(knex)

// prevent cyclical dependencies when creating models
// https://github.com/tgriesser/bookshelf/wiki/Plugin:-Model-Registry
bookshelf.plugin('registry')

// allow virtual properties on models (custom getters and setters)
// https://github.com/tgriesser/bookshelf/wiki/Plugin:-Virtuals
bookshelf.plugin('virtuals')

export default bookshelf
