'use strict'

import _ from 'lodash'
import bookshelf from '../bookshelf'

const Profile = bookshelf.Model.extend({
  tableName: 'profile'
})

// Destroy all records - test setup and cleanup only
Profile.deleteAll = async () => {
  return Profile.collection().fetch()
    .then((profiles) => {
      Promise.all(_.map(profiles.models, model => model.destroy()))
        .then(() => {})
        .catch(reason => {
          console.log('error cleaning up profiles')
          console.log(reason)
        })
    })
}

export default Profile
