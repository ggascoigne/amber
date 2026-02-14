# @amber/playwright

Shared Playwright testing utilities for the AmberCon project.

## Exports

- `config` - createAppConfig function for Playwright configuration
- `auth` - Authentication utilities (loginAsUser)
- `test` - Extended test fixture with coverage support
- `users` - Seeded test users
- `tests/*` - Shared test suites

## Usage

```typescript
import { createAppConfig } from '@amber/playwright/config'
import { loginAsUser } from '@amber/playwright/auth'
import { test, expect } from '@amber/playwright/test'
import { seededTestUsers } from '@amber/playwright/users'
```
