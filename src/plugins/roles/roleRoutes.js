import Joi from 'joi'
import Role from '../../models/role'

import {
  createRoleHandler,
  deleteRoleHandler,
  getRoleHandler,
  getRolesHandler,
  patchRoleHandler,
  putRoleHandler
} from './roleHandlers'

export function routes (server, options, next) {
  server.route([
    {
      method: 'GET',
      path: '/roles',
      config: {
        tags: ['api'],
        // auth: {
        //   scope: ['iam:roles:read']
        // },
        handler: getRolesHandler
      }
    },
    {
      method: 'GET',
      path: '/roles/{id}',
      config: {
        tags: ['api'],
        // auth: {
        //   scope: ['iam:roles:read']
        // },
        validate: {
          params: {
            id: Joi.number().integer().required().description('object id')
          }
        },
        handler: getRoleHandler
      }
    },
    {
      method: 'POST',
      path: '/roles',
      config: {
        tags: ['api'],
        // auth: {
        //   scope: ['iam:roles:write']
        // },
        validate: {
          payload: Role.requiredSchema
        },
        handler: createRoleHandler
      }
    },
    {
      method: 'PATCH',
      path: '/roles/{id}',
      config: {
        tags: ['api'],
        // auth: {
        //   scope: ['iam:roles:write']
        // },
        validate: {
          params: {
            id: Joi.number().integer().required().description('object id')
          },
          payload: Role.schema
        },
        handler: patchRoleHandler
      }
    },
    {
      method: 'PUT',
      path: '/roles/{id}',
      config: {
        tags: ['api'],
        // auth: {
        //   scope: ['iam:roles:write']
        // },
        validate: {
          params: {
            id: Joi.number().integer().required().description('object id')
          },
          payload: Role.requiredSchema
        },
        handler: putRoleHandler
      }
    },
    {
      method: 'DELETE',
      path: '/roles/{id}',
      config: {
        tags: ['api'],
        // auth: {
        //   scope: ['iam:roles:delete']
        // },
        validate: {
          params: {
            id: Joi.number().integer().required().description('object id')
          }
        },
        handler: deleteRoleHandler
      }
    }
  ])

  next()
}
