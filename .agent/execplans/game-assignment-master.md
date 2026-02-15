# Deliver Game Assignment Dashboard

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This plan must be maintained in accordance with `.agent/PLANS.md` from the repository root.

## Purpose / Big Picture

After this change, admins can open a dedicated Game Assignment dashboard in the ACNW and ACUS sites that replaces the spreadsheet workflow with a 4-panel, resizable interface for assigning members to games, reviewing choices, and inspecting demand by slot. The dashboard will read game, member, and choice data for a selected year, allow assignments to be moved or added with minimal friction, and provide reliable tests that prove the end-to-end flow works with seeded data.

## Progress

- [x] (2026-01-21 18:19Z) Created the master ExecPlan and split implementation into scoped subplans.
- [x] (2026-01-21 19:14Z) Implemented `game-assignment-data.md` (APIs/types/seed updates + validation).
- [x] (2026-01-21 20:09Z) Implemented `game-assignment-table-nesting.md` (expansion/editing/ui-test/playwright + validation).
- [ ] Implement `game-assignment-ui.md` (completed: UI/components/routes/tests; remaining: validation runs).

## Surprises & Discoveries

- Observation: Pending.
  Evidence: Pending.

## Decision Log

- Decision: Split the work into three subplans (data/API, table nesting, and UI) with this master plan tracking order and integration.
  Rationale: The feature spans server data, a reusable Table component, and a complex UI; separate plans keep each area self-contained and reduce token usage.
  Date/Author: 2026-01-21 / Codex.

- Decision: Target the ACNW Playwright suite for new end-to-end coverage and reuse the same dashboard view in ACUS.
  Rationale: ACNW already has Playwright infrastructure; reusing the view ensures both sites ship the feature without duplicating test harness work.
  Date/Author: 2026-01-21 / Codex.

## Outcomes & Retrospective

- Pending. (Fill in after milestones are completed.)

## Context and Orientation

The requirements for the dashboard are documented in `GameAssignmentProcess.md`, including panel definitions, data rules, and the meaning of Game Assignment and Game Choice records. The reusable Table component that needs nested-row support is implemented in `packages/ui/components/Table`, and the application views live in `packages/amber/views` while the ACNW/ACUS pages and navigation live under `apps/acnw` and `apps/acus`. This master plan coordinates the subplans that implement those pieces.

## Plan of Work

Implement the subplans in order because the dashboard UI depends on both new data APIs and nested Table support. Start with `game-assignment-data.md` to add the server queries, mutation(s), and seed data required by the UI and tests. Next, complete `game-assignment-table-nesting.md` to add row expansion and add-row editing for nested tables in `@amber/ui`. Finally, implement `game-assignment-ui.md` to build the dashboard page, add routing and navigation, and write Playwright coverage.

## Concrete Steps

Read and execute each subplan in the order listed in the `Progress` section. Each subplan includes the exact file paths to edit, command lines to run from the repo root, and expected verification output. Update this master plan’s `Progress` entries after each subplan reaches a verifiable milestone, and add cross-plan surprises or decisions if any integration issues arise.

## Validation and Acceptance

Acceptance for the overall feature is achieved when all subplans report passing validations and the dashboard is reachable at the new admin route with functioning panel interactions. The minimum validation set across the combined work is:

- From the repo root, run `pnpm tsgo` and resolve any TypeScript errors.
- From the repo root, run `pnpm lint` and resolve lint errors.
- From the repo root, run `pnpm test` and expect the new vitest coverage to pass.
- From the repo root, run `pnpm -F acnw playwright test` and expect the new Game Assignment Playwright spec to pass.

## Idempotence and Recovery

The work is additive and safe to re-run. If a subplan step fails, revert only the files touched in that subplan and rerun its steps. The seed data changes in `packages/server/scripts/lib/testData.ts` are deterministic and can be re-seeded without data drift.

## Artifacts and Notes

Subplans referenced by this master plan:

- `.agent/execplans/game-assignment-data.md`
- `.agent/execplans/game-assignment-table-nesting.md`
- `.agent/execplans/game-assignment-ui.md`

## Interfaces and Dependencies

This master plan coordinates the dependencies between subplans. The UI plan requires the data plan’s new tRPC procedures and the table plan’s nested table support. The data plan requires no changes from the other subplans. The table plan is reusable and should not depend on the game-assignment UI to remain modular.

Plan update note: Initial master ExecPlan created to coordinate the three scoped subplans.
Plan update note: Recorded partial completion of the data subplan after applying API, type, and seed changes.
Plan update note: Marked the data subplan complete after running `pnpm tsgo`, `pnpm lint`, and `pnpm test`.
Plan update note: Recorded partial completion of the table-nesting subplan after implementing UI/test changes but before running validations.
Plan update note: Marked the table-nesting subplan complete after validation passes (`pnpm tsgo`, `pnpm lint`, `pnpm test`, `pnpm -F ui-test test:e2e`).
Plan update note: Noted the UI subplan implementation completion with validation still pending.
