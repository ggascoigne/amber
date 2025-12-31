import { registerSharedAppTests } from '../../../playwright/shared/tests/sharedAppTests'
import { test } from '../../../playwright/shared/test'
import { seededTestUsers } from '../../../playwright/shared/users'

registerSharedAppTests({
  appName: 'ACNW',
  test,
  users: seededTestUsers,
})
