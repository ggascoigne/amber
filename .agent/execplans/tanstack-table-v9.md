# Upgrade the shared DataTable system and adopt TanStack Table v9 reactivity

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds. This document is maintained in accordance with `.agent/PLANS.md`.

## Purpose / Big Picture

Amber's shared `Table` and `DataTable` components originally depended on TanStack Table 8.21.3. The native 9.1.2 migration is complete. This follow-on work adopts v9's atomic state model so that consumers can observe only query-relevant state, selection controls can update without making unrelated table cells reactive, and server-driven tables can share pagination, sorting, and filtering state directly through TanStack Store atoms. Users should still be able to sort, filter, group, resize, paginate, select, expand, virtualize, edit, and persist table state. The result is visible through focused state-notification tests, render-subscription tests, the existing table unit suite, and the UI test application's browser coverage.

## Progress

- [x] (2026-08-14 16:08Z) Read repository instructions, the dependency-upgrade workflow, React maintainability guidance, React performance guidance, and TanStack's official v9 migration guide.
- [x] (2026-08-14 16:08Z) Located the shared table implementation, consumers, type augmentations, package declarations, and existing unit and browser tests.
- [x] (2026-08-14 16:08Z) Established a clean baseline: all 98 Vitest files and 346 tests pass on TanStack Table 8.21.3.
- [x] (2026-08-14) Upgraded all workspace declarations and the pnpm lockfile from 8.21.3 to 9.1.2.
- [x] (2026-08-14) Migrated the shared table factory and state bridge to the native v9 API without using the deprecated legacy adapter.
- [x] (2026-08-14) Repaired v9 type and behavior changes throughout shared components, app consumers, tests, and module augmentation declarations.
- [x] (2026-08-14) Formatted and validated with `pnpm tsc`, `pnpm test`, `pnpm lint`, and the complete 22-test UI DataTable Playwright suite. The app E2E and build entry points were also attempted and recorded below.
- [x] (2026-08-14) Completed the React maintainability/performance and dependency-diff pass, documented interface decisions, and verified a clean final diff.
- [x] (2026-08-14 18:46Z) Separated persisted-state observation from query-state and legacy full-state notifications, migrated consumers to `onQueryStateChange`, and validated that selection does not notify query consumers.
- [x] (2026-08-14 18:54Z) Moved selection, pagination, filtering, expansion, visibility, resizing, header, row, and debug reads to TanStack v9 subscription boundaries and validated all table interactions.
- [ ] Add selected-state generics to Amber's table adapter and opt the high-level `Table` root out of broad state re-renders while preserving low-level `DataTable` compatibility.
- [ ] Add a `useServerTableState` external-atom integration, migrate server-driven UI-test examples, and validate direct table-to-query state flow.
- [ ] Run formatting, type checking, unit tests, lint, and all available table browser tests; record final evidence and complete the retrospective.

## Surprises & Discoveries

- Observation: TanStack Table v9 is stable as of this work; the npm registry reports 9.1.2 for both `@tanstack/react-table` and `@tanstack/table-core`.
  Evidence: `pnpm view @tanstack/react-table version dist-tags --json` and the corresponding core command both report `"latest": "9.1.2"`.
- Observation: the existing `Table` wrapper relies on v8's removed all-state `onStateChange` option and stores the full `TableState` in a ref, forcing a React render for every update.
  Evidence: `packages/ui/components/Table/Table.tsx` passes `state`, `onStateChange`, and increments `setTableStateRevision`.
- Observation: upstream provides a deprecated `useLegacyTable` bridge, but its own guide says it includes every feature and is intended only for incremental migration.
  Evidence: the official migration guide's “Quick Legacy Migration” section.
- Observation: `pnpm install` updated the dependency graph successfully, but its server postinstall could not generate SQL because PostgreSQL was unavailable at `127.0.0.1:54320`.
  Evidence: the Prisma postinstall reported `Can't reach database server at 127.0.0.1:54320`; all workspace packages subsequently type-checked against the installed v9 graph.
