import Joi from 'joi'
import Profile from '../../models/profile'

import {
  createProfileHandler,
  deleteProfileHandler,
  getProfileHandler,
  getProfilesHandler,
  patchProfileHandler,
  putProfileHandler
} from './profileHandlers'

export function routes (server, options, next) {
  server.route([
    {
      method: 'GET',
      path: '/profiles',
      config: {
        tags: ['api'],
        // auth: {
        //   scope: ['iam:profiles:read']
        // },
        handler: getProfilesHandler
      }
    },
    {
      method: 'GET',
      path: '/profiles/{id}',
      config: {
        tags: ['api'],
        // auth: {
        //   scope: ['iam:profiles:read']
        // },
        validate: {
          params: {
            id: Joi.number().integer().required().description('object id')
          }
        },
        handler: getProfileHandler
      }
    },
    {
      method: 'POST',
      path: '/profiles',
      config: {
        tags: ['api'],
        // auth: {
        //   scope: ['iam:profiles:write']
        // },
        validate: {
          payload: Profile.requiredSchema
        },
        handler: createProfileHandler
      }
    },
    {
      method: 'PATCH',
      path: '/profiles/{id}',
      config: {
        tags: ['api'],
        // auth: {
        //   scope: ['iam:profiles:write']
        // },
        validate: {
          params: {
            id: Joi.number().integer().required().description('object id')
          },
          payload: Profile.schema
        },
        handler: patchProfileHandler
      }
    },
    {
      method: 'PUT',
      path: '/profiles/{id}',
      config: {
        tags: ['api'],
        // auth: {
        //   scope: ['iam:profiles:write']
        // },
        validate: {
          params: {
            id: Joi.number().integer().required().description('object id')
          },
          payload: Profile.requiredSchema
        },
        handler: putProfileHandler
      }
    },
    {
      method: 'DELETE',
      path: '/profiles/{id}',
      config: {
        tags: ['api'],
        // auth: {
        //   scope: ['iam:profiles:delete']
        // },
        validate: {
          params: {
            id: Joi.number().integer().required().description('object id')
          }
        },
        handler: deleteProfileHandler
      }
    }
  ])

  next()
}
