import { User } from '../../models'

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
//
// export async function getUserHandler (req, reply) {
//   const { id } = req.params
//
//   try {
//     const fetchUserTimer = new Date()
//     const user: User = await new User({ id, active: true }).fetch({ require: true })
//
//     req.server.statsd.timing('iam.users.fetch', fetchUserTimer)
//
//     reply({
//       user: user.omit(['password', '_roles']),
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

export async function getUsersHandler (req, reply) {
  try {
    const users = await User.collection().fetch()

    reply({
      users: users.map(u => u.omit(['password', '_roles'])),
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
//
// export async function createUserHandler (req, reply) {
//   try {
//     const createUserTimer = new Date()
//     const user = await User.forge(req.payload).save()
//
//     req.server.statsd.timing('iam.user.create', createUserTimer)
//
//     reply({
//       success: true,
//       user: user.omit(['password', '_roles']),
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
// export async function patchUserHandler (req, reply) {
//   const { id } = req.params
//
//   try {
//     const updateUserTimer = new Date()
//     const user = await new User()
//       .where({ id, active: true })
//       .fetch({ require: true })
//     const updatedUser = await patchUser(user, req.payload)
//
//     req.server.statsd.timing('iam.user.update', updateUserTimer)
//
//     reply({
//       success: true,
//       user: updatedUser.omit(['password', '_roles']),
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
// export async function putUserHandler (req, reply) {
//   const { id } = req.params
//
//   try {
//     const updateUserTimer = new Date()
//     const user = new User()
//       .where({ id, active: true })
//       .fetch({ require: true })
//     const updatedUser = putUser(user, req.payload)
//
//     req.server.statsd.timing('iam.user.update', updateUserTimer)
//
//     reply({
//       success: true,
//       user: updatedUser.omit(['password', '_roles']),
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
// export async function deleteUserHandler (req, reply) {
//   const { id } = req.params
//
//   try {
//     const deleteUserTimer = new Date()
//     const user = new User()
//       .where({ id, active: true })
//       .fetch({ require: true })
//     await deleteUser(user)
//
//     req.server.statsd.timing('iam.user.delete', deleteUserTimer)
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
