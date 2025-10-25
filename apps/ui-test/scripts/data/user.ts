import path from 'node:path'

import { faker } from '@faker-js/faker/locale/en'
import fs from 'fs-extra'

const NO_USER_RECORDS = 555

const newUser = () => {
  const sex = faker.person.sexType()
  // const gender = faker.person.gender()
  const firstName = faker.person.firstName(sex)
  const lastName = faker.person.lastName()
  const fullName = `${firstName} ${lastName}`
  const email = faker.internet.email({
    firstName,
    lastName,
    provider: 'example.com',
  })
  const address = faker.location.streetAddress()
  const city = faker.location.city()
  const state = faker.location.state()
  const zipCode = faker.location.zipCode()
  const phone = faker.phone.number({ style: 'national' })

  return {
    firstName,
    lastName,
    fullName,
    email,
    address,
    city,
    state,
    zipCode,
    phone,
    gender: sex,
    subscriptionTier: faker.helpers.arrayElement(['free', 'basic', 'pro', 'enterprise']),
  }
}

export const createUserData = async (dir: string) => {
  const users = Array.from({ length: NO_USER_RECORDS }, newUser)
  return fs.writeJSON(path.join(dir, './users.json'), users, { spaces: 2 })
}
