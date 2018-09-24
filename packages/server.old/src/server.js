'use strict'

import Hapi from 'hapi'
import { bootstrap } from './bootstrap'
import loadPlugins from './plugins'
import config from './utils/config'

require('./models')

function getServer () {
  const server = new Hapi.Server({
    connections: {
      routes: {
        cors: true
      }
    }
  })

  server.connection({
    port: config.port,
    host: config.host
  })

  return server
}

export async function start (server) {
  return new Promise((resolve, reject) => {
    server.start(error => {
      if (error) {
        return reject(error)
      }
      resolve(server)
    })
  })
}

export const server = getServer()

try {
  loadPlugins(server)
    .then(() => bootstrap(server))
    .then(() => start(server))
    .then(() => server.log('info', `Server running at: ${server.info.uri}`))
} catch (error) {
  console.error(error)
}
