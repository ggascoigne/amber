import jwt from 'jsonwebtoken'
import { knex } from '../orm'
import { fakeProfile, fakeUser, prepTestDatabaseOnce } from '../utils/testUtils'

import { Profile, Token, User } from './index'
import { userGraphUpdateOptions } from './user'

let profile
let user

const config = require('../utils/config')

describe('tokens', () => {
  beforeEach(async () => {
    await prepTestDatabaseOnce()
    profile = await Profile.query()
      .insert(fakeProfile())

    user = await User.query()
      .upsertGraph(await fakeUser(profile.id), userGraphUpdateOptions)
  })

  afterAll(async () => {
    await knex.destroy()
  })

  test('[Token.tokenize]', async () => {
    const token = await Token.tokenize(user.id)
    const decoded = jwt.verify(token, config.get('jwt_secret'))

    const expected = user.id
    const actual = decoded.user_id

    expect(actual).toBe(expected)
  })

  // test('[Token.isExpired] with unexpired token', async () => {
  //   await Token.tokenize(user.id)
  //
  //   const tokens = await Token.query()
  //   const token = tokens[0]
  //
  //   const expected = false
  //   const actual = token.isExpired()
  //
  //   expect(actual).toBe(expected)
  // })

  // test('[Token.isExpired] with expired token', async () => {
  //   const thirtyOneDays = new Date(new Date().getDate() - 31)
  //
  //   await Token.tokenize(user.id)
  //
  //   const tokens = await Token.query()
  //   const token = tokens[0]
  //
  //   await token.$query()
  //     .patch({last_used: thirtyOneDays})
  //   const updatedToken = await Token.query()
  //     .findById(token.id)
  //
  //   const expected = true
  //   const actual = updatedToken.isExpired()
  //
  //   expect(actual).toBe(expected)
  // })
})
