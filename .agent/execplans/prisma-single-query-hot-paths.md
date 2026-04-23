# Refactor High-Value Transaction Queries Toward Single-Query Shapes

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This document must be maintained in accordance with `/Users/ggp/dev/git/amber/.agent/PLANS.md`.

## Purpose / Big Picture

This change keeps the `pg` driver warning fixed without forcing every transaction-backed read path into many sequential Prisma queries. After this work, the hottest refactored paths should still respect the transaction and row-level-security session requirements in `packages/server/src/api/inRlsTransaction.ts`, but they should do less round-trip work by using single-query SQL shapes where that is actually a good tradeoff. The user-visible proof is that `pnpm -F acnw test:e2e` still passes and no longer prints the `Calling client.query() when the client is already executing a query` deprecation warning.

## Progress

- [x] (2026-04-22 20:46Z) Reviewed the current manual hydration refactors and identified the first implementation targets: membership reads, transaction reads/mutation return payloads, and the schedule room-assignment loader.
- [x] (2026-04-22 21:09Z) Replaced the membership readers in `packages/server/src/api/routers/memberships/queries.ts` with one-query SQL-backed hydration while preserving the nested membership, user, profile, and hotel-room shape.
- [x] (2026-04-22 22:12Z) Cleaned the membership reader implementation up further by moving the SQL into Prisma typed-SQL source files under `packages/server/prisma/sql` and switching `memberships/queries.ts` to `$queryRawTyped(...)`.
- [x] (2026-04-22 21:14Z) Replaced the transaction readers and mutation return hydration in `packages/server/src/api/routers/transaction/{queries,mutations}.ts` with one-query SQL-backed hydration.
- [x] (2026-04-22 21:18Z) Refactored `packages/server/src/api/routers/roomAssignments/getScheduleRoomAssignmentData.ts` so the room list, assignment occupancy, and availability state come from one query instead of three.
- [x] (2026-04-22 21:55Z) Validated the original single-query refactor with `pnpm tsgo`, `pnpm lint`, targeted Playwright for membership and room assignment flows, and `pnpm -F acnw test:e2e`.
- [ ] Re-run the membership Playwright flow after the typed-SQL cleanup once the existing `apps/acnw` dev server on port `30000` is no longer blocking Playwright’s test server startup.

## Surprises & Discoveries

- Observation: The earlier deprecation warning was not only caused by explicit `Promise.all(tx.*)` code. Nested Prisma relation loading inside an interactive transaction could also trigger the same single-client concurrency warning.
  Evidence: A traced Playwright run showed the warning during the membership registration flow on `memberships.getMembershipByYearAndId`, and a later traced run showed the remaining warning on the `transactions.createTransaction` path.

- Observation: Running two ACNW Playwright jobs in parallel from the same workspace caused `EADDRINUSE` on port `30002`, so the validation steps had to run sequentially.
  Evidence: A concurrent validation attempt failed with `Error: listen EADDRINUSE: address already in use :::30002`.

- Observation: Playwright browser launch still fails inside the default sandbox on macOS with `MachPortRendezvousServer ... Permission denied`, so the final behavioral validation required outside-sandbox runs.
  Evidence: The first sandboxed validation attempt failed during Chromium launch; rerunning the same commands outside the sandbox succeeded.

- Observation: A user-owned or pre-existing `next dev` process for `apps/acnw` can block Playwright validation even when Playwright wants a different port, because Next.js refuses to start a second dev server in the same app directory.
  Evidence: A post-cleanup run of `pnpm -F acnw exec playwright test playwright/membership.spec.ts --workers=1 --reporter=line` failed with `Another next dev server is already running` and reported PID `25772` on port `30000`.

## Decision Log

- Decision: Limit this refactor to the “best candidate” group instead of trying to collapse every sequential query path.
  Rationale: Large snapshot builders such as room-assignment dashboards and game-assignment dashboards return several top-level collections. Replacing them with one giant SQL query would reduce maintainability more than it would help latency.
  Date/Author: 2026-04-22 / Codex

- Decision: Use hand-written SQL-backed queries for the targeted paths rather than trying to restore nested Prisma `include` usage.
  Rationale: The generated client in this repo does not surface a `relationLoadStrategy` option, and the observed warning came from Prisma relation loading inside a pinned transaction. One-query SQL is the direct and predictable fix.
  Date/Author: 2026-04-22 / Codex

- Decision: Keep `getAllMembersBy` on the existing Prisma-based path for now.
  Rationale: The “best candidate” group only covered the four `getMembership*` readers. The admin member search path would need more complex JSON aggregation to preserve its nested memberships shape, and it was not part of the observed warning path.
  Date/Author: 2026-04-22 / Codex

- Decision: Use Prisma typed SQL files for the membership readers instead of keeping the SQL text inline in `memberships/queries.ts`.
  Rationale: The repository already uses generated typed SQL helpers for low-level SQL access, and the membership query is cleaner to maintain when the SQL lives in `packages/server/prisma/sql/*.sql` and the TypeScript file only performs row-to-object reduction.
  Date/Author: 2026-04-22 / Codex

