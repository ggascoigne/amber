// based heavily upon https://github.com/pankajpatel/hapi-response-time/blob/master/README.md

let Plugin = {}

Plugin.register = function (server, options, next) {
  server.ext('onRequest', function (request, reply) {
    request.headers['x-req-start'] = (new Date()).getTime()
    return reply.continue()
  })
  server.ext('onPreResponse', function (request, reply) {
    const start = parseInt(request.headers['x-req-start'])
    const end = (new Date()).getTime()
    const response = request.response
    try {
      if (response.isBoom) {
        response.output.headers = {
          ...response.output.headers,
          'x-req-start': start,
          'x-res-end': end,
          'x-response-time': end - start
        }
        response.output.payload = {
          ...response.output.payload,
          success: 'false'
        }
      } else {
        response
          .header('x-req-start', start)
          .header('x-res-end', end)
          .header('x-response-time', end - start)
      }
    } catch (e) {
      console.log(e)
    }
    return reply.continue()
  })
  next()
}

Plugin.register.attributes = {
  name: 'response-update',
  version: '1.0.0'
}

module.exports = Plugin
