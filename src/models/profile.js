'use strict'

import bookshelf from '../bookshelf'
import _ from 'lodash'

const Profile = bookshelf.Model.extend({
  tableName: 'profile'
})

// Destroy all records - test setup and cleanup only
Profile.deleteAll = async () => {
  return Profile.collection().fetch()
    .then((profiles) => {
      _.each(profiles.models, function (model) {
        model.destroy()
      })
    })
}

export default Profile