## Outcomes & Retrospective

The targeted refactor landed on the three highest-value paths. Membership readers now load membership, user, profile, and hotel room data in one SQL query per endpoint. Transaction readers and mutation return payloads now load their related user and membership details in one SQL query per read. The schedule room-assignment loader now reads room occupancy and availability in one query after fetching the target game.

The end result preserved behavior while removing the `pg` deprecation warning from the ACNW end-to-end run. Validation for the original refactor completed with `pnpm tsgo`, `pnpm lint`, `pnpm -F acnw exec playwright test playwright/membership.spec.ts --workers=1 --reporter=line`, `pnpm -F acnw exec playwright test playwright/room-assignments-initial.spec.ts --workers=1 --reporter=line`, and `pnpm -F acnw test:e2e`. The follow-up membership typed-SQL cleanup is type- and lint-clean, and its behavioral re-check is only blocked by the existing `apps/acnw` dev server process that Playwright refuses to coexist with.

## Context and Orientation

`packages/server/src/api/inRlsTransaction.ts` wraps most tRPC database handlers in an interactive Prisma transaction. That transaction sets PostgreSQL session variables such as `user.id` and `user.admin`, which are required for row-level security. Because the transaction is pinned to one PostgreSQL client, explicit concurrent queries on `tx` are unsafe. The recent safety refactor changed several paths from parallel Prisma calls to sequential ones.

Three of those sequential paths are worth further refinement:

`packages/server/src/api/routers/memberships/queries.ts` currently reads memberships, then separately hydrates users, profiles, and hotel rooms. The primary read endpoints now take up to four sequential queries even though the result shape is a single nested membership object graph.

`packages/server/src/api/routers/transaction/queries.ts` and `packages/server/src/api/routers/transaction/mutations.ts` currently read transactions first and then hydrate related user and membership data in follow-up queries. The nested data needed here is shallow and should map cleanly to SQL joins.

`packages/server/src/api/routers/roomAssignments/getScheduleRoomAssignmentData.ts` currently reads all rooms, then reads slot assignments, then reads slot availability, and finally merges those in memory. For a single slot, those three reads can be represented directly as one room-centered query with left joins.

The repository already uses SQL-backed Prisma calls in places such as `packages/server/src/auth/apiAuthUtils.ts` via generated typed SQL helpers. For this refactor, the important requirement is the query shape, not whether the SQL is typed or raw, as long as the code remains readable and the returned JS objects preserve the current API contract.

## Plan of Work

First, replace the membership readers with a shared SQL-backed loader that returns the same fields as the current `hydrateMemberships` path. Keep the external function signatures the same so the routers and callers do not change. The query should join `membership`, `user`, and `hotel_room`, and it should gather `profile` rows for the related user. If the profile relationship truly allows multiple rows, aggregate them to JSON and parse that JSON into the existing array shape; do not silently collapse it to one row.

Next, replace the transaction query hydration with a shared SQL-backed loader. This loader should join `transactions` to the actor user, optional origin user, and optional membership record. The mutation return helpers should reuse the same loader by querying the just-written transaction id instead of issuing a scalar write followed by separate Prisma hydration queries.

Then, rewrite `getScheduleRoomAssignmentData` so it still fetches the selected game first, but the room list itself is produced by one query that includes `occupiedByGameId` and `isAvailable` for each room in the selected slot and year. Preserve the current `currentAssignment` result and room ordering.

After the code changes, run the repository validations and the ACNW Playwright coverage that exercises the changed paths. If the SQL-backed refactor changes any ordering or nullability details, adjust the SQL so the output matches the previous behavior rather than changing callers.

## Concrete Steps

From `/Users/ggp/dev/git/amber`, update `packages/server/src/api/routers/memberships/queries.ts` so the four `getMembership*` readers stop using `membershipScalarSelect`, `hydrateMembershipUsers`, `hydrateHotelRooms`, and `hydrateMemberships`. Replace those helpers with a single shared loader that accepts a `WHERE` shape or route-specific parameters and returns the current nested membership result.

From `/Users/ggp/dev/git/amber`, update `packages/server/src/api/routers/transaction/queries.ts` so `getTransactionsWithWhere` reads the full transaction view in one query. Update `packages/server/src/api/routers/transaction/mutations.ts` so `createTransactionRecord` and `updateTransactionRecord` query back the written record through the same loader instead of manually hydrating from `transactionScalarSelect`.

From `/Users/ggp/dev/git/amber`, update `packages/server/src/api/routers/roomAssignments/getScheduleRoomAssignmentData.ts` so the room list query directly computes room occupancy and availability for the requested slot and year.

Validate from `/Users/ggp/dev/git/amber` with these commands:

pnpm tsgo
pnpm lint
pnpm -F acnw exec playwright test playwright/membership.spec.ts --workers=1 --reporter=line
pnpm -F acnw exec playwright test playwright/room-assignments-initial.spec.ts --workers=1 --reporter=line
pnpm -F acnw test:e2e

Success means the commands above pass and the ACNW end-to-end run does not print the `client.query()` deprecation warning.
