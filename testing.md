# Local testing data setup

This repo now has a deterministic test seed for `acnw_test` using Prisma. It seeds two years (2024 and 2025), the standard 7 slots, lookups (minus shirt data), settings copied from the live config, rooms/hotel rooms, users/memberships, games, choices, and assignments. Transactions/stripe/shirt tables are left empty on purpose.

## Environment

Create `apps/acnw/.env.test` (gitignored) with at least:

```
DB_ENV=acnw
DATABASE_URL=postgres://acnw_user:123456@127.0.0.1:54320/acnw_test
ADMIN_DATABASE_URL=postgres://ggp:@127.0.0.1:54320/acnw
```

Use the admin URL that can drop/create `acnw_test`; adjust host/user/password as needed. The seed refuses to run unless `DATABASE_URL` contains `acnw_test`.

### Optional fake auth for local tests

Auth0 can be bypassed completely by either setting `NODE_ENV=test` or by setting `USE_FAKE_AUTH=true`. This means that both the test and the development UI can be run bypassing auth0.

- Visit `/api/auth/login` to pick an email from the DB (any password is accepted). This sets the same session cookie shape the app expects.
- `/api/auth/logout` clears the test session cookie.

## Commands

- `pnpm db:test:setup` – drop/create and migrate `acnw_test` using the test env.
- `pnpm db:test:seed` – run the Prisma seed (`packages/server/prisma/seed.test.ts`).
- `pnpm db:test:reset` – convenience wrapper to run both setup and seed.

All commands expect `apps/acnw/.env.test` to exist. They keep production/dev DBs untouched.

## Seed contents (high level)

- Settings: copied from the local DB, with 2025 as the active year and start date/slot entries for 2012–2025.
- Lookups: interest, attendance, roomType, roomPref, gamePlayerPref, bathroomType (shirt realm omitted).
- Slots: 7 entries (Thu–Sun) matching the current schedule template.
- Rooms/Hotel rooms: three room types plus matching details; hostel flagged as a gaming room.
- Users/Roles: two admins plus eight members, all with deterministic emails/names.
- Memberships: 6 for 2024, 6 for 2025 (mix of attendance patterns, volunteers, subsidies, accessibility notes).
- Games: 7 games for 2024, 6 for 2025 with varied slots/types/preferences; some late-night options.
- Game choices: preference coverage across slots to stress allocation, including returning-player flags.
- Assignments: a handful of placed players and GMs to validate reports/rosters.
- Empty tables: transactions, stripe, shirt_order, shirt_order_item remain blank.

## Next steps

- Point Vitest/Playwright helpers at `acnw_test`, calling `pnpm db:test:reset` before suites or restoring a dump from it when we add fixtures.
- Extend seeds as new features need coverage (e.g., payment flows when ready).***
