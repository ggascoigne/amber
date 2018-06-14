import Boom from 'boom'
import _ from 'lodash'
import { Role, User } from '../../models'
import { userGraphUpdateOptions } from '../../models/user'
import { getError } from '../../utils/errorUtils'
import {transaction} from 'objection'

export async function getUserHandler (req, reply) {
  const {id} = req.params

  try {
    const user = await User.query()
      .findById(id)
      .eager('[profile, roles]')
      .throwIfNotFound()

    reply({
      user: _.omit(user, ['password']),
      success: true
    })
  } catch (error) {
    req.log('error', error)
    reply(getError(error))
  }
}

export async function getUsersHandler (req, reply) {
  try {
    const users = await User.query()
      .eager('[profile, roles]')

    reply({
      users: users.map(u => _.omit(u, ['password'])),
      success: true
    })
  } catch (error) {
    req.log('error', error)
    reply(Boom.unauthorized())
  }
}

export const roleNamesToRoles = async (names) => {
  if (!names) {
    return []
  }
  const roles = await Role.query()
  return _.compact(
    names.map(n => roles.find(r => r.authority === n))
  )
}

const processPayload = async (data) => {
  const roles = await roleNamesToRoles(data.roles)
  return data.password
    ? {...data, roles, password: await User.hashPassword(data.password)}
    : {...data, roles}
}

export async function createUserHandler (req, reply) {
  try {
    const defaultValues = {
      'account_locked': false,
      'enabled': true
    }

    const data = await processPayload({...defaultValues, ...req.payload})
    const user = await transaction(User.knex(), txn => {
      return User.query(txn)
        .upsertGraph(data, userGraphUpdateOptions)
        .throwIfNotFound()
    })

    reply({
      user: _.omit(user, ['password']),
      success: true
    })
  } catch (error) {
    req.log('error', error)
    reply(getError(error))
  }
}

const updateUser = async (req, reply) => {
  const {id} = req.params

  try {
    const data = await processPayload({id, ...req.payload})
    const user = await transaction(User.knex(), txn => {
      return User.query(txn)
        .upsertGraph(data, userGraphUpdateOptions)
        .throwIfNotFound()
    })

    reply({
      user: _.omit(user, ['password']),
      success: true
    })
  } catch (error) {
    req.log('error', error)
    reply(getError(error))
  }
}

export async function patchUserHandler (req, reply) {
  return updateUser(req, reply)
}

export async function putUserHandler (req, reply) {
  return updateUser(req, reply)
}

export async function deleteUserHandler (req, reply) {
  const {id} = req.params

  try {
    const user = await User.query()
      .findById(id)
      .throwIfNotFound()

    await user.$relatedQuery('roles')
      .unrelate()

    await User.query()
      .deleteById(id)
      .throwIfNotFound()

    reply({
      success: true
    })
  } catch (error) {
    req.log('error', error)
    reply(getError(error))
  }
}
