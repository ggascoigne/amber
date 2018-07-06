import Joi from 'joi'
import User from '../../models/user'

import {
  createUserHandler,
  deleteUserHandler,
  getUserHandler,
  getUsersHandler,
  patchUserHandler,
  putUserHandler
} from './userHandlers'

export function routes (server, options, next) {
  server.route([
    {
      method: 'GET',
      path: '/api/users',
      config: {
        // description: 'Gets all Users',
        // notes: 'something',
        tags: ['api'],
        // auth: {
        //   scope: ['iam:users:read']
        // },
        handler: getUsersHandler
      }
    },
    {
      method: 'GET',
      path: '/api/users/{id}',
      config: {
        tags: ['api'],
        // auth: {
        //   scope: ['iam:users:read']
        // },
        validate: {
          params: {
            id: Joi.number()
              .integer()
              .required()
              .description('object id')
          }
        },
        handler: getUserHandler
      }
    },
    {
      method: 'POST',
      path: '/api/users',
      config: {
        tags: ['api'],
        // auth: {
        //   scope: ['iam:users:write']
        // },
        validate: {
          payload: User.requiredSchema
        },
        handler: createUserHandler
      }
    },
    {
      method: 'PATCH',
      path: '/api/users/{id}',
      config: {
        tags: ['api'],
        // auth: {
        //   scope: ['iam:users:write']
        // },
        validate: {
          payload: User.schema,
          params: {
            id: Joi.number()
              .integer()
              .required()
              .description('object id')
          }
        },
        handler: patchUserHandler
      }
    },
    {
      method: 'PUT',
      path: '/api/users/{id}',
      config: {
        tags: ['api'],
        // auth: {
        //   scope: ['iam:users:write']
        // },
        validate: {
          params: {
            id: Joi.number()
              .integer()
              .required()
              .description('object id')
          }
        },
        handler: putUserHandler
      }
    },
    {
      method: 'DELETE',
      path: '/api/users/{id}',
      config: {
        tags: ['api'],
        // auth: {
        //   scope: ['iam:users:delete']
        // },
        validate: {
          params: {
            id: Joi.number()
              .integer()
              .required()
              .description('object id')
          }
        },
        handler: deleteUserHandler
      }
    }
  ])

  next()
}
