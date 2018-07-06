import hapi from 'hapi'
import _ from 'lodash'
import { Profile, Token, User } from '../../models'
import { TOKEN_EXPIRATION } from '../../models/token'
import { userGraphUpdateOptions } from '../../models/user'
import { knex } from '../../orm'
import { fakeProfile, fakeUser, loadTestPlugins, prepTestDatabaseOnce, roleTokenRefresh } from '../../utils/testUtils'
import { getScopes } from './helpers'

import plugin from './index'
import scopes from './scopes'

let profile
let profile2
let user
let server
let limitedUser

async function authLogin (username, password = 'password', expectedStatusCode = 200) {
  const response = await server.inject({
    method: 'POST',
    url: '/auth/login',
    payload: { username: username, password: password }
  })
  expect(response.statusCode).toEqual(expectedStatusCode)
  return JSON.parse(response.payload)
}

async function authValidate (accessToken, expectedStatusCode = 200) {
  const response = await server.inject({
    headers: { authorization: 'Bearer ' + accessToken },
    method: 'GET',
    url: '/auth/validate'
  })
  expect(response.statusCode).toEqual(expectedStatusCode)
  return JSON.parse(response.payload)
}

async function authRefresh (refreshToken, expectedStatusCode = 200) {
  const response = await server.inject({
    headers: { authorization: 'Bearer ' + refreshToken },
    method: 'POST',
    url: '/auth/refresh',
    payload: { grant_type: 'refresh_token', refresh_token: refreshToken }
  })
  expect(response.statusCode).toEqual(expectedStatusCode)
  return JSON.parse(response.payload)
}

async function authRevoke (accessToken, cuid, expectedStatusCode = 200) {
  const response = await server.inject({
    headers: { authorization: 'Bearer ' + accessToken },
    method: 'POST',
    url: '/auth/revoke',
    payload: { cuid }
  })
  expect(response.statusCode).toEqual(expectedStatusCode)
  return JSON.parse(response.payload)
}

