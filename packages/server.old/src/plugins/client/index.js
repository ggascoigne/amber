import Path from 'path'

const config = require('../../utils/config')

// in production mode, serve up the UI code.

function routes (server, options, next) {
  if (config.nodeEnv === 'production') {
    server.route({
      method: 'GET',
      path: '/{path*}',
      config: {
        auth: false
      },
      handler: {
        directory: {
          path: Path.join(__dirname, '../../../ui'),
          listing: false,
          index: true
        }
      }
    })
  }
  next()
}

module.exports.register = routes

module.exports.register.attributes = {
  name: 'client',
  version: '1.0.0'
}
