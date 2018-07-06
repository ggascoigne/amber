import * as Boom from 'boom'

export const getError = error => {
  if (error.message === 'NotFoundError') {
    return Boom.notFound(error.message)
  } else {
    return Boom.badRequest(error.message)
  }
}
