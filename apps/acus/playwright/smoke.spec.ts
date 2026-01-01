import { test } from '../../../playwright/shared/test'
import { registerSharedAppTests } from '../../../playwright/shared/tests/sharedAppTests'
import { seededTestUsers } from '../../../playwright/shared/users'

registerSharedAppTests({
  appName: 'ACUS',
  test,
  users: seededTestUsers,
})
