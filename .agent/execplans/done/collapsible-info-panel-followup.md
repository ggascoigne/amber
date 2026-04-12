# Fix CollapsibleInfoPanel Layout Regressions In Game Assignments

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This document must be maintained in accordance with `.agent/PLANS.md`.

## Purpose / Big Picture

The `CollapsibleInfoPanel` refactor introduced two user-visible layout regressions on the Game Assignments page. The legend panel now drops to a new line in compact mode, and the organizer message panel in the Assignments-by-Game expansion can still render as one long line that makes the surrounding container scroll horizontally. After this fix, both panels must preserve the pre-refactor behavior: legend stays inline with the title-bar controls, and organizer text expands with wrapping inside the available width.

## Progress

- [x] (2026-02-08 19:39Z) Introduced shared panel at `packages/amber/views/GameAssignments/CollapsibleInfoPanel.tsx` and migrated legend + organizer message to it.
- [x] (2026-02-08 19:39Z) Added `fillContainer` option in `CollapsibleInfoPanel` and enabled it for organizer message usage.
- [x] (2026-02-08 19:39Z) Verified lint and typecheck pass: `pnpm lint`, `pnpm tsgo`.
- [x] (2026-02-08 21:45Z) Reproduced both regressions in browser and inspected DOM/CSS in `Candela Obscura.*` expansion via `agent-browser --cdp 9222` and in-page computed styles.
- [x] (2026-02-08 21:50Z) Updated legend and organizer styles in `GameAssignmentsPage.tsx` and `GameAssignmentsByGamePanel.tsx` to restore compact inline behavior and prevent collapsed organizer overflow expansion.
- [x] (2026-02-08 21:52Z) Added Playwright coverage in `apps/acnw/playwright/game-assignments.spec.ts` for legend compact alignment and organizer collapsed/expanded style behavior.
- [ ] (2026-02-08 21:54Z) Re-run validation (`pnpm lint`, `pnpm tsgo`, targeted `pnpm test:e2e`) and commit. Completed: `pnpm lint`, `pnpm tsgo`; Remaining: e2e execution/commit.

## Surprises & Discoveries

- Observation: `agent-browser` from this sandboxed Codex session fails even when the user can run it locally.
  Evidence: direct daemon startup failed with `EPERM` writing `~/.agent-browser/default.pid`, and with `AGENT_BROWSER_SOCKET_DIR=/tmp/...` failed on Unix socket listen: `listen EPERM ... default.sock`.
- Observation: `AGENT_BROWSER_HOME` is not the daemon path control for pid/socket.
  Evidence: daemon source at `~/.local/lib/node_modules/agent-browser/dist/daemon.js` uses `AGENT_BROWSER_SOCKET_DIR` / `XDG_RUNTIME_DIR` / `~/.agent-browser`.
- Observation: current code tries to constrain organizer content with `whiteSpace: 'pre-wrap'`, `overflowWrap: 'anywhere'`, and `wordBreak: 'break-word'`, but user still reports single-line overflow in real UI.
  Evidence: user feedback after deployment and manual verification request.
- Observation: collapsed organizer message used `white-space: nowrap` with ellipsis, which caused the expanded-row cell to size to ~2114px wide in `Candela Obscura.*`, forcing horizontal expansion.
  Evidence: live DOM inspection before fix reported collapsed metrics `{ cell.clientWidth: 2114, cell.scrollWidth: 2114, p.whiteSpace: 'nowrap' }`; after line-clamp style change metrics dropped to `{ cell.clientWidth: 650, cell.scrollWidth: 650, p.whiteSpace: 'normal' }`.
- Observation: in this harness, `agent-browser --cdp 9222 snapshot` only succeeds reliably when `connect` and `snapshot` run in one shell invocation.
  Evidence: standalone `snapshot` intermittently fell back to local `browserType.launch` and failed with macOS permission errors; chained command `agent-browser --cdp 9222 connect 9222 && agent-browser --cdp 9222 snapshot -i` succeeded repeatedly.
