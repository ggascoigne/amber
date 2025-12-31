# Add Playwright coverage for the ACNW app

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

The ExecPlan process is defined in `./.agent/PLANS.md` from the repository root, and this document must be maintained according to those rules.

## Purpose / Big Picture

This change introduces a Playwright test harness for the ACNW site so that we can start validating real user flows against the seeded test database and fake auth. After this change, a developer can run Playwright and watch an ACNW browser session load the site, log in as seeded users, and confirm key pages render. The structure is shared so that the ACUS app can plug into the same helpers and test structure when we add its own Playwright config.

## Progress

- [x] (2025-12-23 05:23Z) Reviewed repository instructions, test seed data, and fake-auth login flow.
- [x] (2025-12-23 05:26Z) Added shared Playwright config + helpers for app reuse.
- [x] (2025-12-23 05:26Z) Added ACNW Playwright config, smoke tests, and scripts.
- [x] (2025-12-23 05:26Z) Updated ignores and Playwright dependencies.
- [x] (2025-12-23 06:04Z) Cleaned test artifacts and added coverage support helpers.
- [x] (2025-12-24 23:06Z) Mirrored Playwright config and scripts for ACUS.
- [x] (2025-12-24 23:16Z) Added ACUS test env file and allowed acus_test seed validation.
- [x] (2025-12-24 23:19Z) Ensured ACNW/ACUS test envs use _test databases and seed guards accept acus_test.
- [x] (2025-12-24 23:57Z) Added ACNW membership registration Playwright coverage and fixed test seed sequences.
- [x] (2025-12-25 02:01Z) Stabilized membership tests with login wait fix and dynamic room choice.

## Surprises & Discoveries

- Observation: The fake-auth login form in `packages/server/src/auth/fakeAuth/login.ts` is plain HTML with a `<select>` for the email and no form label associations.
  Evidence: The login form renders labels without `for` attributes and uses a native `<select>` element.
- Observation: Running Playwright against ACNW triggered a fake-auth cookie reader crash because `NextApiRequest.headers` does not implement `get()`.
  Evidence: `readCookie` threw `TypeError: req?.headers?.get is not a function` on the first request to `/`.
- Observation: The Welcome page exposes two login links (header login and the “Login / Sign Up” button), so Playwright locator queries must disambiguate.
  Evidence: `getByRole('link', { name: /login/i })` failed strict mode because it matched two links.
- Observation: ACUS test seeding failed because the seed guard only recognized `acnw_test` in `DATABASE_URL`.
  Evidence: Playwright run failed with `Refusing to seed non-test database` when using the ACUS test database.
- Observation: Membership creation in the seeded DB failed with a unique constraint because the membership ID sequence was not advanced after seeding.
  Evidence: `membership_id_seq` remained at `2` while max membership ID was `12`, causing `tx.membership.create()` to error.
- Observation: Playwright login helper returned early because `waitForURL` matched the login page query string.
  Evidence: Tests stalled on `/api/auth/login?returnTo=/membership/new` while waiting for wizard elements.

## Decision Log

- Decision: Place shared Playwright helpers in a top-level `playwright` directory and import them from app-specific test suites.
  Rationale: This keeps app-specific tests lightweight while giving both ACNW and ACUS access to the same helpers without creating a new package.
  Date/Author: 2025-12-23 / Codex
- Decision: Configure Playwright to start ACNW with `pnpm -F acnw dev:test` and reuse an existing server when not on CI.
  Rationale: The `dev:test` script already seeds the test database and enables fake auth, and reuse improves local iteration speed.
  Date/Author: 2025-12-23 / Codex
- Decision: Add `@playwright/test` to the root devDependencies so shared config resolves cleanly.
  Rationale: Shared Playwright helpers live at the repository root, so Node resolves dependencies from the root `node_modules`.
  Date/Author: 2025-12-23 / Codex
- Decision: Guard fake-auth cookie reads to handle both `NextApiRequest` and `NextRequest` header shapes.
  Rationale: The Playwright-driven server-side render path supplies a `NextApiRequest` with a plain object header map, which lacks `get()`.
  Date/Author: 2025-12-23 / Codex
- Decision: Gate Playwright coverage collection behind `PLAYWRIGHT_COVERAGE` and write JSON payloads under each app's `coverage/playwright` folder.
  Rationale: Coverage collection should be opt-in while keeping the output alongside each app's artifacts.
  Date/Author: 2025-12-23 / Codex
- Decision: Accept `acus_test` as a valid test database name in seed guards and provide a matching `.env.test`.
  Rationale: ACUS uses a separate test database, so the seed guard must recognize both database names.
  Date/Author: 2025-12-24 / Codex
- Decision: Keep `DATABASE_URL` and `ADMIN_DATABASE_URL` pointing at `_test` databases in both app `.env.test` files.
  Rationale: The test setup should never point at non-test databases, even for admin connections.
  Date/Author: 2025-12-24 / Codex
