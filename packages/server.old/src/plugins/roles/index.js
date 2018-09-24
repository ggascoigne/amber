import { routes } from './roleRoutes'

module.exports.register = routes

module.exports.register.attributes = {
  name: 'roles',
  version: '1.0.0'
}
