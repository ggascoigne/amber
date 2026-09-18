# Add minimizable Game Assignments panes

This ExecPlan is a living document and must be maintained in accordance with `.agent/PLANS.md`.

## Purpose / Big Picture

The Game Assignments dashboard already supports Grid, Columns, and Rows layouts. After this change, an administrator using desktop Columns or Rows can minimize an individual pane to a compact row at the bottom of the dashboard and restore it later. The last visible pane cannot be minimized, so the dashboard always remains useful.

## Progress

- [x] 2026-09-17 17:35Z: Examined the layout planner, dashboard portal rendering, shared pane header, and persisted page state.
- [x] 2026-09-17 17:40Z: Added persisted minimized-pane state, pure helpers, and state tests.
- [x] 2026-09-17 17:40Z: Updated Rows and Columns planning to omit minimized panes, resize visible panes equally, and ignore stale expanded/minimized conflicts.
- [x] 2026-09-17 17:40Z: Added header minimize controls and a bottom restore dock.
- [x] 2026-09-17 17:42Z: Ran focused state/layout tests, `pnpm tsc`, `pnpm lint`, and `git diff --check` successfully.

## Surprises & Discoveries

- Observation: Pane content is rendered through stable DOM hosts and React portals, so a minimized pane should be removed from the main layout plan rather than conditionally unmounting its content.
  Evidence: `GameAssignmentsDashboard.tsx` creates one host per pane and attaches each host to a layout slot.
- Observation: The dashboard generated minimize props, but each individual pane component accepted only expand props and therefore discarded the minimize callback before reaching the shared header.
  Evidence: A rendered header received no `onToggleMinimize`, which deliberately suppresses the minimize button.

## Decision Log

- Decision: Persist minimized pane ids in local storage alongside the existing layout and expanded-pane settings.
  Rationale: Layout choices already survive page reloads, and minimization is a layout preference.
  Date/Author: 2026-09-17 / Codex
- Decision: Support minimization only for desktop Rows and Columns layouts; Grid and small screens keep their current behavior.
  Rationale: The requested behavior is explicitly scoped to row and column display, while Grid's nested arrangement and small-screen stack do not have a clear bottom-dock interaction.
  Date/Author: 2026-09-17 / Codex
- Decision: Disable minimize on the final visible pane.
  Rationale: The user explicitly requires at least one visible pane.
  Date/Author: 2026-09-17 / Codex

## Outcomes & Retrospective

The implementation persists minimized panes, renders the requested controls and restore dock, and blocks the last visible pane from being minimized. A follow-up fixed missing prop forwarding through all four pane components, which made the minimize control visible. The focused state/layout tests, `pnpm tsc`, `pnpm lint`, and `git diff --check` pass. Manual browser verification remains available if a running app session is desired.

## Context and Orientation

`packages/amber/views/GameAssignments/GameAssignmentsPage.tsx` owns persisted dashboard preferences and passes them into `GameAssignmentsDashboard.tsx`. `GameAssignmentsDashboard.tsx` turns a `GameAssignmentsLayoutPlan` into resizable panels and owns stable portal hosts for the four panes. `layoutPlan.ts` is the pure planner for Grid, Columns, and Rows. `GameAssignmentsPanelHeader.tsx` is shared by all four panes and currently shows the expand button.

A minimized pane is a pane id removed from the main Rows or Columns plan. It remains represented by a one-line bottom dock item containing its title and a Restore button. A visible pane is one not minimized. The invariant is that at least one of the four pane ids remains visible.

## Plan of Work

First, add a `GameAssignmentsMinimizedPaneIds` state type plus sanitizing and toggle helpers in `pageState.ts`. The toggle helper will refuse to add the final visible pane. Cover malformed stored values, toggling, and the final-pane rule in `pageState.test.ts`.

Next, pass minimized ids to `buildGameAssignmentsLayoutPlan`. Rows and Columns will use only visible pane ids and calculate equal default sizes from the remaining pane count. Grid and small-screen plans will ignore minimized ids. Add planner tests for one minimized pane and for the single-pane safeguard.

Then, persist the state in `GameAssignmentsPage.tsx`, clear an expanded pane before minimizing it, and pass controls to the dashboard. Extend the shared panel-header props with an optional minimize callback and a disabled flag. Render the minimize button immediately before the existing expand button.

Finally, have `GameAssignmentsDashboard.tsx` provide minimize props only when the desktop layout is Rows or Columns, omit minimized ids from the main plan, and render a bottom dock for the minimized ids. The dock will use the pane titles "Assignments by Game", "Assignments by Member", "Member Choices", and "Game Interest" and restore only the selected pane.

## Concrete Steps

From `/Users/ggp/Developer/git/amber`:

1. Edit `pageState.ts` and tests, then run:

       pnpm exec vitest run packages/amber/views/GameAssignments/pageState.test.ts

   Expect all state-helper tests to pass, including a test that cannot minimize the last visible pane.

2. Edit `layoutPlan.ts` and tests, then run:

       pnpm exec vitest run packages/amber/views/GameAssignments/layoutPlan.test.ts

   Expect Rows and Columns plans to exclude minimized ids and size remaining panes equally.

3. Edit the page, dashboard, and shared header. Run:

       pnpm tsc
       pnpm lint

   Expect both commands to exit successfully.

4. Start the relevant local app with `pnpm dev:nw`, navigate to `/game-assignments`, choose Rows and Columns, minimize panes, and verify restore behavior. Verify the final visible pane has a disabled minimize button.

## Validation and Acceptance

In Rows and Columns on a desktop viewport, every visible pane header shows a minimize control to the left of its expand control. Minimizing a pane removes its full content and adds a single-line item at the bottom of the dashboard showing its title and Restore button. Restore returns the pane to the main layout. After three panes are minimized, the final visible pane cannot be minimized. Grid and small-screen behavior remain unchanged. Stored invalid minimized-pane values are ignored safely.

## Idempotence and Recovery

All state is client-side layout preference data. Reloading is safe. Removing the local-storage minimized-pane key restores the default view. No database changes occur.

## Artifacts and Notes

The central correctness rule is: `visiblePaneIds.length >= 1`. Both UI disabled state and state-transition helper enforce it so a stale callback cannot remove all panes.

## Interfaces and Dependencies

`pageState.ts` will export a minimized-pane state type and pure helpers. `buildGameAssignmentsLayoutPlan` will accept the minimized ids so its output remains directly testable. `GameAssignmentsPanelHeader` will accept `onToggleMinimize` and `isMinimizeDisabled` optional props. No new package dependencies are needed; use direct Material UI icon imports and existing `react-resizable-panels` layout primitives.

Revision 2026-09-17: Created the plan after the user requested pane minimization and clarified that the last pane cannot be minimized.

Revision 2026-09-17: Recorded the implemented state, layout, UI work, and successful automated validation. The planner now treats a minimized expanded pane as non-expanded so stale local storage cannot hide the dock.

Revision 2026-09-17: Recorded and corrected the missing minimize-prop forwarding through the four pane components after the control did not render.
