import hapi from 'hapi'
import { Role } from '../../models'
import { knex } from '../../orm'
import { customMatchers } from '../../utils/customMatchers'
import { fakeRole, loadTestPlugins, prepTestDatabaseOnce } from '../../utils/testUtils'
import plugin from './index'

let role1
let role2
let server

describe('roles', () => {
  beforeEach(async () => {
    await prepTestDatabaseOnce()
    expect.extend(customMatchers)
    role1 = await Role.query()
      .insert(fakeRole())

    role2 = await Role.query()
      .insert(fakeRole())

    server = new hapi.Server()
    server.connection()

    return loadTestPlugins(server, plugin)
  })

  afterAll(async () => {
    await knex.destroy()
  })

  test('[GET] /roles/{id}', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/roles/${role1.id}`
    })
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload.role).toHaveProperty('authority', role1.authority)
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
    expect(payload.roles.map(r => r.authority))
      .toEqual(expect.arrayContaining([role1.authority, role2.authority]))
  })

  test('[POST] /roles', async () => {
    const data = fakeRole()
    const response = await server.inject({
      method: 'POST',
      url: `/roles`,
      payload: data
    })
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).role.authority).toBe(data.authority)

    const payload = JSON.parse((await server.inject({
      method: 'GET',
      url: '/roles'
    })).payload)
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(payload.roles.map(r => r.authority))
      .toEqual(expect.arrayContaining([data.authority]))
  })

  const postPutData = [
    {name: 'missing authority', payload: {}, statusCode: 400, errorType: 'v'},
    {name: 'null authority', payload: {authority: null}, statusCode: 400, errorType: 'v'},
    {
      name: 'invalid authority',
      payload: {authority: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'},
      statusCode: 400,
      errorType: 'v'
    },
    {
      name: 'valid',
      get payload () {
        return fakeRole()
      },
      statusCode: 200,
      errorType: 'n'
    },
    {
      name: 'duplicate authority',
      payload: {
        get authority () {
          return role2.authority
        }
      },
      statusCode: 400,
      errorType: 'd'
    }
  ]

  describe('[POST /roles - validation', () => {
    postPutData.forEach((run) => {
      test(`[POST] /roles - validation '${run.name}'`, async () => {
        const response = await server.inject({
          method: 'POST',
          url: `/roles`,
          payload: run.payload
        })
        run.errorType === 'n' && expect(JSON.parse(response.payload).message).toBe(undefined)
        expect(response.statusCode).toBe(run.statusCode)
        run.errorType === 'd' && expect(response).toHaveDuplicateKey()
        run.errorType === 'v' && expect(response).toHaveValidationError()
      })
    })
  })

  test('[PATCH] /roles', async () => {
    const data = fakeRole()
    const response = await server.inject({
      method: 'PATCH',
      url: `/roles/${role1.id}`,
      payload: data
    })
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).role.authority).toBe(data.authority)

    const payload = JSON.parse((await server.inject({
      method: 'GET',
      url: '/roles'
    })).payload)
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(payload.roles.map(r => r.authority))
      .toEqual(expect.arrayContaining([data.authority]))
  })

  test('[PUT] /roles/{id}', async () => {
    const data = fakeRole()
    const response = await server.inject({
      method: 'PUT',
      url: `/roles/${role1.id}`,
      payload: data
    })
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).role.authority).toBe(data.authority)

    const payload = JSON.parse((await server.inject({
      method: 'GET',
      url: '/roles'
    })).payload)
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(payload.roles.map(r => r.authority))
      .toEqual(expect.arrayContaining([data.authority]))
  })

  describe('[PUT /roles/{id} - validation', () => {
    postPutData.forEach((run) => {
      test(`[PUT] /roles/{id} - validation '${run.name}'`, async () => {
        const response = await server.inject({
          method: 'PUT',
          url: `/roles/${role1.id}`,
          payload: run.payload
        })
        run.errorType === 'n' && expect(JSON.parse(response.payload).message).toBe(undefined)
        expect(response.statusCode).toBe(run.statusCode)
        run.errorType === 'd' && expect(response).toHaveDuplicateKey()
        run.errorType === 'v' && expect(response).toHaveValidationError()
      })
    })
  })

  test('[DELETE] /roles/{id}', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/roles/${role1.id}`
    })
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).success).toBe(true)
  })
})
