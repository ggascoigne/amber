import faker from 'faker'
import { Role } from '../models'
import User from '../models/user'
import { knex } from '../orm'
import config from './config'

export function truncateTables () {
  return knex.transaction(txn => {
    console.log('Cleaning database')
    knex
      .raw('SELECT f_truncate_tables(?)', [config.database.username])
      .transacting(txn)
      .then(txn.commit)
      .catch(e => {
        console.log('Caught exception cleaning database: ' + e.message)
        txn.rollback()
      })
  })
}

async function sleep (ms) {
  await new Promise(resolve => {
    setTimeout(() => resolve(ms), ms)
  })
  console.log(`slept for ${ms}ms`)
}

exports.sleep = sleep

let doneTruncation = false

export let roleAdmin
export let roleUser
export let roleTokenRefresh

export async function prepTestDatabaseOnce () {
  if (!doneTruncation) {
    // todo use semaphore
    doneTruncation = true
    await truncateTables()
    // await sleep(1000)

    roleAdmin = await Role.query().insert({
      authority: 'ROLE_ADMIN'
    })

    roleUser = await Role.query().insert({
      authority: 'ROLE_USER'
    })

    roleTokenRefresh = await Role.query().insert({
      authority: 'ROLE_TOKEN_REFRESH'
    })
  }
}

export function loadTestPlugins (server, pluginToTest) {
  return new Promise((resolve, reject) => {
    server.register([require('hapi-auth-jwt2'), require('../plugins/response-update'), pluginToTest], error => {
      if (error) {
        return reject(error)
      } else {
        resolve()
      }
    })
  })
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

export function fakeUser (profileId, roles = [roleUser]) {
  return {
    username: faker.name.findName(),
    password: User.hashPassword('password'),
    account_locked: false,
    enabled: true,
    profile_id: profileId,
    roles: roles
  }
}
