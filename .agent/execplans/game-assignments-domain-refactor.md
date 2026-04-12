# Refactor GameAssignments domain helpers into focused modules

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This plan must be maintained in accordance with `.agent/PLANS.md` from the repository root.

## Purpose / Big Picture

After this change, the Game Assignments dashboard should behave the same for admins, but the code behind it should be much easier to read, test, and extend. A novice should be able to answer simple questions such as “where are slot filters computed?”, “where are move options built?”, and “where is choice editing logic stored?” without opening a 1200-line helper file. You can see the refactor working when the existing Game Assignments tests still pass, the dashboard still loads at `/game-assignments`, and each panel continues to support the same assignment and choice editing flows with no behavior change.

## Progress

- [x] (2026-04-12 10:00Z) Read `.agent/PLANS.md`, inspected `packages/amber/views/GameAssignments`, and drafted this ExecPlan.
- [x] (2026-04-12 17:59Z) Extracted `packages/amber/views/GameAssignments/utils.ts` into focused domain modules under `packages/amber/views/GameAssignments/domain`, plus a shared `packages/amber/utils/gameChoiceRank.ts` helper to remove the domain-to-UI import on `rankString`.
- [x] (2026-04-12 17:59Z) Updated `packages/amber/views/GameAssignments/GameAssignmentsByGamePanel.tsx`, `GameAssignmentsByMemberPanel.tsx`, `GameChoicesPanel.tsx`, `GameInterestPanel.tsx`, and `dashboardData.ts` to import only the domain helpers they use.
- [x] (2026-04-12 17:59Z) Split `packages/amber/views/GameAssignments/utils.test.ts` into module-aligned tests under `packages/amber/views/GameAssignments/domain` and kept the existing behavior assertions, with a few additional direct tests for move-option and key helpers.
- [x] (2026-04-12 17:59Z) Removed the monolithic `packages/amber/views/GameAssignments/utils.ts` file after migrating all internal imports.
- [ ] (2026-04-12 17:59Z) Validation status: targeted GameAssignments tests pass via `pnpm exec vitest run ...`; `pnpm tsgo` and `pnpm lint` both still fail because of pre-existing unrelated issues in `packages/ui`; manual `/game-assignments` browser smoke test has not been run in this session.

## Surprises & Discoveries

- Observation: `packages/amber/views/GameAssignments/utils.ts` currently contains both domain types and nearly every pure helper used by the dashboard, from slot filtering and summary counts to row editing transforms and optimistic-update keys.
  Evidence: The file is 1207 lines long and exports a very large surface area of functions and types.

- Observation: The helper monolith is consumed by all four dashboard panels and by the optimistic-update layer in `packages/amber/views/GameAssignments/dashboardData.ts`, so careless extraction could break both rendering and local mutation behavior.
  Evidence: Verified imports from `GameAssignmentsByGamePanel.tsx`, `GameAssignmentsByMemberPanel.tsx`, `GameChoicesPanel.tsx`, `GameInterestPanel.tsx`, and `dashboardData.ts`.

- Observation: The current test weight is heavily concentrated in one file, which makes future helper changes harder to localize.
  Evidence: `packages/amber/views/GameAssignments/utils.test.ts` is substantially larger than the other nearby test files, while `dashboardData.test.ts`, `pageState.test.ts`, and `layoutPlan.test.ts` are already narrower in purpose.

- Observation: Some “domain” formatting logic leaks in from a UI component.
  Evidence: `packages/amber/views/GameAssignments/utils.ts` imports `rankString` from `packages/amber/views/GameSignup/GameChoiceSelector`, which couples dashboard helper code to a signup presentation module.

- Observation: The repository-wide validation commands are currently noisy for reasons unrelated to the GameAssignments refactor.
  Evidence: `pnpm tsgo` fails in `packages/ui/components/Table/__tests__/*` and `TableBodyRow.tsx`, and `pnpm lint` reports existing `packages/ui` dependency, `no-continue`, and test-helper issues outside `packages/amber/views/GameAssignments`.

