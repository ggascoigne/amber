'use strict'

import Hapi from 'hapi'
import loadPlugins from './plugins'
import config from './utils/config'
import { knex } from './orm'

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
      const cs = knex.client.connectionSettings
      server.log('info', `Database: ${knex.client.config.client}://${cs.host}:${cs.port}/${cs.user}@${cs.database}`)
      server.log('info', `Server running at: ${server.info.uri}`)
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
