import faker from 'faker'
import hapi from 'hapi'
import { Profile } from '../../models'
import { knex } from '../../orm'
import { customMatchers } from '../../utils/customMatchers'
import { fakeProfile, loadTestPlugins, prepTestDatabaseOnce } from '../../utils/testUtils'
import plugin from './index'

let profile
let profile2
let server

describe('profiles', () => {
  beforeEach(async () => {
    await prepTestDatabaseOnce()
    expect.extend(customMatchers)
    profile = await Profile.query().insert(fakeProfile())

    profile2 = await Profile.query().insert(fakeProfile())

    server = new hapi.Server()
    server.connection()

    return loadTestPlugins(server, plugin)
  })

  afterAll(async () => {
    await knex.destroy()
  })

  test('[GET] /api/profiles/{id}', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/api/profiles/${profile.id}`
    })
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload.profile).toHaveProperty('email', profile.email)
  })

  test('[GET] /api/profiles/{id} - invalid id', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `/api/profiles/999999999`
    })
    expect(JSON.parse(response.payload).message).toBe('NotFoundError')
    expect(response.statusCode).toBe(404)
  })

  test('[GET] /api/profiles', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/profiles'
    })
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    const payload = JSON.parse(response.payload)
    expect(payload.profiles.map(p => p.email)).toEqual(expect.arrayContaining([profile.email]))
  })

  test('[POST] /api/profiles', async () => {
    const data = {
      email: faker.internet.email(),
      full_name: faker.name.findName()
    }
    const response = await server.inject({
      method: 'POST',
      url: `/api/profiles`,
      payload: data
    })
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).profile.email).toBe(data.email)

    const payload = JSON.parse(
      (await server.inject({
        method: 'GET',
        url: '/api/profiles'
      })).payload
    )
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(payload.profiles.map(p => p.email)).toEqual(
      expect.arrayContaining([profile.email, profile2.email, data.email])
    )
  })

  const postPutData = [
    { name: 'missing email', payload: { full_name: faker.name.findName() }, statusCode: 400, errorType: 'v' },
    { name: 'missing full_name', payload: { email: faker.internet.email() }, statusCode: 400, errorType: 'v' },
    {
      name: 'invalid email',
      payload: { full_name: faker.name.findName(), email: 'foo' },
      statusCode: 400,
      errorType: 'v'
    },
    {
      name: 'valid',
      payload: {
        full_name: faker.name.findName(),
        get email () {
          return faker.internet.email()
        }
      },
      statusCode: 200,
      errorType: 'n'
    },
    {
      name: 'duplicate email',
      payload: {
        full_name: faker.name.findName(),
        get email () {
          return profile2.email
        }
      },
      statusCode: 400,
      errorType: 'd'
    },
    {
      name: 'empty snail mail',
      payload: { full_name: faker.name.findName(), email: faker.internet.email(), snail_mail_address: '' },
      statusCode: 400
    },
    {
      name: 'valid snail mail',
      payload: {
        full_name: faker.name.findName(),
        get email () {
          return faker.internet.email()
        },
        snail_mail_address: 'some address'
      },
      statusCode: 200
    }
  ]

  describe('[POST /api/profiles - validation', () => {
    postPutData.forEach(run => {
      test(`[POST] /api/profiles - validation '${run.name}'`, async () => {
        const response = await server.inject({
          method: 'POST',
          url: `/api/profiles`,
          payload: run.payload
        })
        run.errorType === 'n' && expect(JSON.parse(response.payload).message).toBe(undefined)
        expect(response.statusCode).toBe(run.statusCode)
        run.errorType === 'd' && expect(response).toHaveDuplicateKey()
        run.errorType === 'v' && expect(response).toHaveValidationError()
      })
    })
  })

  test('[PATCH] /api/profiles', async () => {
    const data = {
      email: faker.internet.email()
    }
    const response = await server.inject({
      method: 'PATCH',
      url: `/api/profiles/${profile.id}`,
      payload: data
    })
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).profile.email).toBe(data.email)

    const payload = JSON.parse(
      (await server.inject({
        method: 'GET',
        url: '/api/profiles'
      })).payload
    )
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(payload.profiles.map(p => p.email)).toEqual(expect.arrayContaining([profile2.email, data.email]))
  })

  describe('[PATCH /api/profiles/{id} - validation', () => {
    const runs = [
      { name: 'missing email', payload: { full_name: faker.name.findName() }, statusCode: 200, errorType: 'n' },
      { name: 'missing full_name', payload: { email: faker.internet.email() }, statusCode: 200, errorType: 'n' },
      {
        name: 'invalid email',
        payload: { full_name: faker.name.findName(), email: 'foo' },
        statusCode: 400,
        errorType: 'v'
      },
      {
        name: 'valid',
        payload: { full_name: faker.name.findName(), email: faker.internet.email() },
        statusCode: 200,
        errorType: 'n'
      },
      {
        name: 'empty snail mail',
        payload: { full_name: faker.name.findName(), email: faker.internet.email(), snail_mail_address: '' },
        statusCode: 400,
        errorType: 'v'
      },
      {
        name: 'valid snail mail',
        payload: {
          full_name: faker.name.findName(),
          email: faker.internet.email(),
          snail_mail_address: 'some address'
        },
        statusCode: 200,
        errorType: 'n'
      }
    ]

    runs.forEach(run => {
      test(`[PATCH] /api/profiles/{id} - validation '${run.name}'`, async () => {
        const response = await server.inject({
          method: 'PATCH',
          url: `/api/profiles/${profile.id}`,
          payload: run.payload
        })
        run.errorType === 'n' && expect(JSON.parse(response.payload).message).toBe(undefined)
        expect(response.statusCode).toBe(run.statusCode)
        run.errorType === 'd' && expect(response).toHaveDuplicateKey()
        run.errorType === 'v' && expect(response).toHaveValidationError()
      })
    })
  })

  test('[PUT] /api/profiles/{id}', async () => {
    const data = fakeProfile()
    const response = await server.inject({
      method: 'PUT',
      url: `/api/profiles/${profile.id}`,
      payload: data
    })
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).profile.email).toBe(data.email)

    const payload = JSON.parse(
      (await server.inject({
        method: 'GET',
        url: '/api/profiles'
      })).payload
    )
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(payload.profiles.map(p => p.email)).toEqual(expect.arrayContaining([data.email]))
  })

  describe('[PUT /api/profiles/{id} - validation', () => {
    postPutData.forEach(run => {
      test(`[PUT] /api/profiles/{id} - validation '${run.name}'`, async () => {
        const response = await server.inject({
          method: 'PUT',
          url: `/api/profiles/${profile.id}`,
          payload: run.payload
        })
        run.errorType === 'n' && expect(JSON.parse(response.payload).message).toBe(undefined)
        expect(response.statusCode).toBe(run.statusCode)
        run.errorType === 'd' && expect(response).toHaveDuplicateKey()
        run.errorType === 'v' && expect(response).toHaveValidationError()
      })
    })
  })

  test('[DELETE] /api/profiles/{id}', async () => {
    const response = await server.inject({
      method: 'DELETE',
      url: `/api/profiles/${profile.id}`
    })
    expect(JSON.parse(response.payload).message).toBe(undefined)
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.payload).success).toBe(true)
  })
})