- Observation: `pnpm test -- --run ...` is not a reliable way to isolate only the GameAssignments files in this repository.
  Evidence: A direct `pnpm exec vitest run packages/amber/views/GameAssignments/...` invocation executed only the 10 intended files, while the package-script wrapper also picked up unrelated `packages/ui` table tests.

## Decision Log

- Decision: Refactor by extraction into pure domain modules under `packages/amber/views/GameAssignments/domain` instead of replacing logic wholesale.
  Rationale: This keeps user-visible behavior stable and allows the existing tests to act as a safety net while reducing file size and import sprawl.
  Date/Author: 2026-04-12 / Hermes.

- Decision: Keep the first extraction phase behavior-preserving and type-preserving, with no router or API shape changes.
  Rationale: The goal is clarity and maintainability in the view/domain layer, not a product change. Mixing in behavior changes would make regressions harder to isolate.
  Date/Author: 2026-04-12 / Hermes.

- Decision: Use module names that describe the problem domain, not the UI container that happens to call them.
  Rationale: Names such as `assignmentScope`, `assignmentSummaries`, `memberChoices`, `interest`, and `moveOptions` help novices find logic faster than another generic `helpers` or `utils` file.
  Date/Author: 2026-04-12 / Hermes.

- Decision: Split tests to mirror the new source modules and keep `dashboardData.test.ts`, `pageState.test.ts`, and `layoutPlan.test.ts` separate.
  Rationale: Test files should answer “what behavior broke?” quickly. Mirroring the module layout makes failures easier to diagnose and future edits safer.
  Date/Author: 2026-04-12 / Hermes.

- Decision: Move `rankString` into `packages/amber/utils/gameChoiceRank.ts` and have both Game Signup and Game Assignments import it from there.
  Rationale: The function is presentation-safe but genuinely shared. A neutral utility removes the view-to-view dependency without changing behavior.
  Date/Author: 2026-04-12 / Hermes.

## Outcomes & Retrospective

- Completed the GameAssignments domain split. The helper monolith is gone, the dashboard panels now import focused modules, and the test coverage is organized alongside the new source boundaries under `packages/amber/views/GameAssignments/domain`.

- The most useful secondary outcome was removing the dependency from GameAssignments onto `GameSignup/GameChoiceSelector`. Shared rank-label logic now lives in `packages/amber/utils/gameChoiceRank.ts`, which makes both feature areas easier to reason about independently.

- Targeted proof is strong: `pnpm exec vitest run packages/amber/views/GameAssignments/domain/*.test.ts packages/amber/views/GameAssignments/dashboardData.test.ts packages/amber/views/GameAssignments/pageState.test.ts packages/amber/views/GameAssignments/layoutPlan.test.ts` passed with 10 test files and 50 tests. Broader static validation is still blocked by unrelated existing failures in `packages/ui`, and the manual `/game-assignments` browser smoke test remains to be done.

## Context and Orientation

The Game Assignments dashboard lives in `packages/amber/views/GameAssignments`. The top-level page is `packages/amber/views/GameAssignments/GameAssignmentsPage.tsx`. It loads dashboard data from tRPC, stores a local copy for optimistic updates, and passes handlers into `packages/amber/views/GameAssignments/GameAssignmentsDashboard.tsx`. That dashboard component renders four panes: `GameAssignmentsByGamePanel.tsx`, `GameAssignmentsByMemberPanel.tsx`, `GameChoicesPanel.tsx`, and `GameInterestPanel.tsx`.

Today, almost all pure domain logic for those panes is packed into `packages/amber/views/GameAssignments/utils.ts`. “Domain logic” here means code that turns raw dashboard records into counts, grouped maps, row models, move options, labels, and update payloads. This is not React rendering code and not server code; it is the middle layer that explains how the dashboard thinks.

