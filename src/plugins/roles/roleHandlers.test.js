import hapi from 'hapi'
import { Role } from '../../models'
import { knex } from '../../orm'
import { loadTestPlugins } from '../../utils/testUtils'
import plugin from './index'
import {customMatchers} from '../../utils/customMatchers'

let role
let server

describe('roles', () => {
  const cleanup = async () => {
    return Role.deleteAll()
  }

  beforeEach(async () => {
    expect.extend(customMatchers)
    await cleanup()
    role = await Role.query()
      .insert({
        authority: 'ROLE_ADMIN'
      })

    await Role.query()
      .insert({
        authority: 'ROLE_USER'
      })

    server = new hapi.Server()
    server.connection()

    return loadTestPlugins(server, plugin)
  })

  afterAll(async () => {
    await cleanup()
    await knex.destroy()
  })

  test('[GET] /roles/{id}', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/roles/${role.id}`
    })
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload.role).toHaveProperty('authority', 'ROLE_ADMIN')
  })

  test('[GET] /roles/{id} - invalid id', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/roles/999999999`
    })
    expect(JSON.parse(response.payload).message).toBe('NotFoundError')
    expect(response.statusCode).toBe(404)
  })

  test('[GET] /roles', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/roles'
    })
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload.roles.length).toBe(2)
    expect(payload.roles.map(r => r.authority))
      .toEqual(expect.arrayContaining(['ROLE_ADMIN', 'ROLE_USER']))
  })

  test('[POST] /roles', async () => {
    const data = {
      authority: 'ROLE_TEST'
    }
    const response = await server.inject({
      method: 'POST',
      url: `/roles`,
      payload: data
    })
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).role.authority).toBe('ROLE_TEST')

    const payload = JSON.parse((await server.inject({
      method: 'GET',
      url: '/roles'
    })).payload)
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(payload.roles.length).toBe(3)
    expect(payload.roles.map(r => r.authority))
          .toEqual(expect.arrayContaining(['ROLE_ADMIN', 'ROLE_USER', 'ROLE_TEST']))
  })

  const postPutData = [
    {name: 'missing authority', payload: {}, statusCode: 400, errorType: 'v'},
    {name: 'null authority', payload: {authority: null}, statusCode: 400, errorType: 'v'},
    {name: 'invalid authority', payload: {authority: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'}, statusCode: 400, errorType: 'v'},
    {name: 'valid', payload: {authority: 'ROLE_TEST2'}, statusCode: 200, errorType: 'n'},
    {name: 'duplicate authority', payload: {authority: 'ROLE_USER'}, statusCode: 400, errorType: 'd'}
  ]

  describe('[POST /roles - validation', () => {
    postPutData.forEach((run) => {
      test(`[POST] /roles - validation '${run.name}'`, async () => {
        const response = await server.inject({
          method: 'POST',
          url: `/roles`,
          payload: run.payload
        })
        expect(response.statusCode).toBe(run.statusCode)
        run.errorType === 'd' && expect(response).toHaveDuplicateKey()
        run.errorType === 'v' && expect(response).toHaveValidationError()
      })
    })
  })

  test('[PATCH] /roles', async () => {
    const data = {
      authority: 'ROLE_EDITED'
    }
    const response = await server.inject({
      method: 'PATCH',
      url: `/roles/${role.id}`,
      payload: data
    })
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).role.authority).toBe('ROLE_EDITED')

    const payload = JSON.parse((await server.inject({
      method: 'GET',
      url: '/roles'
    })).payload)
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(payload.roles.length).toBe(2)
    expect(payload.roles.map(r => r.authority))
      .toEqual(expect.arrayContaining(['ROLE_EDITED', 'ROLE_USER']))
  })

  test('[PUT] /roles/{id}', async () => {
    const data = {
      authority: 'ROLE_EDITED'
    }
    const response = await server.inject({
      method: 'PUT',
      url: `/roles/${role.id}`,
      payload: data
    })
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).role.authority).toBe('ROLE_EDITED')

    const payload = JSON.parse((await server.inject({
      method: 'GET',
      url: '/roles'
    })).payload)
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(payload.roles.length).toBe(2)
    expect(payload.roles.map(r => r.authority))
      .toEqual(expect.arrayContaining(['ROLE_EDITED', 'ROLE_USER']))
  })

  describe('[PUT /roles/{id} - validation', () => {
    postPutData.forEach((run) => {
      test(`[PUT] /roles/{id} - validation '${run.name}'`, async () => {
        const response = await server.inject({
          method: 'PUT',
          url: `/roles/${role.id}`,
          payload: run.payload
        })
        expect(response.statusCode).toBe(run.statusCode)
        run.errorType === 'd' && expect(response).toHaveDuplicateKey()
        run.errorType === 'v' && expect(response).toHaveValidationError()
      })
    })
  })

  test('[DELETE] /roles/{id}', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/roles/${role.id}`
    })
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).success).toBe(true)

    const payload = JSON.parse((await server.inject({
      method: 'GET',
      url: '/roles'
    })).payload)
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(payload.roles.length).toBe(1)
  })
})
