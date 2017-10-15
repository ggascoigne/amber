'use strict'

import models from '../models'

module.exports = {
  get: function (request, response) {
    models.user.fetchAll()
      .then((users) => {
        response.json({users})
      })
  }
}