The same monolithic file currently mixes several unrelated concerns.

Types: dashboard records, row models, count models, and editor-state types.

Scope and grouping: slot filtering, “scheduled assignment” detection, grouping assignments and choices by game, member, and slot.

Summaries: assignment counts, per-member attention flags, and per-game interest summaries.

Formatting and ranking: priority labels, rank sort values, game label formatting, and special handling for “Any Game” and “No Game”.

Editing transforms: row updates for by-game editing, by-member editing, and member choice editing.

Payload and key helpers: assignment keys, choice keys, assignment update payloads, and choice upsert payloads.

There is also one non-panel consumer: `packages/amber/views/GameAssignments/dashboardData.ts`, which uses key-building helpers from `utils.ts` to apply optimistic updates to cached dashboard data.

Tests already exist and should be treated as baseline behavior documentation. The relevant files are:

- `packages/amber/views/GameAssignments/utils.test.ts`
- `packages/amber/views/GameAssignments/dashboardData.test.ts`
- `packages/amber/views/GameAssignments/pageState.test.ts`
- `packages/amber/views/GameAssignments/layoutPlan.test.ts`

The repository root `package.json` confirms that the broader validation commands available for this repo are `pnpm tsgo`, `pnpm lint`, and `pnpm test`. The local development commands for smoke testing the convention apps are `pnpm dev:nw` and `pnpm dev:us`.

## Milestones

### Milestone 1: Establish explicit module boundaries without changing behavior

At the end of this milestone, the GameAssignments domain layer is organized into small files under `packages/amber/views/GameAssignments/domain`, but the dashboard still behaves exactly as before. The safest way to do this is to copy or move pure helpers into the new files first, add an `index.ts` barrel under `domain`, and temporarily keep `utils.ts` as a compatibility re-export file until all imports are migrated. Run the targeted GameAssignments tests after each extraction step and expect them to stay green.

### Milestone 2: Migrate each panel and the optimistic-update layer to focused imports

At the end of this milestone, each panel imports only the modules it needs. The by-game panel should read like “scope + summaries + move options + assignment editor transforms”, not “everything from utils”. `dashboardData.ts` should import only key helpers. Acceptance is that the code is easier to navigate, import lists are smaller and more meaningful, and the dashboard still renders and edits correctly.

### Milestone 3: Align tests to the new layout and remove the monolith

At the end of this milestone, `utils.test.ts` is replaced by smaller test files that mirror the extracted source modules, and `utils.ts` is gone. Run the targeted tests, then broader repo validation, then a manual smoke test of `/game-assignments`. Acceptance is that no dashboard behavior changed, but the structure is now obvious to a newcomer.

## Plan of Work

Create a new folder `packages/amber/views/GameAssignments/domain`. Move the exported type aliases and row model types from the top of `packages/amber/views/GameAssignments/utils.ts` into `packages/amber/views/GameAssignments/domain/types.ts`. Every other new domain module should import shared types from that file rather than redefining them.

Extract slot and assignment-scope helpers into `packages/amber/views/GameAssignments/domain/assignmentScope.ts`. This file should own `hasValidSlotId`, `filterGamesWithSlots`, `filterGamesWithSlotsOrAny`, `isScheduledAssignment`, and `buildSlotAssignmentScope`. These helpers are shared by multiple panels and define the first layer of filtering behavior.

Extract summary and grouping helpers into `packages/amber/views/GameAssignments/domain/assignmentSummaries.ts`. This file should own grouping maps and count builders such as `buildAssignmentCountsByGameId`, `buildAssignmentsByGameId`, `buildAssignmentsByMemberId`, `buildAssignedSlotCountsByMemberId`, `buildChoicesByMemberSlot`, `buildChoicesByMemberId`, `buildSubmissionsByMemberId`, `buildMemberAssignmentCountsByMemberId`, `buildMemberChoiceSummaryRows`, `buildMemberAssignmentSummaryRows`, `buildGameAssignmentSummaryRows`, and `buildGameInterestSummaryRows`. Keep these pure and free of React concerns.

