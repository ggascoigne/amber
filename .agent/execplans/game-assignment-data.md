# Game Assignment Data APIs and Seed Updates

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This plan must be maintained in accordance with `.agent/PLANS.md` from the repository root.

## Purpose / Big Picture

After this change, the app has a single, admin-only data source for the Game Assignment dashboard that returns all games, assignments, member choices, and submission messages for a year in one request, plus a batch mutation for assignment updates. The seed data contains enough 2025 games, assignments, choices, and submission messages to make the dashboard interactive and testable. These data APIs are the foundation for the new UI and Playwright coverage.

## Progress

- [x] (2026-01-21 18:19Z) Drafted the ExecPlan with API shape, seed data scope, and validation steps.
- [x] (2026-01-21 19:11Z) Implemented the new tRPC query and mutation endpoints for assignment data and updates.
- [x] (2026-01-21 19:11Z) Updated client types and invalidation helpers to surface the new APIs.
- [x] (2026-01-21 19:11Z) Expanded seed data for 2025 assignments, choices, and submissions to support dashboard scenarios.
- [x] (2026-01-21 19:14Z) Validated with `pnpm tsgo`, `pnpm lint`, `pnpm test`.

## Surprises & Discoveries

- Observation: Pending.
  Evidence: Pending.

## Decision Log

- Decision: Add a single “dashboard data” query under `gameAssignments` that returns games, assignments, choices, submissions, and memberships for a year.
  Rationale: The dashboard needs multiple related datasets; bundling them reduces client complexity and network chatter.
  Date/Author: 2026-01-21 / Codex.

- Decision: Add a batch mutation for assignment changes instead of chaining many create/delete calls on the client.
  Rationale: Assignment moves are frequent and should be applied atomically to avoid partial updates.
  Date/Author: 2026-01-21 / Codex.

- Decision: Extend the 2025 seed data with two new games (including a shared slot) and at least one game submission message.
  Rationale: The dashboard UI needs meaningful move options and message panels for reliable Playwright assertions.
  Date/Author: 2026-01-21 / Codex.

- Decision: Return all assignments for the year (including gm < 0) and include membership `attending` flags in the dashboard payload.
  Rationale: The UI can decide whether to filter to scheduled assignments or attending-only members, and the raw data keeps future views flexible.
  Date/Author: 2026-01-21 / Codex.

## Outcomes & Retrospective

- Pending. (Fill in after implementation milestones are completed.)

## Context and Orientation

Game assignment data is stored in the `game_assignment` table (Prisma model `GameAssignment`) with a composite primary key of memberId, gameId, gm, year. A `gm` value less than 0 represents a GM who offered to run the game (not scheduled), while values greater than or equal to 0 represent scheduled assignments (GMs and players). Member game choices are stored in `game_choice` (Prisma model `GameChoice`) and submission messages in `game_submission` (Prisma model `GameSubmission`). tRPC routers live in `packages/server/src/api/routers`, and client types live in `packages/client/src/types.ts`. Seed data lives in `packages/server/scripts/lib/testData.ts`.

## Plan of Work

Add a new tRPC query in `packages/server/src/api/routers/gameAssignments.ts` named `getAssignmentDashboardData` that accepts `{ year: number }` and returns an object containing games, assignments, choices, submissions, and memberships for that year. Ensure this procedure uses `protectedProcedure` and `inRlsTransaction` so it honors row-level security. The query should include the minimum fields needed for the dashboard: game slot and player limits, assignment members’ names, choice ranks, and submission messages.

Add a batch mutation named `updateGameAssignments` in the same router that accepts `{ year: number, adds: Array<CreateGameAssignmentInput>, removes: Array<CreateGameAssignmentInput> }` where `CreateGameAssignmentInput` matches the existing create/delete payload (`{ gameId, gm, memberId, year }`). Execute deletes first and then creates in a single `inRlsTransaction` to keep assignments consistent. Use `deleteMany` with OR clauses for the composite key and `createMany` for adds; return counts so the UI can report success.

In `packages/server/src/api/routers/gameChoices.ts`, add a `getGameChoicesByYear` query that accepts `{ year: number }` and returns all choices plus submissions for the year, including membership user name and game slot/name. Add a mutation `upsertGameChoiceBySlot` that accepts `{ memberId, year, slotId, rank, gameId, returningPlayer }` and creates or updates the corresponding record. The dashboard uses this to edit member choices even when initial choice records are missing.