- Observation: targeted Playwright e2e execution is blocked in this sandbox by Chromium launch permissions.
  Evidence: `pnpm -F acnw test:e2e -- playwright/game-assignments.spec.ts` fails with `bootstrap_check_in ... MachPortRendezvousServer ... Permission denied (1100)`.

## Decision Log

- Decision: Keep a shared collapsible component rather than reverting to two separate implementations.
  Rationale: user explicitly requested shared component reuse between legend and organizer message blocks.
  Date/Author: 2026-02-08 / Codex

- Decision: Add a `fillContainer` prop to vary sizing behavior by usage site.
  Rationale: legend needs intrinsic width for inline toolbar placement; organizer message needs full-width bounded behavior in expansion rows.
  Date/Author: 2026-02-08 / Codex

- Decision: Defer browser-true inspection to a new session where `agent-browser` is permitted.
  Rationale: current sandbox blocks daemon/socket operations, preventing reliable CDP inspection.
  Date/Author: 2026-02-08 / Codex
- Decision: Keep shared `CollapsibleInfoPanel` API unchanged and fix layout behavior at call sites.
  Rationale: regression root cause was usage-specific style configuration (legend max width and organizer collapsed typography), so call-site adjustments are lower risk than adding new shared component branches.
  Date/Author: 2026-02-08 / Codex
- Decision: replace collapsed organizer `nowrap` ellipsis with a 1-line clamp (`display: -webkit-box`, `WebkitLineClamp: 1`, `whiteSpace: 'normal'`).
  Rationale: preserves compact collapsed display while allowing min-content width to shrink, eliminating the fit-content row blowout.
  Date/Author: 2026-02-08 / Codex
- Decision: move legend width constraints from `rootSx` to `collapsedSx`/`expandedSx` (`220` vs `380` at `md`).
  Rationale: collapsed legend should keep the compact width to stay inline with adjacent toolbar controls, while expanded legend needs the wider list layout.
  Date/Author: 2026-02-08 / Codex

## Outcomes & Retrospective

Live inspection verified both regressions and the style fixes restored intended behavior: compact legend remains inline and collapsed organizer no longer forces horizontal expansion in the `Candela Obscura.*` expanded row. New Playwright coverage was added for both behaviors. `pnpm lint` and `pnpm tsgo` pass. Remaining gap in this session is e2e runtime validation, which is blocked by sandbox Chromium launch permissions; run the new spec in an unrestricted local shell to complete final validation and commit.

## Context and Orientation

The affected page is the Game Assignments screen rendered by `packages/amber/views/GameAssignments/GameAssignmentsPage.tsx`, route `/game-assignments` in both apps (`apps/acnw/views/Routes.tsx`, `apps/acus/views/Routes.tsx`). The Assignments by Game pane is implemented in `packages/amber/views/GameAssignments/GameAssignmentsByGamePanel.tsx`.

`CollapsibleInfoPanel` is new and currently lives at `packages/amber/views/GameAssignments/CollapsibleInfoPanel.tsx`. It is used in two places:

1. Legend panel in the page title bar (`GameAssignmentsPage.tsx`).
2. Organizer message block inside each expanded game row (`GameAssignmentsByGamePanel.tsx`).

The specific failing inspection target requested by user is the expanded game row matching `Candela Obscura.*` in Assignments by Game.

Known working constraints already requested by user:

- Legend compact mode should remain inline with title-level controls (not pushed to next line).
- Organizer message default state is collapsed.
- Organizer message expanded state must wrap text within available width; no single-line overflow that causes outer scrolling.

## Plan of Work

Start from the currently modified files and reproduce the issue on a running app instance (`acnw` expected). Use `agent-browser` in CDP mode against the user’s browser on port `9222` to inspect computed styles and element widths around the `Candela Obscura.*` expanded row.

First, confirm the exact DOM structure emitted by `CollapsibleInfoPanel` in organizer usage. Capture:

- width and min-width on root, collapsed/expanded container, text node wrapper.
- overflow settings for each ancestor from panel root up through expanded row container and table cell.
- whether any parent is a flex item missing `min-width: 0`.

Then inspect legend panel in compact mode at desktop width and identify which element is forcing wrap. Most likely causes are `width: 100%`, `maxWidth`, or flex-basis behavior in a title-bar child.

