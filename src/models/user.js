'use strict'

import _ from 'lodash'
import bookshelf from '../bookshelf'
import Profile from './profile'

const config = {
  tableName: 'user',
  profile: function () {
    return this.hasOne(Profile)
  }
}

const deleteAll = async () => {
  // Destroy all records - test setup and cleanup only
  return User.collection().fetch()
    .then((users) => {
      Promise.all(_.map(users.models, model => model.destroy()))
        .then(() => {})
        .catch(reason => {
          console.log('error cleaning up users')
          console.log(reason)
        })
    })
}

const statics = {deleteAll}

const User = bookshelf.Model.extend(config, statics)

export default User