- Decision: Reset the membership ID sequence after seeding so new registrations can insert rows.
  Rationale: The seed inserts explicit IDs, so the sequence must be advanced to avoid primary key collisions.
  Date/Author: 2025-12-24 / Codex
- Decision: Match login redirects by pathname and pick a room option dynamically if the preferred choice is sold out.
  Rationale: Avoids false-positive login waits and keeps the membership flow stable as room availability changes.
  Date/Author: 2025-12-25 / Codex

## Outcomes & Retrospective

Playwright now boots ACNW via `pnpm -F acnw dev:test`, logs in with fake auth, completes smoke tests, and runs ACNW membership registration coverage that asserts date persistence and single-year registration rules. The same shared suite is wired for ACUS with `pnpm -F acus dev:test`, and coverage artifacts can be collected by running `pnpm -F acnw test:e2e:coverage` or `pnpm -F acus test:e2e:coverage` to generate JSON under each app's `coverage/playwright` folder.

## Context and Orientation

The repository already seeds test data via `packages/server/scripts/lib/testData.ts`, with two admin users (`alex.admin@example.com` and `casey.coordinator@example.com`) and additional regular users. The ACNW app lives in `apps/acnw`, with a `dev:test` script that seeds the DB and starts Next.js with fake auth enabled. The fake-auth login page lives in `packages/server/src/auth/fakeAuth/login.ts` and supports `/api/auth/login` with an email selector. Playwright is already used in `apps/ui-test`, but ACNW has no Playwright configuration yet.

## Plan of Work

Create a shared Playwright configuration helper in a new top-level `playwright` directory, alongside shared login helpers and user constants derived from the seeded test data. Add an ACNW-specific `playwright.config.ts` and a first set of smoke tests under `apps/acnw/playwright` that import the shared helpers and verify the welcome page, membership summary for a regular user, and settings access for an admin user. Update `apps/acnw/package.json` with Playwright dependencies and scripts, and add appropriate ignores for Playwright output folders.

## Concrete Steps

From the repository root, run the following commands when validating locally:

    pnpm -F acnw dev:test
    pnpm -F acnw test:e2e

The first command should start Next.js on `http://localhost:30000` using the test database; the second should launch Playwright and report three passing tests in the ACNW suite.

## Validation and Acceptance

Acceptance means Playwright can launch ACNW against the seeded test database, log in with the fake auth flow, and verify the welcome page, membership summary, and settings page. The test `apps/acnw/playwright/smoke.spec.ts` should fail before the Playwright config exists and pass after the changes. The command `pnpm -F acnw test:e2e` should report all tests passing and write an HTML report to `apps/acnw/playwright-report`.

## Idempotence and Recovery

Running `pnpm -F acnw dev:test` is safe to repeat; it recreates the test database and re-seeds data. If Playwright fails partway through, it is safe to rerun `pnpm -F acnw test:e2e` after confirming the server is running or letting the Playwright config restart it.

## Artifacts and Notes

The Playwright suite will live under `apps/acnw/playwright`, and shared helpers will live under `playwright/shared`. The HTML report is expected at `apps/acnw/playwright-report` when tests complete.

## Interfaces and Dependencies

Use `@playwright/test` to define test cases and configuration, and `@axe-core/playwright` only once the initial smoke tests are stable. Define a shared helper `loginAsUser(page, email, options)` in `playwright/shared/auth.ts` that navigates to `/api/auth/login`, selects the provided email, submits the form, and waits for the redirect to `options.returnTo` (default `/`). Define a shared user map in `playwright/shared/users.ts` containing the seeded admin and regular user emails. The ACNW Playwright config should import a shared `createAppConfig` helper from `playwright/config.ts` and pass in the ACNW base URL, test directory, and the `pnpm -F acnw dev:test` web server command.

## Plan Revision Notes

2025-12-23 05:23Z: Initial ExecPlan created based on current repo state and user request.
2025-12-23 05:26Z: Marked Playwright scaffolding/tasks complete after adding configs, helpers, and tests.
2025-12-23 05:28Z: Noted root `@playwright/test` dependency needed for shared config resolution.
2025-12-23 05:31Z: Documented the fake-auth header fix required to run tests.
2025-12-23 05:33Z: Logged the need to disambiguate login link locators and updated outcomes.
2025-12-23 06:04Z: Added coverage support helper and script, plus noted artifact cleanup.
2025-12-24 23:06Z: Added ACUS Playwright config and scripts to match ACNW.
2025-12-24 23:16Z: Added ACUS test env and seed guard updates to allow acus_test.
2025-12-24 23:19Z: Confirmed ACNW/ACUS test env DB URLs use _test databases and documented the decision.
2025-12-24 23:57Z: Added membership registration Playwright tests and documented the membership sequence fix.
2025-12-25 02:01Z: Stabilized membership login waits and room selection logic for the new tests.
