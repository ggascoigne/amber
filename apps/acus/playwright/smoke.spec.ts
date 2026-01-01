import { test } from '@amber/playwright/test'
import { registerSharedAppTests } from '@amber/playwright/tests/sharedAppTests'
import { seededTestUsers } from '@amber/playwright/users'

registerSharedAppTests({
  appName: 'ACUS',
  test,
  users: seededTestUsers,
})
