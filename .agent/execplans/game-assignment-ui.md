# Build Game Assignment Dashboard UI and Playwright Coverage

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This plan must be maintained in accordance with `.agent/PLANS.md` from the repository root.

## Purpose / Big Picture

After this change, admins can open a dedicated Game Assignment dashboard with four resizable panels that let them assign members to games, review assignments by member, edit member choices, and inspect game demand. The UI uses accessible Table components with nested rows and edits assignments through the new tRPC APIs. Playwright tests prove the dashboard loads, expands rows, and updates assignments using the seeded 2025 data.

## Progress

- [x] (2026-01-21 18:19Z) Drafted the ExecPlan with panel layout, routing, and Playwright coverage steps.
- [x] (2026-01-22 00:34Z) Added the dashboard view components and shared helpers in `packages/amber/views`.
- [x] (2026-01-22 00:34Z) Wired routing and navigation for ACNW and ACUS.
- [x] (2026-01-22 00:34Z) Implemented assignment and choice editing flows tied to the new tRPC APIs.
- [x] (2026-01-22 00:34Z) Added Playwright coverage in `apps/acnw/playwright`.
- [ ] Run `pnpm tsgo`, `pnpm lint`, `pnpm test`, and `pnpm -F acnw playwright test`.

## Surprises & Discoveries

- Observation: Pending.
  Evidence: Pending.

## Decision Log

- Decision: Use `react-resizable-panels` for the 4-panel layout.
  Rationale: The library supports nested panel groups with minimal API surface and integrates cleanly with MUI layout.
  Date/Author: 2026-01-21 / Codex.

- Decision: Place the shared dashboard view in `packages/amber/views/GameAssignments` and add thin Next.js pages in `apps/acnw/pages` and `apps/acus/pages`.
  Rationale: Other admin screens follow the same pattern and it keeps ACNW/ACUS behavior aligned.
  Date/Author: 2026-01-21 / Codex.

- Decision: Gate the new route behind `Perms.GameAdmin`.
  Rationale: Game assignments are an admin function already covered by the game admin role and should not require broader admin access.
  Date/Author: 2026-01-21 / Codex.

## Outcomes & Retrospective

- Pending. (Fill in after implementation milestones are completed.)

## Context and Orientation

Dashboard data comes from the new `gameAssignments.getAssignmentDashboardData` and related mutations defined in `packages/server/src/api/routers`. The shared view layer for both apps lives in `packages/amber/views`, while ACNW/ACUS routes and pages live under `apps/acnw` and `apps/acus`. The Table component is in `packages/ui/components/Table` and must already support nested rows and add-row editing as described in `game-assignment-table-nesting.md`.

## Plan of Work

Add a new view folder `packages/amber/views/GameAssignments` containing the dashboard page and per-panel components. The main page should load the dashboard data via `useTRPC`, cache it in local state for quick UI updates, and provide action handlers for moving assignments and updating member choices. The 4-panel layout should be implemented with nested `PanelGroup` components from `react-resizable-panels` so that users can resize both the vertical and horizontal splits.

Create a new `game-assignments` page in `apps/acnw/pages` and `apps/acus/pages` that renders the shared dashboard view. Add a route entry in `apps/acnw/views/Routes.tsx` and `apps/acus/views/Routes.tsx` with label “Game Assignments” and permission `Perms.GameAdmin`.

Implement each panel with a Table that uses nested rows:

Panel 1 (Assignments by Game) shows games sorted by slot then title with columns for slot, game title, overrun, shortfall, and spaces. Expanded rows show assigned members, their priority label (GM, 1st, 2nd, 3rd, 4th, Other), and a “Move To” dropdown to move the assignment to another game in the same slot. Include an add-row button that inserts a new assignment row with a member autocomplete selector. This panel ignores player-min/max validation while editing.

Panel 2 (Assignments by Member) lists members sorted by name and shows counts of assignments by priority (GM/1st, 2nd, 3rd, 4th, Other). Expanded rows show one row per slot with the assigned game (editable via the same “Move To” dropdown). A side panel displays the member’s game submission message if present.

Panel 3 (Member Choices) lists members and expands to show their choices per slot. Within each slot, show four choice rows. If a GM choice exists (rank 0), label the first row “GM” and skip the 1st-choice row; otherwise label rows 1st–4th. Each choice row uses a game dropdown to edit the choice via the `upsertGameChoiceBySlot` mutation. Show the member’s submission message alongside the choices.

