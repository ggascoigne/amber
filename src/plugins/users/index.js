import { routes } from './userRoutes'

module.exports.register = routes

module.exports.register.attributes = {
  name: 'users',
  version: '1.0.0'
}
