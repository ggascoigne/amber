import PgSimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector'
import { postgraphile } from 'postgraphile'
import ConnectionFilterPlugin from 'postgraphile-plugin-connection-filter'
const PgOrderByRelatedPlugin = require('@graphile-contrib/pg-order-by-related')

export function installPostGraphile(app, { rootPgPool, config }) {
  const {
    database: { connectionString, database }
  } = config
  app.use((ctx, next) => {
    // PostGraphile deals with (req, res) but we want access to sessions from `pgSettings`, so we make the ctx available on req.
    ctx.req.ctx = ctx
    return next()
  })

  if (config.isDev) {
    // don't print this in production, it contains a password
    console.log(`postgraphile using ${connectionString}`)
  }

  app.use(
    postgraphile(connectionString, 'public', {
      // Import our shared options
      debug: config.isDev,
      disableQueryLog: true,
      enableCors: config.isDev,
      graphiql: true, // need to secure this somehow
      ignoreRBAC: false,
      // pgSettings: opts.pgSettings,
      showErrorStack: config.isDev,
      watchPg: config.isDev,

      // Since we're using sessions we'll also want our login plugin
      appendPlugins: [PgSimplifyInflectorPlugin, ConnectionFilterPlugin, PgOrderByRelatedPlugin]

      // Given a request object, returns the settings to set within the
      // Postgres transaction used by GraphQL.
      // pgSettings (req) {
      //   return {
      //     role: 'graphiledemo_visitor',
      //     'jwt.claims.user_id': req.ctx.state.user && req.ctx.state.user.id,
      //   }
      // },

      // // The return value of this is added to `context` - the third argument of
      // // GraphQL resolvers. This is useful for our custom plugins.
      // additionalGraphQLContextFromRequest (req) {
      //   return {
      //     // Let plugins call privileged methods (e.g. login) if they need to
      //     rootPgPool,
      //
      //     // Use this to tell Passport.js we're logged in
      //     login: user =>
      //       new Promise((resolve, reject) => {
      //         req.ctx.login(user, err => (err ? reject(err) : resolve()))
      //       }),
      //   }
      // },
    })
  )
}
