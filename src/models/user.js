'use strict'

import bookshelf from '../bookshelf'

const User = bookshelf.Model.extend({
  tableName: 'user',
})

// note that when importing via index.js that the names get lower-cased to match the file names
module.exports = User