- Observation: v9 column definitions preserve each accessor's value type invariantly, so heterogeneous helper-created arrays need `columnHelper.columns([...])` rather than a plain array.
  Evidence: the ui-test compile initially rejected mixed string/number accessor arrays and passed after applying the v9 helper to the seven example definitions.
- Observation: v9 row, cell, column, and header methods are prototype/receiver-bound. Spreading a cell or calling a destructured column method drops its receiver even though TypeScript can accept some of those shapes.
  Evidence: unit tests caught `cell.getIsGrouped is not a function` in the editing adapter; Playwright then caught a detached `getFilterValue` call. Preserving the cell prototype and calling methods on their instances fixed both classes of failure.
- Observation: TanStack's v9 pagination feature defaults to 10 rows, while Amber's high-level `Table` wrapper historically initialized 100 rows per page.
  Evidence: the first visual browser run rendered 10 rows and differed from the checked-in 100-row snapshots; explicitly retaining `DEFAULT_TABLE_PAGE_SIZE` restored every snapshot.
- Observation: the full application E2E and production-build entry points cannot complete in the current environment because both applications require PostgreSQL at `127.0.0.1:54320` during setup.
  Evidence: `pnpm test:e2e`, `pnpm build:nw`, and `pnpm build:us` all failed in database migration/seed or Prisma calls with `ECONNREFUSED`/`P1001` before application validation could run. The independent ui-test DataTable suite passed all 22 tests.
- Observation: Amber's default sort applies to the first user column before the first query-state notification.
  Evidence: the new state-bridge test initially expected an empty sorting array but received `[{ id: 'name', desc: false }]`; the assertion now records the established default-sort behavior.
- Observation: isolated row test doubles created before v9 did not provide the row's table reference, which atomic subscriptions require.
  Evidence: the first table suite run failed two `TreeLines` tests at `row.table.atoms.expanded`; adding a minimal readonly expanded atom to the test double restored the intended isolated test contract.

## Decision Log

- Decision: target stable 9.1.2 rather than a v9 prerelease.
  Rationale: 9.1.2 is the current npm `latest` release for both packages and includes post-9.0 state-loop fixes.
  Date/Author: 2026-08-14 / Codex
- Decision: migrate to native v9 rather than `useLegacyTable`.
  Rationale: the legacy hook is deprecated, increases bundle size, and would leave the actual breaking migration for later.
  Date/Author: 2026-08-14 / Codex
- Decision: preserve the public Amber `Table` and `DataTable` interfaces unless a v9 semantic change makes an existing contract misleading or unsafe.
  Rationale: many app views consume the shared wrapper; v9's primary changes are internal table construction and state management, so consumer churn should be justified by a concrete benefit.
  Date/Author: 2026-08-14 / Codex
- Decision: bind all Amber table types to one exported `amberTableFeatures` registry through project-local aliases and replace five duplicated v8 module-augmentation files with one shared v9 augmentation.
  Rationale: v9 adds the feature-set generic to table types. A single registry keeps runtime capabilities, valid function-name strings, and types aligned across every workspace while removing declaration drift.
  Date/Author: 2026-08-14 / Codex
- Decision: observe the v9 table store for Amber's existing complete-state callback instead of controlling every state slice externally.
  Rationale: v9 removed the all-state `onStateChange` option. Store observation preserves the existing `handleStateChange` and persistence contracts, allows the table to own its state, and removes the v8 dummy render counter.
  Date/Author: 2026-08-14 / Codex
- Decision: adopt v9's `columnHelper.columns([...])` interface for helper-authored column arrays and the renamed `sortFn` option.
  Rationale: these are intentional v9 type/API improvements. Keeping the old plain helper-array shape would require erasing cell value types, while a compatibility facade would conceal the upstream contract.
  Date/Author: 2026-08-14 / Codex
- Decision: custom filter functions are registered centrally in `amberTableFeatures` rather than passed dynamically through `UseTableProps.filterFns`.
  Rationale: v9 makes row-model function registries part of the static feature definition so their keys are type-safe and tree-shakeable. Amber had no consumers supplying dynamic registries; `numericText` is now registered once.
  Date/Author: 2026-08-14 / Codex
