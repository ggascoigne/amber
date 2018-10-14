import koaStatic from 'koa-static'

export function installSharedStatic (app) {
  app.use(koaStatic(`${__dirname}/../../public`))
}
