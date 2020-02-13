import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import compress from 'koa-compress'
import helmet from 'koa-helmet'
import pinoLogger from 'koa-pino-logger'

export function installStandardKoaMiddlewares(app, { config }) {
  const loggerConfig = {
    name: 'http-logger',
    level: 'info',
    prettyPrint: false
  }
  if (config.isDev) {
    loggerConfig.serializers = {
      req: req => `${req.method} ${req.url}`,
      res: res => `${res.statusCode}`
    }
  }

  app.use(helmet())
  app.use(cors())
  app.use(compress())
  app.use(pinoLogger(loggerConfig))
  app.use(bodyParser())
}
