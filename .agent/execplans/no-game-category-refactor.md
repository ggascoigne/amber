# Refactor No/Any Game Handling To Category-Based Year-Scoped Records

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

The ExecPlan process is defined in `./.agent/PLANS.md` from the repository root, and this document must be maintained according to those rules.

## Purpose / Big Picture

After this change, each convention year has its own special game rows: one `no_game` row per slot and one `any_game` row for the year. The system no longer relies on legacy static IDs (slot-number IDs and ID `144`) or `year = 0` fallback records. This makes yearly queries consistent and enables assignment/choice logic to detect special games by explicit category instead of implicit ID conventions.

A user-visible proof is that game signup and game assignment keep behaving the same for “No Game” and “Any Game”, while database rows and API logic are now category-based. A concrete behavioral requirement is that “Set Initial Assignments” maps “No Game” choices to the year’s no-game records and still does not schedule “Any Game”.

## Progress

- [x] (2026-02-15 21:32Z) Investigated the New Year kickoff path and confirmed `AddNewYearDialog` only mutates settings, so special-game bootstrap was not part of that process.
- [x] (2026-02-15 21:32Z) Added a new server mutation `games.ensureSpecialGamesForYear` to idempotently create year-scoped special records (`no_game` per slot, one `any_game` per year).
- [x] (2026-02-15 21:32Z) Wired `AddNewYearDialog` to call `ensureSpecialGamesForYear` after settings are written so kickoff creates special records for the target year.
- [x] (2026-02-15 21:32Z) Ran follow-up validation (`pnpm tsgo`, `pnpm lint`) after wiring New Year special-game bootstrap.
- [x] (2026-02-15 04:18Z) Read `./.agent/PLANS.md`, inspected schema/migrations, and mapped current ID-based no/any game behavior across server and UI.
- [x] (2026-02-15 04:23Z) Added migration `20260215043000_game_categories_and_year_scoped_special_games.ts` and Prisma schema enum/field updates for `game.category`.
- [x] (2026-02-15 04:26Z) Refactored server routers (`games`, `gameAssignments`, `gameChoices`) to expose category data and replace magic-ID assignment logic.
- [x] (2026-02-15 04:29Z) Refactored signup, assignment dashboard, schedule/game card, reports, and membership assignment dialog to use category-based no/any behavior.
- [x] (2026-02-15 04:32Z) Updated Playwright assertion to validate Any Game non-assignment by category, and completed validation runs (`pnpm tsgo`, `pnpm test`, `pnpm lint`, targeted Playwright spec).
- [x] (2026-02-15 04:32Z) Finalized outcomes, artifacts, and revision notes.

## Surprises & Discoveries

- Observation: The “kick off new year” UI did not call any game API and only persisted setting rows, so it could not create `no_game`/`any_game` rows for new years.
  Evidence: `packages/amber/views/Settings/AddNewYearDialog.tsx` only used `settings.createSetting` and `settings.updateSetting` mutations before this follow-up.

- Observation: Current assignment initializer explicitly excludes only `ANY_GAME_CHOICE_ID = 144`, and otherwise assumes any slotted game ID is schedulable.
  Evidence: `packages/server/src/api/routers/gameAssignments.ts` `setInitialAssignments`.

- Observation: Signup and assignment UIs have multiple slot-ID and `144` assumptions, including data-entry fallback paths.
  Evidence: `packages/amber/views/GameSignup/GameChoiceSelector.tsx`, `packages/amber/views/GameSignup/ChoiceConfirmDialog.tsx`, `packages/amber/views/GameAssignments/utils.ts`, and `packages/amber/views/Memberships/GameAssignmentDialog.tsx`.

- Observation: Raw SQL migration references to `full` must be quoted in PostgreSQL (`"full"`), otherwise migration SQL fails with a syntax error.
  Evidence: Initial Playwright web-server boot failed migration with `syntax error at or near "full"`; resolved by quoting column references/insert targets in the migration.

- Observation: Prisma enum name defaults to `GameCategory` in SQL unless explicitly mapped, which mismatched the migration-created enum type name `game_category`.
  Evidence: Playwright web-server startup failed with `type "public.GameCategory" does not exist`; resolved by adding `@@map("game_category")` in `packages/server/prisma/schema.prisma`.

## Decision Log

- Decision: Add a dedicated mutation (`games.ensureSpecialGamesForYear`) and call it from New Year kickoff instead of relying on migration-time backfill only.
  Rationale: Migrations backfill existing years at migration execution time but do not run when admins create a future year in-app; kickoff needs a runtime creator.
  Date/Author: 2026-02-15 / Codex

