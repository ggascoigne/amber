import { routes } from './authRoutes'

module.exports.register = routes

module.exports.register.attributes = {
  name: 'auth',
  version: '1.0.0'
}
