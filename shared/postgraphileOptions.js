const PgSimplifyInflectorPlugin = require('@graphile-contrib/pg-simplify-inflector')
const ConnectionFilterPlugin = require('postgraphile-plugin-connection-filter')
const PgOrderByRelatedPlugin = require('@graphile-contrib/pg-order-by-related')

exports.options = {
  dynamicJson: true,
  cors: false,
  graphiql: false,
  graphqlRoute: '/api/graphql',
  // externalUrlBase: `/${process.env.AWS_STAGE}`,
  absoluteRoutes: false,
  disableQueryLog: false,
  enableCors: false,
  ignoreRBAC: false,
  showErrorStack: false,
  watchPg: false,
  appendPlugins: [PgSimplifyInflectorPlugin, ConnectionFilterPlugin, PgOrderByRelatedPlugin],
}