- Decision: Implement category as a PostgreSQL enum-backed `game.category` with values `user`, `no_game`, `any_game`, defaulting to `user`.
  Rationale: Strong data integrity and direct Prisma enum typing reduce future accidental misuse.
  Date/Author: 2026-02-15 / Codex

- Decision: Keep legacy year-0 special rows in place but migrate all choices/assignments to year-scoped category rows and stop depending on year-0 query fallbacks.
  Rationale: Avoid destructive historical data deletion while still removing operational dependence on old rows.
  Date/Author: 2026-02-15 / Codex

- Decision: Use category checks everywhere special handling is needed; avoid well-known IDs entirely.
  Rationale: Meets the request and removes the root coupling issue.
  Date/Author: 2026-02-15 / Codex

- Decision: Keep PostgreSQL enum type snake-cased as `game_category` and map Prisma enum `GameCategory` to it using `@@map("game_category")`.
  Rationale: Preserves DB naming conventions in migrations while keeping Prisma naming idiomatic in TypeScript.
  Date/Author: 2026-02-15 / Codex

- Decision: Keep `getGamesBySlot` and related non-signup game queries restricted to `category = 'user'` so regular game listings do not include no/any special rows.
  Rationale: Preserves user-visible behavior in game-book/admin contexts, while signup and assignment paths explicitly include special categories where needed.
  Date/Author: 2026-02-15 / Codex

## Outcomes & Retrospective

Follow-up implementation now includes runtime special-game creation during New Year kickoff. This closes the gap where migrations created historical special rows but a newly created year in Settings could still start without `no_game`/`any_game` entries.

Implemented end-to-end category-based no/any game handling, including schema, migration, server logic, UI logic, and report/test updates. The system now creates/uses year-scoped special rows and no longer depends on static ID conventions (`144`, slot-as-game-id). Assignment initialization now maps first-choice no-game selections to year/slot no-game records and still skips auto-scheduling any-game selections.

Migration robustness improved during implementation: raw SQL quoting for `"full"` and Prisma enum mapping to `game_category` were required for passing end-to-end boot/test flows. The final targeted Playwright suite for game assignments passes after these fixes, providing behavioral verification in addition to typecheck/unit/lint.

## Context and Orientation

The database schema lives in `packages/server/prisma/schema.prisma`. Knex migrations live in `packages/server/support/db/migrations`. API behavior for games, choices, and assignments is mainly in `packages/server/src/api/routers/games.ts`, `packages/server/src/api/routers/gameChoices.ts`, and `packages/server/src/api/routers/gameAssignments.ts`.

The signup UI and game-assignment dashboard depend on special-game behavior in:

- `packages/amber/views/GameSignup/GameChoiceSelector.tsx`
- `packages/amber/views/GameSignup/GameSignupPage.tsx`
- `packages/amber/views/GameSignup/ChoiceConfirmDialog.tsx`
- `packages/amber/views/GameAssignments/utils.ts`
- `packages/amber/views/GameAssignments/GameChoicesPanel.tsx`
- `packages/amber/views/GameAssignments/GameInterestPanel.tsx`
- `packages/amber/views/GameAssignments/GameAssignmentsByGamePanel.tsx`
- `packages/amber/views/GameAssignments/GameAssignmentsByMemberPanel.tsx`
- `packages/amber/views/GameAssignments/GameAssignmentsPage.tsx`

A secondary assignment editor with legacy assumptions exists at `packages/amber/views/Memberships/GameAssignmentDialog.tsx` and must also stop using slot-ID conventions for no-game.

In this repository, “No Game” means the member intentionally opts out of that slot; “Any Game” means the member will accept any game in that slot but should not be auto-scheduled by `setInitialAssignments`.

## Plan of Work

First, add a migration that introduces `game.category`, tags legacy special rows, creates missing year-scoped special rows for all historical years, and remaps `game_assignment.game_id` and `game_choice.game_id` references from legacy special rows to the new year-scoped rows. Then update Prisma schema with a `GameCategory` enum and `Game.category` field.

Next, refactor server routers so game queries use year-scoped records and expose `category` anywhere the UI consumes game records. Replace assignment initialization and filtering logic to detect special rows by category instead of ID.

Then refactor signup and assignment UI logic to detect special choices by game category metadata, including the move-to workflow and confirm dialog auto-fill behavior. Ensure “Set Initial Assignments” creates no-game assignments for missing slots and still skips any-game choices.

Finally, update tests for category behavior, run validation commands, and record outcomes.

## Concrete Steps

From repository root `/Users/ggp/dev/git/amber`:

