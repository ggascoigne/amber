import _ from 'lodash'
import { User } from '../../models'
import { getErrorCode } from '../../utils/testUtils'

// async function deleteUser (user) {
//   return user.archive()
// }
//
// async function patchUser (user: User, payload: Object) {
//   if (!payload.password) return user.save(payload, { patch: true })
//
//   const hash = await User.hashPassword(payload.password)
//   return user.save({ ...payload, password: hash }, { patch: true })
// }
//
// async function putUser (user: User, payload: Object) {
//   if (!payload.password) return user.save(payload)
//
//   const hash = await User.hashPassword(payload.password)
//   return user.save({ ...payload, password: hash })
// }

export async function getUserHandler (req, reply) {
  const {id} = req.params

  try {
    const user = await User.query()
      .findById(id)
      .eager('[profile, roles]')
      .throwIfNotFound()
    reply({
      user: _.omit(user, ['password']),
      success: true,
      timestamp: Date.now()
    })
  } catch (error) {
    reply({
      success: false,
      error: error.name,
      message: error.message,
      timestamp: Date.now()
    }).code(getErrorCode(error))
  }
}

export async function getUsersHandler (req, reply) {
  try {
    const users = await User.query()
      .eager('[profile, roles]')

    reply({
      users: users.map(u => _.omit(u, ['password', '_roles'])),
      success: true,
      timestamp: Date.now()
    })
  } catch (error) {
    reply({
      success: false,
      error: error.name,
      message: error.message,
      timestamp: Date.now()
    }).code(401)
  }
}

// export async function getUserTokensHandler (req, reply) {
//   const { id } = req.params
//
//   try {
//     const fetchTimer = new Date()
//
//     const user = await new User()
//       .where({ id, active: true })
//       .fetch({ require: true, withRelated: ['tokens'] })
//     const tokens = await user.related('tokens')
//
//     req.server.statsd.timing('iam.user.tokens.fetch', fetchTimer)
//
//     reply({
//       tokens,
//       success: true,
//       user: id,
//       timestamp: Date.now()
//     })
//   } catch (error) {
//     reply({
//       success: false,
//       error: error.name,
//       message: error.message,
//       timestamp: Date.now()
//     }).code(401)
//   }
// }
//
// export async function deleteUserTokenHandler (req, reply) {
//   const { id, tokenId } = req.params
//
//   try {
//     const fetchTimer = new Date()
//     const user = new User()
//       .where({ id, active: true })
//       .fetch({ require: true })
//     const token = user.tokens()
//       .query({ where: { id: tokenId } })
//       .fetchOne()
//
//     req.server.statsd.timing('iam.user.token.fetch', fetchTimer)
//
//     await token.destroy()
//
//     reply({
//       success: true,
//       timestamp: Date.now()
//     })
//   } catch (error) {
//     reply({
//       success: false,
//       error: error.name,
//       message: error.message,
//       timestamp: Date.now()
//     }).code(401)
//   }
// }

export async function createUserHandler (req, reply) {
  try {
    const defaultValues = {
      'account_expired': false,
      'account_locked': false,
      'enabled': true,
      'password_expired': false
    }
    const user = await User.query()
      .insert({...defaultValues, ...req.payload})

    reply({
      success: true,
      user: _.omit(user, ['password']),
      timestamp: Date.now()
    })
  } catch (error) {
    reply({
      success: false,
      error: error.name,
      message: error.message,
      timestamp: Date.now()
    }).code(getErrorCode(error))
  }
}

export async function patchUserHandler (req, reply) {
  const {id} = req.params

  try {
    const user = await User.query()
      .patchAndFetchById(id, req.payload)
      .throwIfNotFound()

    reply({
      success: true,
      user: _.omit(user, ['password']),
      timestamp: Date.now()
    })
  } catch (error) {
    reply({
      success: false,
      error: error.name,
      message: error.message,
      timestamp: Date.now()
    }).code(getErrorCode(error))
  }
}

export async function putUserHandler (req, reply) {
  const {id} = req.params

  try {
    const user = await User.query()
      .updateAndFetchById(id, req.payload)
      .throwIfNotFound()

    reply({
      success: true,
      user: _.omit(user, ['password']),
      timestamp: Date.now()
    })
  } catch (error) {
    reply({
      success: false,
      error: error.name,
      message: error.message,
      timestamp: Date.now()
    }).code(getErrorCode(error))
  }
}

export async function deleteUserHandler (req, reply) {
  const {id} = req.params

  try {
    await User.query()
      .deleteById(id)
      .throwIfNotFound()

    reply({
      success: true,
      timestamp: Date.now()
    })
  } catch (error) {
    reply({
      success: false,
      error: error.name,
      message: error.message,
      timestamp: Date.now()
    }).code(getErrorCode(error))
  }
}
