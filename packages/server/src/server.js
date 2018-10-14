const http = require('http')
const Koa = require('koa')
const pg = require('pg')
const postgraphileUtils = require('./utils/postgraphile')
const middleware = require('./middleware')
import config from './utils/config'

const rootPgPool = new pg.Pool({
  connectionString: config.database.connectionString
})

// We're using a non-super-user connection string, so we need to install the
// watch fixtures ourselves.
if (config.isDev) {
  postgraphileUtils.installWatchFixtures(rootPgPool)
}

const app = new Koa()
const server = http.createServer(app.callback())

middleware.installStandardKoaMiddlewares(app, { config })
middleware.installPostGraphile(app, { rootPgPool, config })
middleware.installSharedStatic(app)
// middleware.installFrontendServer(app, server)

server.listen(config.port)
console.log(`running on ${config.isDev ? 'http' : 'https'}://${config.host}:${config.port}/`)
