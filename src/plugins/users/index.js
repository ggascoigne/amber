import Joi from 'joi'

import {
  createUserHandler,
  deleteUserHandler,
  getUserHandler,
  getUsersHandler,
  // getUserTokensHandler,
  // deleteUserTokenHandler,
  patchUserHandler,
  putUserHandler
} from './handlers'

const userPostPayloadSchema = {
  username: Joi.string().max(32).required(),
  password: Joi.string().max(64).regex(/[a-zA-Z0-9@-_]{3,30}/).required()
}

const userPatchPayloadSchema = {
  username: Joi.string().max(32),
  password: Joi.string().max(64).regex(/[a-zA-Z0-9@-_]{3,30}/)
}

module.exports.register = (server, options, next) => {
  server.route([
    {
      method: 'GET',
      path: '/users',
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
      path: '/users/{id}',
      config: {
        tags: ['api'],
        // auth: {
        //   scope: ['iam:users:read']
        // },
        handler: getUserHandler
      }
    },
    {
      method: 'POST',
      path: '/users',
      config: {
        tags: ['api'],
        // auth: {
        //   scope: ['iam:users:write']
        // },
        validate: {
          payload: userPostPayloadSchema
        },
        handler: createUserHandler
      }
    },
    {
      method: 'PATCH',
      path: '/users/{id}',
      config: {
        tags: ['api'],
        // auth: {
        //   scope: ['iam:users:write']
        // },
        validate: {
          payload: userPatchPayloadSchema
        },
        handler: patchUserHandler
      }
    },
    {
      method: 'PUT',
      path: '/users/{id}',
      config: {
        tags: ['api'],
        // auth: {
        //   scope: ['iam:users:write']
        // },
        handler: putUserHandler
      }
    },
    {
      method: 'DELETE',
      path: '/users/{id}',
      config: {
        tags: ['api'],
        // auth: {
        //   scope: ['iam:users:delete']
        // },
        handler: deleteUserHandler
      }
    // },
    // {
    //   method: 'GET',
    //   path: '/users/{id}/tokens',
    //   config: {
    //     tags: ['api'],
    //     auth: {
    //       scope: ['iam:tokens:read']
    //     },
    //     cache: {
    //       expiresIn: 10 * SECOND
    //     },
    //     handler: getUserTokensHandler
    //   }
    // },
    // {
    //   method: 'DELETE',
    //   path: '/users/{id}/tokens/{tokenId}',
    //   config: {
    //     tags: ['api'],
    //     auth: {
    //       scope: ['iam:tokens:delete']
    //     },
    //     cache: {
    //       expiresIn: 10 * SECOND
    //     },
    //     handler: deleteUserTokenHandler
    //   }
    }
  ])

  next()
}

module.exports.register.attributes = {
  name: 'users',
  version: '1.0.0'
}
