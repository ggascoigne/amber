import Joi from 'joi'

import {
  createProfileHandler,
  deleteProfileHandler,
  getProfileHandler,
  getProfilesHandler,
  patchProfileHandler,
  putProfileHandler
} from './handlers'

const policyPostPayloadSchema = {
  full_name: Joi.string().max(64).required(),
  email: Joi.string().email().max(64).required(),
  snail_mail_address: Joi.string().max(250),
  phone_number: Joi.string().max(32)
}

const policyPatchPayloadSchema = {
  full_name: Joi.string().max(64),
  email: Joi.string().email().max(64),
  snail_mail_address: Joi.string().max(250),
  phone_number: Joi.string().max(32)
}

module.exports.register = (server, options, next) => {
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
          payload: policyPostPayloadSchema
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
          payload: policyPatchPayloadSchema
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
        handler: deleteProfileHandler
      }
    }
  ])

  next()

}

module.exports.register.attributes = {
  name: 'profiles',
  version: '1.0.0'
}