Panel 4 (Game Interest Reference) shows games ordered by slot and displays overrun, shortfall, and spaces. Expanded rows list all members who chose the game, sorted by choice rank, with their priority label. This panel is read-only.

Add shared helper functions in `packages/amber/views/GameAssignments/utils.ts` to compute:

- Assignment counts per game (overrun, shortfall, spaces) using scheduled assignments only (`gm >= 0`).
- Per-member choice ordering and priority labels, using GameChoice ranks and the “No Game / Any Game” rules from `packages/amber/views/GameSignup/GameChoiceSelector.tsx`.
- Move-to options for a member/slot sorted by choice rank and then game name, with option labels that include priority and open spaces.

Add Playwright coverage in `apps/acnw/playwright/game-assignments.spec.ts` that logs in as `alex.admin@example.com`, navigates to `/game-assignments`, expands a game row, moves one assignment to another game in the same slot, and verifies the counts update. Include a test that expands a member row and changes their slot assignment using keyboard navigation, asserting the updated game label appears.

## Concrete Steps

1. Add `react-resizable-panels` to `packages/amber/package.json` and install dependencies with `pnpm install` (if needed).
2. Create `packages/amber/views/GameAssignments` with:
   - `GameAssignmentsPage.tsx` (main layout + data fetching)
   - `GameAssignmentsByGamePanel.tsx`
   - `GameAssignmentsByMemberPanel.tsx`
   - `GameChoicesPanel.tsx`
   - `GameInterestPanel.tsx`
   - `utils.ts` (data shaping helpers)
3. Add Next.js pages `apps/acnw/pages/game-assignments.tsx` and `apps/acus/pages/game-assignments.tsx` that render the shared view and export `configGetServerSideProps`.
4. Update `apps/acnw/views/Routes.tsx` and `apps/acus/views/Routes.tsx` to include the new route entry with `Perms.GameAdmin`.
5. Add `apps/acnw/playwright/game-assignments.spec.ts` with accessibility-first selectors and keyboard navigation checks.
6. Run `pnpm tsgo`, `pnpm lint`, `pnpm test`, and `pnpm -F acnw playwright test` from the repo root.

## Validation and Acceptance

Acceptance is met when:

- Navigating to `/game-assignments` as a Game Admin shows four resizable panels with headings.
- Panel 1 allows adding a member to a game and moving an assignment to another game in the same slot; overrun/shortfall/spaces values update after the move.
- Panel 2 shows correct priority counts and allows changing slot assignments via the dropdown, with the member’s submission message visible.
- Panel 3 allows editing choices per slot, correctly switching between GM and 1st-choice labeling based on rank 0 presence.
- Panel 4 shows interest lists sorted by choice rank and remains read-only.
- Playwright tests pass and prove at least one move and one choice edit.

Run from the repo root:

- `pnpm tsgo`
- `pnpm lint`
- `pnpm test`
- `pnpm -F acnw playwright test`

## Idempotence and Recovery

The UI changes are additive and safe to re-run. If a panel layout becomes unstable, reduce complexity by temporarily disabling virtualization and re-running tests. If data mutations fail, the dashboard should display an error message and keep existing state until a successful retry.

## Artifacts and Notes

After implementation, capture a short transcript of the Playwright run showing the dashboard test passing, and record any timing tweaks required to stabilize the test in `Surprises & Discoveries`.

## Interfaces and Dependencies

Key view-model types to define in `packages/amber/views/GameAssignments/types.ts` (or `utils.ts` if preferred):

type GameAssignmentSummaryRow = {
gameId: number
slotId: number
name: string
playerMin: number
playerMax: number
assignedCount: number
overrun: number
shortfall: number
spaces: number
}

type MemberAssignmentSummaryRow = {
memberId: number
memberName: string
counts: {
gmOrFirst: number
second: number
third: number
fourth: number
other: number
}
}

type MoveOption = {
gameId: number
label: string
priorityLabel: string
spaces: number
}

The panel components should consume the new `gameAssignments.getAssignmentDashboardData` query and call `gameAssignments.updateGameAssignments` for assignment moves. The member choice editor should call `gameChoices.upsertGameChoiceBySlot`. All new components must use function expressions, `type` declarations, and avoid `React.FC`.

Plan update note: Initial draft created for the Game Assignment dashboard UI and Playwright coverage.
Plan update note: Marked UI components, routing, editing flows, and Playwright test creation complete; added pending validation step.
