'use strict'

import _ from 'lodash'
import bookshelf from '../bookshelf'
import User from './user'

const config = {
  tableName: 'profile',
  user: function () {
    return this.belongsTo(User)
  }
}

const deleteAll = async () => {
  // Destroy all records - test setup and cleanup only
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

const statics = {deleteAll}
const Profile = bookshelf.Model.extend(config, statics)

export default Profile
