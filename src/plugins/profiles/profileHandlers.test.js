import hapi from 'hapi'
import { Profile } from '../../models'
import { knex } from '../../orm'
import { customMatchers } from '../../utils/customMatchers'
import { loadTestPlugins } from '../../utils/testUtils'
import plugin from './index'

let profile
let server

describe('profiles', () => {
  const cleanup = async () => {
    return Profile.deleteAll()
  }

  beforeEach(async () => {
    expect.extend(customMatchers)
    await cleanup()
    profile = await Profile.query()
      .insert({
        email: 'test@test.com',
        full_name: 'Test Account'
      })

    await Profile.query()
      .insert({
        email: 'test2@test.com',
        full_name: 'Test Account 2'
      })

    server = new hapi.Server()
    server.connection()

    return loadTestPlugins(server, plugin)
  })

  afterAll(async () => {
    await cleanup()
    await knex.destroy()
  })

  test('[GET] /profiles/{id}', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/profiles/${profile.id}`
    })
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload.profile).toHaveProperty('email', 'test@test.com')
  })

  test('[GET] /profiles/{id} - invalid id', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/profiles/999999999`
    })
    expect(JSON.parse(response.payload).message).toBe('NotFoundError')
    expect(response.statusCode).toBe(404)
  })

  test('[GET] /profiles', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/profiles'
    })
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload.profiles.length).toBe(2)
    expect(payload.profiles[0]).toHaveProperty('email', 'test@test.com')
  })

  test('[POST] /profiles', async () => {
    const data = {
      email: 'test3@test.com',
      full_name: 'Test Account 3'
    }
    const response = await server.inject({
      method: 'POST',
      url: `/profiles`,
      payload: data
    })
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).profile.email).toBe('test3@test.com')

    const payload = JSON.parse((await server.inject({
      method: 'GET',
      url: '/profiles'
    })).payload)
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(payload.profiles.length).toBe(3)
    expect(payload.profiles.map(p => p.email))
      .toEqual(expect.arrayContaining(['test@test.com', 'test2@test.com', 'test3@test.com']))
  })

  const postPutData = [
    {name: 'missing email', payload: {full_name: 'Test2 Account'}, statusCode: 400, errorType: 'v'},
    {name: 'missing full_name', payload: {email: 'foo@bar.com'}, statusCode: 400, errorType: 'v'},
    {name: 'invalid email', payload: {full_name: 'name', email: 'foo'}, statusCode: 400, errorType: 'v'},
    {name: 'valid', payload: {full_name: 'name', email: 'foo@bar.com'}, statusCode: 200, errorType: 'n'},
    {name: 'duplicate email', payload: {full_name: 'name', email: 'test2@test.com'}, statusCode: 400, errorType: 'd'},
    {
      name: 'empty snail mail',
      payload: {full_name: 'name', email: 'foo@bar.com', snail_mail_address: ''},
      statusCode: 400
    },
    {
      name: 'valid snail mail',
      payload: {full_name: 'name', email: 'foo@bar.com', snail_mail_address: 'some address'},
      statusCode: 200
    }
  ]

  describe('[POST /profiles - validation', () => {
    postPutData.forEach((run) => {
      test(`[POST] /profiles - validation '${run.name}'`, async () => {
        const response = await server.inject({
          method: 'POST',
          url: `/profiles`,
          payload: run.payload
        })
        expect(response.statusCode).toBe(run.statusCode)
        run.errorType === 'd' && expect(response).toHaveDuplicateKey()
        run.errorType === 'v' && expect(response).toHaveValidationError()
      })
    })
  })

  test('[PATCH] /profiles', async () => {
    const data = {
      email: 'test3@test.com'
    }
    const response = await server.inject({
      method: 'PATCH',
      url: `/profiles/${profile.id}`,
      payload: data
    })
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).profile.email).toBe('test3@test.com')

    const payload = JSON.parse((await server.inject({
      method: 'GET',
      url: '/profiles'
    })).payload)
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(payload.profiles.length).toBe(2)
    expect(payload.profiles.map(p => p.email))
      .toEqual(expect.arrayContaining(['test2@test.com', 'test3@test.com']))
  })

  describe('[PATCH /profiles/{id} - validation', () => {
    const runs = [
      {name: 'missing email', payload: {full_name: 'Test2 Account'}, statusCode: 200, errorType: 'n'},
      {name: 'missing full_name', payload: {email: 'foo@bar.com'}, statusCode: 200, errorType: 'n'},
      {name: 'invalid email', payload: {full_name: 'name', email: 'foo'}, statusCode: 400, errorType: 'v'},
      {name: 'valid', payload: {full_name: 'name', email: 'foo@bar.com'}, statusCode: 200, errorType: 'n'},
      {
        name: 'empty snail mail',
        payload: {full_name: 'name', email: 'foo@bar.com', snail_mail_address: ''},
        statusCode: 400,
        errorType: 'v'
      },
      {
        name: 'valid snail mail',
        payload: {full_name: 'name', email: 'foo@bar.com', snail_mail_address: 'some address'},
        statusCode: 200,
        errorType: 'n'
      }
    ]

    runs.forEach((run) => {
      test(`[PATCH] /profiles/{id} - validation '${run.name}'`, async () => {
        const response = await server.inject({
          method: 'PATCH',
          url: `/profiles/${profile.id}`,
          payload: run.payload
        })
        expect(response.statusCode).toBe(run.statusCode)
        run.statusCode === 400 && expect(response.payload).toMatch(/validation|ER_DUP_ENTRY/)
      })
    })
  })

  test('[PUT] /profiles/{id}', async () => {
    const data = {
      email: 'test3@test.com',
      full_name: 'Test Account 3'
    }
    const response = await server.inject({
      method: 'PUT',
      url: `/profiles/${profile.id}`,
      payload: data
    })
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).profile.email).toBe('test3@test.com')

    const payload = JSON.parse((await server.inject({
      method: 'GET',
      url: '/profiles'
    })).payload)
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(payload.profiles.length).toBe(2)
    expect(payload.profiles.map(p => p.email))
      .toEqual(expect.arrayContaining(['test2@test.com', 'test3@test.com']))
  })

  describe('[PUT /profiles/{id} - validation', () => {
    postPutData.forEach((run) => {
      test(`[PUT] /profiles/{id} - validation '${run.name}'`, async () => {
        const response = await server.inject({
          method: 'PUT',
          url: `/profiles/${profile.id}`,
          payload: run.payload
        })
        expect(response.statusCode).toBe(run.statusCode)
        run.errorType === 'd' && expect(response).toHaveDuplicateKey()
        run.errorType === 'v' && expect(response).toHaveValidationError()
      })
    })
  })

  test('[DELETE] /profiles/{id}', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/profiles/${profile.id}`
    })
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).success).toBe(true)

    const payload = JSON.parse((await server.inject({
      method: 'GET',
      url: '/profiles'
    })).payload)
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(payload.profiles.length).toBe(1)
  })
})
