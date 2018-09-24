import { knex } from '../orm'
import { customMatchers } from '../utils/customMatchers'
import { fakeProfile, fakeUser, prepTestDatabaseOnce } from '../utils/testUtils'

import { Profile, User } from './index'
import { userGraphUpdateOptions } from './user'

let profile
let user

describe('user', () => {
  beforeAll(async () => {
    await prepTestDatabaseOnce()
    expect.extend(customMatchers)

    for (let i = 0; i < 5; i++) {
      const p = await Profile.query().insert(fakeProfile())
      await User.query().upsertGraph(fakeUser(p.id), userGraphUpdateOptions)
    }
    profile = await Profile.query().insert(fakeProfile())

    user = await User.query().upsertGraph(fakeUser(profile.id), userGraphUpdateOptions)
  })

  afterAll(async () => {
    await knex.destroy()
  })

  test('findByUsernameOrEmail - email', async () => {
    const u = await User.findByUsernameOrEmail(profile.email)
    expect(u.username).toEqual(user.username)
  })

  test('findByUsernameOrEmail - username', async () => {
    const u = await User.findByUsernameOrEmail(user.username)
    expect(u.username).toEqual(user.username)
  })

  test('findByUsernameOrEmail - missing', async () => {
    expect.assertions(1)
    await expect(User.findByUsernameOrEmail('some random junk')).rejects.toBeNotFound()
  })

  test('findByUsername', async () => {
    const u = await User.findByUsername(user.username)
    expect(u.username).toEqual(user.username)
  })

  test('autheticate', async () => {
    const u = await User.authenticate(profile.email, 'password')
    expect(u.username).toEqual(user.username)
  })
})