describe('auth', () => {
  beforeEach(async () => {
    await prepTestDatabaseOnce()

    profile = await Profile.query().insert(await fakeProfile())

    profile2 = await Profile.query().insert(await fakeProfile())

    user = await User.query().upsertGraph(await fakeUser(profile.id), userGraphUpdateOptions)

    limitedUser = await User.query().upsertGraph(
      await fakeUser(profile2.id, [roleTokenRefresh]),
      userGraphUpdateOptions
    )

    server = new hapi.Server()
    server.connection()

    return loadTestPlugins(server, plugin)
  })

  afterAll(async () => {
    await knex.destroy()
  })

  test('getScopes', async () => {
    const s = getScopes(['ROLE_ADMIN'])
    expect(s).toEqual(_.keys(scopes))
  })

  describe('[POST] /auth/login', async () => {
    const data = [
      {
        name: 'valid by user',
        get usernameOrEmail () {
          return user.username
        }
      },
      {
        name: 'valid by email',
        get usernameOrEmail () {
          return profile.email
        }
      }
    ]

    data.forEach(async (run, index) => {
      test(`${index}: ${run.name}`, async () => {
        const payload = await authLogin(run.usernameOrEmail, 'password')
        expect(payload.message).toBe(undefined)
        expect(_.get(payload, 'username')).toEqual(user.username)
        expect(_.get(payload, 'roles')).not.toBe(undefined)
        expect(_.get(payload, 'token_type')).toEqual('Bearer')
        expect(_.get(payload, 'access_token')).not.toBe(undefined)
        const accessToken = await Token.verify(_.get(payload, 'access_token'))
        expect(accessToken.username).toEqual(user.username)
        expect(_.get(payload, 'expires_in')).toEqual(TOKEN_EXPIRATION)
        expect(_.get(payload, 'refresh_token')).not.toBe(undefined)
        const refreshToken = await Token.verify(_.get(payload, 'refresh_token'))
        expect(refreshToken.username).toEqual(user.username)
      })
    })
  })

  describe('[POST] /auth/login', async () => {
    const data = [
      {
        name: 'invalid username',
        get usernameOrEmail () {
          return 'junk'
        },
        get password () {
          return user.password
        }
      },
      {
        name: 'invalid password',
        get usernameOrEmail () {
          return profile.email
        },
        get password () {
          return 'junk'
        }
      }
    ]

    data.forEach(async (run, index) => {
      test(`${index}: ${run.name}`, async () => {
        const payload = await authLogin(run.usernameOrEmail, run.password, 401)
        expect(payload.message).toBe('Unauthorized')
      })
    })
  })

  test('[POST] /auth/login - disabled', async () => {
    await User.query()
      .throwIfNotFound()
      .patchAndFetchById(user.id, { enabled: false })

    const payload = await authLogin(user.username, 'password', 401)
    expect(payload.message).toBe('Unauthorized')
  })

  test('[POST] /auth/login - locked', async () => {
    await User.query()
      .throwIfNotFound()
      .patchAndFetchById(user.id, { account_locked: true })

    const payload = await authLogin(user.username, 'password', 401)
    expect(payload.message).toBe('Unauthorized')
  })

  test(`[GET] /auth/validate`, async () => {
    const accessToken = (await authLogin(user.username)).access_token
    const payload = await authValidate(accessToken)

    expect(payload.message).toBe(undefined)
    expect(_.get(payload, 'username')).toEqual(user.username)
    expect(_.get(payload, 'roles')).not.toBe(undefined)
    expect(_.get(payload, 'token_type')).toEqual('Bearer')
    expect(_.get(payload, 'access_token')).not.toBe(undefined)
    const newAccessToken = await Token.verify(_.get(payload, 'access_token'))
    expect(newAccessToken.username).toEqual(user.username)
    expect(_.get(payload, 'expires_in')).toBeLessThanOrEqual(TOKEN_EXPIRATION)
    expect(_.get(payload, 'refresh_token')).toBe(undefined)
  })

  test(`[GET] /auth/validate - invalid token`, async () => {
    const accessToken = (await authLogin(user.username)).access_token
    const payload = await authValidate('xx' + accessToken, 401)
    expect(payload.message).toBe('Invalid token')
  })

  test(`[GET] /auth/validate - insufficient scope`, async () => {
    const accessToken = (await authLogin(limitedUser.username)).access_token
    const payload = await authValidate(accessToken, 403)
    expect(payload.message).toBe('Insufficient scope')
  })

  test(`[POST] /auth/refresh`, async () => {
    const { access_token: accessToken, refresh_token: refreshToken } = await authLogin(user.username)
    const payload = await authRefresh(refreshToken)

    expect(payload.message).toBe(undefined)
    expect(_.get(payload, 'username')).toEqual(user.username)
    expect(_.get(payload, 'roles')).not.toBe(undefined)
    expect(_.get(payload, 'token_type')).toEqual('Bearer')
    expect(_.get(payload, 'access_token')).not.toBe(undefined)
    expect(_.get(payload, 'access_token')).not.toEqual(accessToken)
    const newAccessToken = await Token.verify(_.get(payload, 'access_token'))
    expect(newAccessToken.username).toEqual(user.username)
    expect(_.get(payload, 'expires_in')).toEqual(TOKEN_EXPIRATION)
    expect(_.get(payload, 'refresh_token')).toEqual(refreshToken)
  })

  test(`[POST] /auth/refresh - invalid payload`, async () => {
    const { refresh_token: refreshToken } = await authLogin(user.username)
    const response = await server.inject({
      headers: { authorization: 'Bearer ' + refreshToken },
      method: 'POST',
      url: '/auth/refresh',
      payload: { grant_type: 'junk', refresh_token: refreshToken }
    })
    const payload = JSON.parse(response.payload)
    expect(payload.message).toEqual('Invalid Payload')
    expect(response.statusCode).toBe(400)
  })

  test(`[POST] /auth/refresh - invalid token`, async () => {
    const { refresh_token: refreshToken } = await authLogin(user.username)

    const response = await server.inject({
      headers: { authorization: 'Bearer ' + refreshToken },
      method: 'POST',
      url: '/auth/refresh',
      payload: { grant_type: 'refresh_token', refresh_token: 'foo' }
    })
    const payload = JSON.parse(response.payload)
    expect(payload.message).toEqual('Invalid Payload')
    expect(response.statusCode).toBe(400)
  })

  test(`[POST] /auth/refresh - invalid auth token`, async () => {
    const { refresh_token: refreshToken } = await authLogin(user.username)
    const payload = await authRefresh('x' + refreshToken, 401)
    expect(payload.message).toEqual('Invalid token')
  })

  test(`[POST] /auth/revoke`, async () => {
    const { access_token: accessToken, refresh_token: refreshToken } = await authLogin(user.username)
    const tokenToRevoke = await Token.verify(refreshToken)
    await authRevoke(accessToken, tokenToRevoke.cuid)
    const payload = await authRefresh(refreshToken, 401)
    expect(payload.message).toBe('Unauthorized')
  })
})