Extract label and presentation-safe formatting helpers into `packages/amber/views/GameAssignments/domain/labels.ts`. This file should own `getPriorityLabel`, `getPrioritySortValue`, `isReturningPlayersOnly`, `formatGameName`, and `getGameLabel`. During this step, remove the dependency on `packages/amber/views/GameSignup/GameChoiceSelector` by moving any truly shared label logic into a neutral domain-safe location.

Extract interest-specific aggregation into `packages/amber/views/GameAssignments/domain/interest.ts`. This file should own `buildInterestChoicesByGameId`, `buildInterestCountsByGameId`, and `buildInterestRowsForGame`.

Extract game move option builders into `packages/amber/views/GameAssignments/domain/moveOptions.ts`. This file should own `buildMoveOptions`, `buildMoveSelectOptions`, `buildGameChoiceOptions`, `buildGameChoiceOptionsForRow`, and any narrow helper that exists only to build dropdown options.

Extract member-assignment editing logic into `packages/amber/views/GameAssignments/domain/memberAssignments.ts`. This file should own `buildMemberAssignmentEditorRows`, `buildUpdatedMemberAssignmentRowGameSelection`, `buildUpdatedGameAssignmentRowMemberSelection`, `buildGameAssignmentEditorRows`, `buildAssignmentUpdatePayload`, `buildMemberAssignmentPayloadFromUpdates`, `buildGameAssignmentPayloadFromUpdates`, and `buildGameAssignmentAddPayload`.

Extract member-choice editing logic into `packages/amber/views/GameAssignments/domain/memberChoices.ts`. This file should own `canEditChoiceRowGameSelection`, `buildUpdatedChoiceRowGameSelection`, `buildChoiceRowsForMember`, `buildChoiceEditorStateForMember`, and `buildChoiceUpsertsFromUpdates`.

Extract key helpers into `packages/amber/views/GameAssignments/domain/keys.ts`. This file should own `buildChoiceKey`, `buildAssignmentKeyFromInput`, and `buildAssignmentKeyFromRecord`. Update `packages/amber/views/GameAssignments/dashboardData.ts` to import from `./domain/keys`.

Add `packages/amber/views/GameAssignments/domain/index.ts` to re-export the stable public domain API. During migration, reduce `packages/amber/views/GameAssignments/utils.ts` to a simple compatibility barrel that re-exports from `./domain`. Once all internal imports and tests point at `domain/*` or `domain/index`, delete `utils.ts` in the same change set.

After source extraction, update panel imports in:

- `packages/amber/views/GameAssignments/GameAssignmentsByGamePanel.tsx`
- `packages/amber/views/GameAssignments/GameAssignmentsByMemberPanel.tsx`
- `packages/amber/views/GameAssignments/GameChoicesPanel.tsx`
- `packages/amber/views/GameAssignments/GameInterestPanel.tsx`

Each file should import only the exact modules it uses. Do not introduce a new broad import style that recreates the same problem with a different path.

Replace `packages/amber/views/GameAssignments/utils.test.ts` with smaller test files under `packages/amber/views/GameAssignments/domain`, for example `assignmentScope.test.ts`, `assignmentSummaries.test.ts`, `interest.test.ts`, `moveOptions.test.ts`, `memberAssignments.test.ts`, `memberChoices.test.ts`, and `keys.test.ts`. Move the existing cases rather than rewriting them from scratch. Preserve the fixture builders where possible so the behavior coverage stays familiar.

Do not redesign `packages/amber/views/GameAssignments/GameAssignmentsPage.tsx`, `GameAssignmentsDashboard.tsx`, `pageState.ts`, or `layoutPlan.ts` unless import or type updates are required by the extraction. This plan is about clarifying the domain/helper layer, not redesigning dashboard layout or page state.

## Concrete Steps