After diagnosing, adjust `CollapsibleInfoPanel` styles so intrinsic mode and fill mode are truly distinct. If needed, split internal wrappers so text container has `min-width: 0` and width constraints while icon button remains fixed-size. Keep the icon-button interaction pattern from the legend.

If shared component cannot satisfy both requirements without complicated conditional styles, preserve shared logic but expose explicit per-usage slots/styles (for example `contentContainerSx`) rather than branching layout assumptions in callers.

Finally, validate visually and with tests, then commit only relevant files.

## Concrete Steps

Run from repository root: `/Users/ggp/dev/git/amber`.

1.  Start the app (if not already running) and open Game Assignments page in browser.

    pnpm -F acnw dev

2.  In the browser launched by user, ensure CDP is available on `9222`, then inspect with `agent-browser` in the new session (with updated permissions/settings).

    agent-browser --cdp 9222 get url
    agent-browser --cdp 9222 snapshot -i

3.  Navigate to Assignments by Game, expand the `Candela Obscura.*` row, and inspect the organizer message panel DOM and computed styles.

    agent-browser --cdp 9222 find role row click --name "Candela Obscura"
    agent-browser --cdp 9222 snapshot -i
    agent-browser --cdp 9222 get styles <selector-or-ref>

4.  Apply style fixes in:
    - `packages/amber/views/GameAssignments/CollapsibleInfoPanel.tsx`
    - `packages/amber/views/GameAssignments/GameAssignmentsByGamePanel.tsx`
    - `packages/amber/views/GameAssignments/GameAssignmentsPage.tsx` (only if legend integration requires it)

5.  Re-run required checks:

    pnpm lint
    pnpm tsgo

6.  Run targeted end-to-end test(s):

        pnpm test:e2e --filter game-assignments

    If filtering is unavailable in this repo setup, run full:

        pnpm test:e2e

## Validation and Acceptance

Acceptance is complete when all of the following are true:

1. In desktop width, when legend is compact (`Legend` + expand icon), it remains on the same title-row line as the layout and assignment action buttons unless viewport is too narrow for all controls.
2. In Assignments by Game, expanding `Candela Obscura.*` shows organizer message collapsed by default.
3. Expanding organizer message shows wrapped text over multiple lines within the panel width; no horizontal page or pane scrolling is introduced by that content.
4. `pnpm lint` and `pnpm tsgo` pass.
5. Relevant e2e test(s) pass and cover the organizer message expand/collapse behavior if added.

## Idempotence and Recovery

All edits are local TypeScript/React style changes and are safe to repeat. If a style experiment regresses layout, revert only the specific file-level changes and re-run `pnpm lint` + `pnpm tsgo`. Do not reset unrelated workspace changes; this branch contains active user work in other files.

## Artifacts and Notes

Current uncommitted working-tree context at handoff time:

- `packages/amber/views/GameAssignments/CollapsibleInfoPanel.tsx` (new)
- `packages/amber/views/GameAssignments/GameAssignmentsByGamePanel.tsx` (modified)
- `packages/amber/views/GameAssignments/GameAssignmentsPage.tsx` (modified)

Useful diagnostic evidence from blocked sandbox session:

    Daemon error: Error: EPERM: operation not permitted, open '/Users/ggp/.agent-browser/default.pid'
    Server error: Error: listen EPERM: operation not permitted /tmp/agent-browser-sock/default.sock

These errors are environment-specific to the old session and should not be treated as code defects.

## Interfaces and Dependencies

`CollapsibleInfoPanel` public API currently includes:

- `collapsedContent: ReactNode`
- `expandedContent: ReactNode`
- `defaultCollapsed?: boolean`
- `expandAriaLabel?: string`
- `collapseAriaLabel?: string`
- `fillContainer?: boolean`
- `rootSx?: SxProps<Theme>`
- `collapsedSx?: SxProps<Theme>`
- `expandedSx?: SxProps<Theme>`

Maintain compatibility for both existing call sites while fixing layout behavior. Avoid introducing app-wide style side effects; constrain fixes to Game Assignments view files unless a shared UI primitive change is strictly necessary.
