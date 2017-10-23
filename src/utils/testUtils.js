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
  if (error.message === 'EmptyResponse') {
    return 404 // NOT FOUND
  } else {
    return 400 // bad request
  }
}