- Decision: keep table state internally owned unless a consumer truly shares a slice with another subsystem.
  Rationale: v9's internal atoms are the simplest owner for ordinary tables. Store subscriptions are observation, while external atoms are reserved for server-query tables where the query and table genuinely share pagination, sorting, and filter state.
  Date/Author: 2026-08-14 / Codex
- Decision: preserve `handleStateChange` temporarily as a deprecated full-state notification and add `onQueryStateChange` as the preferred semantic callback.
  Rationale: the old callback remains source-compatible, while the new callback prevents transient UI state such as selection and column resizing from causing query consumers to update.
  Date/Author: 2026-08-14 / Codex
- Decision: optimize from leaf subscription boundaries upward, and only then narrow the high-level root selector.
  Rationale: a root `() => null` selector is only correct after every render-dependent state read is covered by `table.Subscribe`, the standalone `Subscribe`, or a lower-level adapter that still selects full state.
  Date/Author: 2026-08-14 / Codex

## Outcomes & Retrospective

The native v9 migration is implemented across the monorepo. Amber now constructs a tree-shakeable explicit feature set, uses v9 row-model factories, observes the v9 store for persistence and server-query callbacks, uses v9 filter/sort APIs, and preserves receiver-bound instances in rendering and filters. The high-level `Table`/`DataTable` props and the 100-row default remain intact. The intentional authoring changes are `columnHelper.columns([...])`, `sortFn`, feature-bound exported types, and static custom-filter registration.

Validation completed successfully for formatting, every workspace typecheck, lint, 100 Vitest files / 355 tests, and all 22 ui-test Playwright scenarios including snapshots, sorting/filter surfaces, grouping, pagination, editing, nested rows, and layout variants. The final React pass confirmed that the feature registry and empty-data fallback are module-stable, subscriptions clean up, the debounced callback reads current handlers through refs without resubscribing on each table update, and no new suppressions or unsafe `any` casts were introduced. Application E2E and builds remain environmentally unverified past setup because the required local PostgreSQL service is not running; their failures were database connection failures rather than table regressions.

The follow-on atomic-state milestones below are in progress. This section must be updated after each milestone with its behavior and validation evidence.

Milestone one is complete. `useTableStateNotifications` now owns the v9 store subscription and independently compares persisted state, query state, and the deprecated full state. `pnpm tsc` passed all eleven checked workspaces, and `pnpm test -- packages/ui/components/Table` passed 100 files and 356 tests. The focused bridge test proves that initial query state is emitted, row selection is ignored, and global filtering is emitted after the debounce.

Milestone two is complete. `DataTable` now owns an explicit render-state subscription that excludes row selection, while toolbar, row, checkbox, pagination, filter, expansion, column-visibility, header-resizing, and debug components subscribe to the exact atom or store projection they render. No shared table component reads `table.state` directly. `pnpm -F @amber/ui tsc` passed, the 100-file/356-test Vitest run passed, and all 22 Chromium UI table Playwright scenarios passed in 15.2 seconds.

## Context and Orientation

This repository is a pnpm monorepo. `packages/ui/components/Table/useTable.tsx` is the central adapter around TanStack Table. It supplies Amber defaults, injects the selection column, and currently calls v8's `useReactTable`. `packages/ui/components/Table/Table.tsx` is the higher-level component most features consume; it owns persisted state, server-side change notifications, row actions, expansion, and rendering through `DataTable`. `packages/ui/components/Table/DataTable.tsx` and its sibling `components`, `content`, `editing`, `filter`, and `actions` folders render and manipulate the table instance.

TanStack Table is “headless”: it calculates table structure and state but Amber supplies the MUI markup. In v9 the React hook is named `useTable`, table capabilities are registered through a `features` object, processed row models are created on that feature object, and the all-state `onStateChange` callback no longer exists. State can still be controlled per slice, or observed through the table's store. The existing Amber wrapper's `handleStateChange` prop reports a complete `TableState` for persistence and server-driven consumers, so the migration must reproduce that outcome without the removed v8 option.

