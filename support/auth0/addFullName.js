/* eslint-disable */

function addPersistentFullName(user, context, callback) {
  const namespace = 'https://amberconnw.org'

  user.user_metadata = user.user_metadata || {}
  console.log(user.user_metadata)
  user.user_metadata.full_name = user.user_metadata.full_name || ''
  context.idToken[namespace] = {
    ...context.idToken[namespace],
    full_name: user.user_metadata.full_name,
  }

  auth0.users
    .updateUserMetadata(user.user_id, user.user_metadata)
    .then(function () {
      callback(null, user, context)
    })
    .catch(function (err) {
      callback(err)
    })
}