1. Add a new migration in `packages/server/support/db/migrations` that:
   - creates enum type `game_category` if needed;
   - adds non-null `game.category` with default `user`;
   - marks legacy year-0 “No Game” rows as `no_game` and “Any Game” rows as `any_game`;
   - creates missing year-scoped `no_game` rows (per slot/per year) and `any_game` rows (per year);
   - remaps `game_assignment` and `game_choice` rows pointing to legacy special rows to year-scoped special rows;
   - updates stored procedure `create_bare_slot_choices` only if category-aware behavior is required.

2. Update `packages/server/prisma/schema.prisma` with enum and `Game.category`, then regenerate Prisma client.

3. Update server routers:
   - `packages/server/src/api/routers/games.ts` to stop relying on `year = 0` fallback for signup/year queries and to keep category data available.
   - `packages/server/src/api/routers/gameAssignments.ts` to remove `ANY_GAME_CHOICE_ID`, use category checks, and map missing-slot assignments to year no-game records in `setInitialAssignments`.
   - `packages/server/src/api/routers/gameChoices.ts` and assignment dashboard selects to include game categories in choice/game payloads.

4. Update UI and helper logic to category-based checks:
   - replace ID-based `isNoGame` / `isAnyGame` assumptions;
   - ensure move-to and choice-edit options resolve year/slot category rows;
   - ensure choice completion and confirm dialog auto-fill choose the correct no-game row per slot;
   - update assignment dashboard local optimistic update fallback code to resolve no-game rows from category data.

5. Update reports and downstream special handling:
   - `apps/acnw/pages/api/reports/gameAndPlayersReport.ts` and `apps/acus/pages/api/reports/gameAndPlayersReport.ts` to filter by category (`user`) instead of name.
   - Schedule/game card special detection should use category rather than `year === 0`.

6. Validate and capture outputs:
   - `pnpm tsgo`
   - `pnpm test`
   - `pnpm lint`
   - targeted Playwright: `pnpm -F acnw test:e2e -- game-assignments.spec.ts`

## Validation and Acceptance

Acceptance criteria:

- No server/UI code relies on hard-coded special game IDs (`144`, slot-number IDs) for behavior decisions.
- Signup shows per-year “No Game” and “Any Game” options and completion logic still works.
- Assignment dashboard move-to can explicitly set “No Game” and persists to the year/slot `no_game` row even when no assignment existed.
- `setInitialAssignments` creates assignments for first-choice/no-game cases but not for any-game choices.
- Report SQL excludes non-user game categories by category field.
- Type-checking/tests pass, and targeted dashboard E2E scenario for Any Game non-assignment still passes.

## Idempotence and Recovery

Migration is written to be re-runnable-safe for inserts and updates by using existence checks and category guards. If a migration step fails midway, rerun after fixing the failing SQL condition; existing inserted year-scoped rows should not duplicate. The migration does not delete legacy rows, so rollback risk is reduced.

## Artifacts and Notes

Validation artifacts:

    $ pnpm tsgo
    ... packages/server tsgo: Done
    ... packages/amber tsgo: Done
    ... apps/acnw tsgo: Done
    ... apps/acus tsgo: Done

    $ pnpm test
    Test Files  6 passed (6)
    Tests       41 passed (41)

    $ pnpm lint
    eslint --cache --color '**/*.{[mc]js,[mc]ts,[jt]s,tsx}'
    (no errors or warnings)

    $ pnpm -F acnw test:e2e -- game-assignments.spec.ts
    Running 7 tests using 1 worker
    7 passed

Notable implementation files:

- `packages/server/support/db/migrations/20260215043000_game_categories_and_year_scoped_special_games.ts`
- `packages/server/prisma/schema.prisma`
- `packages/server/src/api/routers/games.ts`
- `packages/server/src/api/routers/gameAssignments.ts`
- `packages/amber/views/GameSignup/GameChoiceSelector.tsx`
- `packages/amber/views/GameAssignments/utils.ts`

## Interfaces and Dependencies

The database interface changes to:

- `game.category` enum (`user` | `no_game` | `any_game`), non-null default `user`.

Server payload changes include `category` on game records used by signup and assignment dashboard APIs. UI helper functions that classify special games must accept game metadata (or category-bearing choice relation) rather than infer from IDs.

Plan update note: 2026-02-15 04:18Z - Initial ExecPlan created before implementation to satisfy `.agent/PLANS.md` requirements and to guide end-to-end migration plus UI/API refactor.
Plan update note: 2026-02-15 04:32Z - Updated all living sections after implementation, including discovered migration/enum issues and their fixes, with final validation evidence.