The dependency is declared in `packages/ui/package.json`, `packages/amber/package.json`, `apps/ui-test/package.json`, `apps/acnw/package.json`, and `apps/acus/package.json`. Module augmentations live in each consuming workspace's `types/tanstack-table.d.ts`. The focused unit coverage lives under `packages/ui/components/Table/__tests__`, with smaller colocated tests in `content`; Playwright coverage for layouts and interactions lives under the repository's Playwright suites and exercises the `apps/ui-test` table views.

## Plan of Work

First update all workspace manifests to the same TanStack Table 9.1.2 versions and regenerate `pnpm-lock.yaml`. Keeping the React adapter and core package exactly aligned avoids duplicate type universes in module augmentation and generic table types.

Next migrate `packages/ui/components/Table/useTable.tsx`. Replace the renamed hook and v8 row-model options with native v9 feature registration. Register the capabilities that Amber's shared table actually exposes, including column filtering, global filtering, grouping and aggregation, ordering, visibility, sizing and resizing, row expansion, pagination, selection, and sorting. Register Amber's custom `numericText` filter alongside the built-in functions needed by existing string-valued column definitions. Keep the exported Amber hook named `useTable`; alias the upstream hook locally if needed so consumers do not change.

Then replace the removed full-state callback in `packages/ui/components/Table/Table.tsx`. Prefer the v9 store or supported per-slice ownership mechanism that keeps a complete current state available, resets page index when filters change, persists the debounced state, calls the existing `handleStateChange`, and triggers normal React rendering without a dummy revision counter. Preserve the current initial-state load gate and existing controlled/uncontrolled public props unless v9 makes a better contract necessary.

Compile after the central migration and follow errors outward. Update renamed v9 state fields and methods, generic signatures, helper imports, column definitions, test harnesses, and declaration merging in the smallest coherent edits. Treat compile errors as migration evidence rather than suppressing them; remove existing unsafe suppressions in touched code when the v9 types make a precise replacement practical.

Finally run formatting and the full repository validation. Inspect the migrated React modules against the maintainability catalog and the relevant Vercel guidance, particularly controlled state, direct imports, derived state, render churn, and conditional rendering. Run browser tests after static and unit checks pass, and record exact outcomes here.

For the atomic-state follow-on, first extract state observation from `packages/ui/components/Table/Table.tsx`. Define a query-state projection containing pagination, sorting, column filters, and global filter. Persisted state, query notification state, and the deprecated full-state callback must each be compared and debounced independently so unrelated state changes do not wake query consumers. Migrate existing consumers that manually projected those four fields to `onQueryStateChange` and add tests proving that row selection does not notify it.

Next replace render-time full-state reads at clear component boundaries with v9 subscriptions. Pagination subscribes to the pagination atom, the toolbar and row checkboxes subscribe to row selection, and filter UI subscribes only to column and global filters. Builder-method reads in extracted row and header components use the standalone `Subscribe` component so React Compiler can see their hidden state dependency. Validate selection, pagination, filtering, sorting, grouping, expansion, and resizing before narrowing the root.

Then make `AmberTable` and Amber's `useTable` generic over the selector result. The high-level `Table` should invoke `useTable` with a selector that does not subscribe its root to table state and should render `DataTable` beneath an explicit state boundary covering the row-model and layout slices it needs. Direct low-level `DataTable` consumers continue to omit the selector and therefore retain the full-state behavior.

Finally add `useServerTableState`, backed by stable writable atoms from `@tanstack/react-store`. It returns the atoms to pass through `Table` and a reactively selected query-state object for query keys. Migrate the UI-test server-driven examples away from callback-to-React-state mirroring. External-atom examples disable `Table` persistence unless they explicitly initialize their atoms from the same persistence owner; this preserves the rule that every slice has exactly one owner.

## Concrete Steps

All commands run from `/Users/ggp/dev/git/amber`.

The baseline command was:

    pnpm test -- packages/ui/components/Table

Vitest interpreted the repository command broadly and reported:

    Test Files  98 passed (98)
    Tests       346 passed (346)

Update the dependency declarations, then install:

    pnpm install

During migration use the fastest feedback loops first:

    pnpm -F @amber/ui tsc
    pnpm test -- packages/ui/components/Table

