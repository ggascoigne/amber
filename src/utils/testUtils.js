import faker from 'faker'
import { knex } from '../orm'
import config from './config'

export function truncateTables () {
  return knex.raw('SELECT f_truncate_tables(?)', [config.get('database.username')])
}

let doneTruncation = false

export async function truncateTablesOnce () {
  if (!doneTruncation) {
    // todo use semaphore
    doneTruncation = true
    await truncateTables()
  }
}

export function loadTestPlugins (server, pluginToTest) {
  return new Promise((resolve, reject) => {
    server.register([
      require('hapi-auth-basic'),
      require('hapi-auth-jwt2'),
      pluginToTest
    ], (error) => {
      if (error) {
        return reject(error)
      } else {
        resolve()
      }
    })
  })
}

export const getErrorCode = (error) => {
  if (error.message === 'NotFoundError') {
    return 404 // NOT FOUND
  } else {
    return 400 // bad request
  }
}

export function fakeProfile () {
  return {
    email: faker.internet.email(),
    full_name: faker.name.findName()
  }
}

export function fakeRole () {
  return {
    authority: faker.name.findName() // faker.fake('ROLE_{{lorem.word}}')
  }
}
