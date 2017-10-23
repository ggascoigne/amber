'use strict'

import config from './utils/config'
import Hapi from 'hapi'
import loadPlugins from './plugins'

require('./models')

export function getServer () {
  const server = new Hapi.Server({
    connections: {
      routes: {
        cors: config.cors
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
      console.log(`Server running at: ${server.info.uri}`)
      resolve(server)
    })
  })
}

export const server = getServer()

try {
  loadPlugins(server)
  start(server)
} catch (error) {
  console.error(error)
}
