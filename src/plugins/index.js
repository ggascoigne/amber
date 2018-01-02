const serverConfig = [
  {
    register: require('good'),
    options: {
      reporters: {
        console: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{
            response: '*',
            request: '*',
            log: {
              include: ['info', 'debug', 'error']
            }
          }]
        }, {
          module: 'good-console'
        }, 'stdout']
      }
    }
  },
  {register: require('hapi-auth-jwt2')},
  {register: require('./response-update')},
  // endpoints
  {register: require('./users')},
  {register: require('./profiles')},
  {register: require('./roles')},
  {register: require('./auth')},
  // documentation
  {register: require('inert')},
  {register: require('vision')},
  {
    register: require('hapi-swagger'),
    options: {
      'info': {
        'title': 'AmberConNW API Documentation',
        'version': '1.0.0',
        'contact': {
          'name': 'Guy Gascoigne-Piggford',
          'email': 'guy@wyrdrune.com'
        }
      },
      'schemes': ['http'],
      // 'host': 'amberconnw.org',
      'documentationPath': '/api',
      securityDefinitions: {
        'jwt': {
          'type': 'apiKey',
          'name': 'Authorization',
          'in': 'header'
        }
      },
      security: [{'jwt': []}]
    }
  }
]

export default async function loadPlugins (server) {
  return new Promise((resolve, reject) => {
    server.register(serverConfig, (error) => {
      if (error) {
        reject(error)
        return
      }
      resolve(server)
    })
  })
}
