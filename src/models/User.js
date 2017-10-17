'use strict'

import bookshelf from '../bookshelf'

const User = bookshelf.Model.extend({
  tableName: 'user'
})

module.exports = User