Update `packages/client/src/types.ts` to export new types for the new query and mutation inputs/outputs, and update `packages/client/src/invalidate.ts` with a `useInvalidateGameAssignmentDashboardQueries` hook that invalidates the new query. These types should use descriptive names and `Array<...>` syntax as per project conventions.

Extend the 2025 seed data in `packages/server/scripts/lib/testData.ts` by adding:

- Two new 2025 games in at least one shared slot (for move options).
- Additional 2025 game assignments so at least one game is over capacity and another has open spaces.
- One or more 2025 game choices with rank 0 to represent GMs.
- A new `gameSubmissions` array with at least one message for a 2025 member, and insert it in the seed function after `gameChoice.createMany`.

## Concrete Steps

1. Edit `packages/server/src/api/routers/gameAssignments.ts` to add `getAssignmentDashboardData` and `updateGameAssignments` using `protectedProcedure` and `inRlsTransaction`.
2. Edit `packages/server/src/api/routers/gameChoices.ts` to add `getGameChoicesByYear` and `upsertGameChoiceBySlot` using `protectedProcedure` and `inRlsTransaction`.
3. Update `packages/client/src/types.ts` and `packages/client/src/invalidate.ts` with new exported types and invalidation hooks.
4. Extend `packages/server/scripts/lib/testData.ts` with additional games, assignments, choices, and submissions as described above, and ensure `seed` creates them.
5. Run `pnpm tsgo` from the repo root and fix any type errors introduced by the new router outputs.

Expected transcript for the type-check step should resemble:

pnpm tsgo
...
Done in <N>s

## Validation and Acceptance

Acceptance for this plan is met when:

- `getAssignmentDashboardData` returns games with slotId, playerMin, playerMax, assignments (with member names), choices (with ranks), and submissions (with messages) for the requested year.
- `updateGameAssignments` can delete and create assignments in a single call and returns counts.
- `getGameChoicesByYear` and `upsertGameChoiceBySlot` allow the dashboard to read and modify choices for any member in a year.
- The seed data includes at least two 2025 games in the same slot, a submission message, and assignments that create both overrun and open-space scenarios.

Run from the repo root:

- `pnpm tsgo`
- `pnpm lint`
- `pnpm test`

If you defer lint/test to the UI plan’s Playwright coverage, record that explicitly in `Progress` and include the eventual test output in `Surprises & Discoveries` or `Artifacts and Notes`.

## Idempotence and Recovery

All changes are additive and safe to re-run. The seed data changes are deterministic; reseeding the test database will reset the data to the expected dashboard scenario. If the batch mutation fails, re-run it after verifying the input arrays; no irreversible migrations are involved.

## Artifacts and Notes

When implementing the batch mutation, include a concise log example in this plan showing the counts returned, for example:

{ deleted: 2, created: 2 }

## Interfaces and Dependencies

All new types must be derived directly from the tRPC router interfaces, following the existing pattern in `packages/client/src/types.ts`. Do not define manual server-side type aliases for the dashboard payload. Instead, add exported client types like:

export type GameAssignmentDashboardData = RouterOutputs['gameAssignments']['getAssignmentDashboardData']
export type GameAssignmentDashboardInput = RouterInputs['gameAssignments']['getAssignmentDashboardData']
export type UpdateGameAssignmentsInput = RouterInputs['gameAssignments']['updateGameAssignments']

Similarly, derive the choice upsert input from tRPC:

export type UpsertGameChoiceBySlotInput = RouterInputs['gameChoices']['upsertGameChoiceBySlot']

Use descriptive exported names, `Array<...>` syntax, and `type` declarations (no `interface`). This keeps the UI aligned with router outputs and avoids duplication.

Plan update note: Updated interface guidance to require all types be derived from tRPC interfaces per `packages/client/src/types.ts` patterns.
Plan update note: Marked implementation steps complete, corrected seed-data scope wording, and recorded dashboard payload filtering decisions after applying the data/API changes.
Plan update note: Recorded `pnpm tsgo`, `pnpm lint`, and `pnpm test` validation run completion.