Run all commands from the repository root.

    cd /Users/ggp/dev/git/amber

Create the new domain folder and extract helpers incrementally. After each extraction batch, run the most local tests first.

    mkdir -p packages/amber/views/GameAssignments/domain

Run the GameAssignments tests after the first extraction batch.

    pnpm test -- --run packages/amber/views/GameAssignments/utils.test.ts packages/amber/views/GameAssignments/dashboardData.test.ts packages/amber/views/GameAssignments/pageState.test.ts packages/amber/views/GameAssignments/layoutPlan.test.ts

Expected result:

    ✓ packages/amber/views/GameAssignments/...

Migrate panel imports and `dashboardData.ts` away from `./utils`.

Replace `utils.test.ts` with smaller module-aligned test files under `packages/amber/views/GameAssignments/domain`.

Run the new targeted test set.

    pnpm test -- --run packages/amber/views/GameAssignments/domain/*.test.ts packages/amber/views/GameAssignments/dashboardData.test.ts packages/amber/views/GameAssignments/pageState.test.ts packages/amber/views/GameAssignments/layoutPlan.test.ts

If glob expansion does not work in the local shell, list the new test files explicitly on the command line.

Run broader static validation.

    pnpm tsgo
    pnpm lint

Start the ACNW app for a manual smoke test.

    pnpm dev:nw

Then open the local app URL it prints, navigate to `/game-assignments`, expand rows in each panel, and verify that assignment moves and choice edits still behave as before.

## Validation and Acceptance

Acceptance is met when all of the following are true.

The Game Assignments dashboard still loads from `packages/amber/views/GameAssignments/GameAssignmentsPage.tsx` with no visible feature regression. The by-game panel still shows assignment counts and editable move options. The by-member panel still shows per-slot assignment editing. The member-choices panel still enforces the same “GM / 1st / 2nd / 3rd / 4th” row behavior. The interest panel still shows interest counts and expandable member lists.

There is no longer a large mixed-purpose helper file. Instead, the domain code is organized under `packages/amber/views/GameAssignments/domain` with focused filenames, and feature code imports only the modules it needs.

The optimistic update layer in `packages/amber/views/GameAssignments/dashboardData.ts` still passes its tests, proving that key extraction did not change assignment or choice identity behavior.

Run and expect success from:

- `pnpm test -- --run <GameAssignments domain tests plus dashboardData/pageState/layoutPlan tests>`
- `pnpm tsgo`
- `pnpm lint`

Manual acceptance should include this observable check:

- Open `/game-assignments`.
- Expand one row in each of the four panes.
- In “Assignments by Game”, change a member assignment and save.
- In “Member Choices”, edit one game choice and save.
- Confirm the UI still updates without runtime errors and the page remains interactive.

## Idempotence and Recovery

This refactor should be done as a sequence of pure moves and import updates, so it is safe to repeat. If a batch of edits breaks imports, restore the temporary compatibility barrel in `packages/amber/views/GameAssignments/utils.ts`, re-run the targeted tests, and then continue migrating one consumer at a time.

Do not delete `utils.ts` until all feature files and tests have been updated and the targeted test suite is green. This gives a safe rollback point. If a new module boundary feels wrong during extraction, move the helper again before deleting the barrel; the purpose is long-term clarity, not preserving a first draft of the file split.

Because this plan does not change the server schema, seed data, or external APIs, recovery is limited to source-level rollback and test reruns. No database or migration recovery is needed.

## Artifacts and Notes

The finished tree should resemble this shape:

    packages/amber/views/GameAssignments/
      GameAssignmentsByGamePanel.tsx
      GameAssignmentsByMemberPanel.tsx
      GameChoicesPanel.tsx
      GameInterestPanel.tsx
      GameAssignmentsPage.tsx
      GameAssignmentsDashboard.tsx
      dashboardData.ts
      domain/
        assignmentScope.ts
        assignmentSummaries.ts
        interest.ts
        labels.ts
        memberAssignments.ts
        memberChoices.ts
        moveOptions.ts
        keys.ts
        types.ts
        index.ts

A representative import cleanup should look like this:

    before:
      import {
        buildAssignmentCountsByGameId,
        buildAssignmentsByGameId,
        buildChoicesByMemberSlot,
        buildGameAssignmentEditorRows,
        buildGameAssignmentPayloadFromUpdates,
        buildGameAssignmentSummaryRows,
        buildMoveOptions,
        buildMoveSelectOptions,
        buildUpdatedGameAssignmentRowMemberSelection,
        formatGameName,
        buildSlotAssignmentScope,
      } from './utils'

    after:
      import { buildSlotAssignmentScope } from './domain/assignmentScope'
      import {
        buildAssignmentCountsByGameId,
        buildAssignmentsByGameId,
        buildChoicesByMemberSlot,
        buildGameAssignmentSummaryRows,
      } from './domain/assignmentSummaries'
      import {
        buildGameAssignmentEditorRows,
        buildGameAssignmentPayloadFromUpdates,
        buildUpdatedGameAssignmentRowMemberSelection,
      } from './domain/memberAssignments'
      import { buildMoveOptions, buildMoveSelectOptions } from './domain/moveOptions'
      import { formatGameName } from './domain/labels'

Record the final deletion of `utils.ts` in `Progress`, `Decision Log`, and a plan update note at the bottom of the file.

## Interfaces and Dependencies

In `packages/amber/views/GameAssignments/domain/types.ts`, define and export the shared aliases and row-model types now living at the top of `utils.ts`, including stable aliases for dashboard assignments, choices, games, memberships, submissions, assignment update inputs, and choice upserts.

Keep the current row-model names stable so panel code does not need needless renaming:

- `GameAssignmentSummaryRow`
- `GameInterestSummaryRow`
- `MemberAssignmentSummaryRow`
- `MemberAssignmentEditorRow`
- `GameAssignmentEditorRow`
- `MemberChoiceSummaryRow`
- `MemberChoiceRow`
- `MemberChoiceEditorState`
- `MoveOption`
- `AssignmentCounts`
- `MemberAssignmentCounts`
- `SlotAssignmentScope`
- `ChoicesByMemberSlot`
- `InterestChoicesByGameId`
- `GameInterestRow`

The extracted modules should provide stable exports with these responsibilities:

In `packages/amber/views/GameAssignments/domain/assignmentScope.ts`: slot validity, game filtering, scheduled-assignment detection, and scope building.

In `packages/amber/views/GameAssignments/domain/assignmentSummaries.ts`: grouping maps, assignment counts, choice summaries, member summaries, game summaries, and interest summary rows.

In `packages/amber/views/GameAssignments/domain/labels.ts`: priority labels, priority sort values, returning-player-only detection, game name formatting, and game label helpers.

In `packages/amber/views/GameAssignments/domain/interest.ts`: interest choice grouping, interest counts, and per-game interest rows.

In `packages/amber/views/GameAssignments/domain/moveOptions.ts`: move option generation and choice option generation.

In `packages/amber/views/GameAssignments/domain/memberAssignments.ts`: editor rows and assignment payload builders for the by-game and by-member workflows.

In `packages/amber/views/GameAssignments/domain/memberChoices.ts`: choice editing rules, row building, editor-state building, and choice upsert payloads.

In `packages/amber/views/GameAssignments/domain/keys.ts`: choice keys and assignment keys used by optimistic updates.

Do not introduce new runtime dependencies. This refactor should continue using the current workspace packages only.

Plan update note: Initial draft created after inspecting `.agent/PLANS.md`, `packages/amber/views/GameAssignments/utils.ts`, the four panel files, `GameAssignmentsPage.tsx`, `GameAssignmentsDashboard.tsx`, `dashboardData.ts`, and the existing GameAssignments test files.