At completion run the repository-required validation:

    pnpm format
    pnpm tsc
    pnpm test
    pnpm lint
    pnpm test:e2e

If the complete browser suite requires unavailable services or secrets, run every locally available table-focused Playwright project, preserve its artifacts, and document the exact environmental blocker for the remainder.

After each follow-on milestone, run from `/Users/ggp/dev/git/amber`:

    pnpm -F @amber/ui tsc
    pnpm test -- packages/ui/components/Table

Run the smallest relevant Playwright interaction set after the subscription and root-selector milestones, then run the complete repository validation at the end.

## Validation and Acceptance

The dependency migration is accepted when `pnpm-lock.yaml` resolves one compatible 9.1.2 TanStack Table core for the React adapter and all five workspace manifests request v9. The source must not import the deprecated `/legacy` entry point or `useLegacyTable`.

Static acceptance requires all packages to pass `pnpm tsc` with no new suppressions. Behavioral acceptance requires all Vitest tests to pass, including table state persistence, expansion, editing, and virtualization. Lint must pass after formatting. Browser acceptance requires the available Playwright suites to demonstrate sorting, filtering, pagination, selection, grouping or expansion, layout controls, and editable cells against the UI test app without regressions.

The public `Table` and `DataTable` props should remain source-compatible. Any intentional change must be listed in the Decision Log with affected consumers and a migration note. State callbacks must continue receiving a complete state object after initial load and after user interactions; filter changes must continue resetting pagination to the first page.

## Idempotence and Recovery

Manifest edits and `pnpm install` are safe to repeat. Formatting and validation commands are also repeatable. Do not delete the existing lockfile or node_modules as part of normal recovery. If a v9 migration attempt fails, retain the compile errors as evidence, revise the feature set or state bridge, and rerun the focused typecheck. The pre-upgrade tree was clean, so `git diff` always identifies only migration work, but no destructive reset command should be used because later changes may belong to the user.

## Artifacts and Notes

Primary upstream reference: TanStack's “Migrating to TanStack Table V9 (React)” guide at `https://tanstack.com/table/latest/docs/framework/react/guide/migrating`.

The official release page shows `@tanstack/react-table@9.1.2` and `@tanstack/table-core@9.1.2`, released in August 2026. The migration guide notes that v9 preserves the headless rendering model while changing hook construction, feature registration, row-model registration, state access, pinning terminology, sizing state, aggregation, and some selection semantics.

## Interfaces and Dependencies

At completion, all relevant manifests must use:

    "@tanstack/react-table": "^9.1.2"
    "@tanstack/table-core": "9.1.2"

Existing exact-versus-caret conventions may be normalized if doing so guarantees one type version across the monorepo; record that choice in the Decision Log.

`packages/ui/components/Table/useTable.tsx` must continue exporting `UseTableProps<TData>` and `useTable(props)` for Amber code. Internally it must call TanStack v9's native `useTable` with a v9 `features` configuration and v9 row-model factories. `packages/ui/components/Table/Table.tsx` must continue exporting `Table` with `handleStateChange?: (newState: TableState) => void`, unless implementation proves a narrower public type is materially safer and all consumers are migrated with a recorded rationale.

At the end of the follow-on work, `Table` also exposes `onQueryStateChange?: (newState: TableQueryState) => void`, while `handleStateChange` remains deprecated and behavior-compatible. `AmberTable<TData, TSelected>` and `useTable(props, selector)` preserve the selector's result type. `useServerTableState` returns stable writable atoms for `pagination`, `sorting`, `columnFilters`, and `globalFilter`, plus a reactive `state` containing those same slices.

Revision note, 2026-08-14: expanded the completed migration plan with four ordered atomic-state milestones requested after the v9 validation succeeded. The additions preserve the prior migration record while making the follow-on work restartable from this document alone.

Revision note, 2026-08-14 18:46Z: recorded completion and validation of the notification-projection milestone, including the discovered default-sort behavior.

Revision note, 2026-08-14 18:54Z: recorded the completed subscription-boundary milestone, its isolated-test adjustment, and full browser evidence.
