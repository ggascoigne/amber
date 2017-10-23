import hapi from 'hapi'
import { User } from '../../models'

import plugin from './index'

let user
let server

function loadPlugins (server) {
  return new Promise((resolve, reject) => {
    server.register([
      require('hapi-auth-basic'),
      require('hapi-auth-jwt2'),
      plugin
    ], (error) => {
      if (error) {
        return reject(error)
      } else {
        resolve()
      }
    })
  })
}

beforeEach(async () => {
  user = await User.forge({
    username: 'tester',
    account_expired: false,
    account_locked: false,
    enabled: true,
    password: 'some long hash',
    password_expired: false
  }).save()

  server = new hapi.Server()
  server.connection()

  return loadPlugins(server)
})

afterEach(async () => {
  // const tokens = await user.tokens().fetch()
  // await tokens.invokeThen('destroy')
  // return user.destroy()
})

// test.serial('[GET] /users/{id}', async t => {
//   const authToken = await Token.tokenize(user.id)
//   const headers = {authorization: authToken}
//
//   return new Promise((resolve) => {
//     server.inject({
//       headers,
//       method: 'GET',
//       url: `/users/${user.id}`
//     }, (response) => {
//       if (response.result.error) {
//         t.fail(response.result.message)
//       }
//
//       resolve()
//     })
//   })
// })

test('[GET] /users', async () => {
  // const authToken = await Token.tokenize(user.id)
  // const headers = {authorization: authToken}

  return new Promise((resolve) => {
    server.inject({
      // headers,
      method: 'GET',
      url: '/users'
    }, (response) => {
      if (response.result.error) {
        t.fail(response.result.message)
      }

      resolve()
    })
  })
})
