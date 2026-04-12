# Decompose the shared Table system into focused modules without changing its public behavior

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This plan must be maintained in accordance with `.agent/PLANS.md` from the repository root.

## Purpose / Big Picture

The shared table system in `packages/ui/components/Table` currently asks a small number of files to do too many jobs at once. A contributor who wants to change row expansion, cell editing, virtualization, or sticky layout must currently read and reason about all of those features together. After this change, a developer should be able to open a small, clearly named file for one concern at a time: table state wiring, body row rendering, expansion behavior, virtualization behavior, or editing behavior. The visible behavior of the table must stay the same for users: selection, sorting, grouping, pagination, inline cell editing, add-row flow, row expansion, sticky header and footer, and the “Show Expanded” switch must continue to work.

A novice can see the result by running the UI typecheck and the focused tests added by this plan. They should observe that the public exports from `packages/ui/components/Table/index.tsx`, the wrapper component in `packages/ui/components/Table/Table.tsx`, and the render component in `packages/ui/components/Table/DataTable.tsx` still behave the same, while the implementation is split into smaller modules with narrower responsibilities.

## Progress

- [x] (2026-04-12 10:00Z) Read `.agent/PLANS.md` and captured its structural requirements for ExecPlans.
- [x] (2026-04-12 10:08Z) Inspected the current shared table implementation in `packages/ui/components/Table/Table.tsx`, `packages/ui/components/Table/DataTable.tsx`, `packages/ui/components/Table/TableContent.tsx`, `packages/ui/components/Table/useTable.tsx`, `packages/ui/components/Table/useTableState.ts`, and `packages/ui/components/Table/editing/useTableEditing.ts`.
- [x] (2026-04-12 10:12Z) Verified supporting files and implementation details in `packages/ui/components/Table/editing/types.ts`, `packages/ui/components/Table/constants.ts`, `packages/ui/components/Table/components/RowExpansionButton.tsx`, `packages/ui/components/Table/components/TableStyles.tsx`, `packages/ui/components/Table/TableHeader.tsx`, and `packages/ui/components/Table/TableFooter.tsx`.
- [x] (2026-04-12 17:42Z) Added focused tests under `packages/ui/components/Table/__tests__` for save/discard flow, validation errors, expansion filtering, virtualization gating, and the combined `Table.tsx` wrapper path.
- [x] (2026-04-12 17:53Z) Split `packages/ui/components/Table/TableContent.tsx` into focused `content` modules for visible-row derivation, virtualization, editable-cell navigation, base row rendering, and expanded-row rendering.
- [x] (2026-04-12 17:57Z) Split `packages/ui/components/Table/editing/useTableEditing.ts` into `editing/internalTypes.ts`, `editing/editingValidation.ts`, `editing/editingState.ts`, `editing/useActiveTableCell.ts`, and `editing/usePendingNewRow.ts` while preserving the `TableEditingState<TData>` surface.
- [x] (2026-04-12 17:59Z) Reduced `packages/ui/components/Table/Table.tsx` and `packages/ui/components/Table/DataTable.tsx` to thinner orchestration shells by extracting expansion-column construction, pending-new-row wiring, visible-row ownership, and an explicit scroll-container interface for expansion toggles.
- [x] (2026-04-12 18:02Z) Ran `pnpm -F @amber/ui tsc`, `pnpm test -- --run packages/ui/components/Table/**`, and `pnpm lint` successfully; ran `pnpm tsgo` and confirmed it still fails outside this table work in `packages/amber/views/GameAssignments/domain/memberChoices.test.ts`.

## Surprises & Discoveries

- Observation: Expanded-content support already disables virtualization in practice, even though virtualization remains a general table feature.
  Evidence: `packages/ui/components/Table/TableContent.tsx` sets `enableVirtualRows` to false when expanded content is present, and `packages/ui/components/Table/Table.tsx` also resolves virtualization conservatively when `renderExpandedContent` exists.

- Observation: Expanded-only filtering logic is duplicated in more than one layer.
  Evidence: `packages/ui/components/Table/DataTable.tsx` computes a displayed row list from `showExpandedOnly`, while `packages/ui/components/Table/TableContent.tsx` independently recomputes the same derived row list.

- Observation: Scroll preservation for row expansion depends on a brittle DOM lookup by test id rather than a named interface.
  Evidence: `packages/ui/components/Table/components/RowExpansionButton.tsx` looks up an ancestor using `data-testid='TableContainerSortOf'`, and `packages/ui/components/Table/components/TableStyles.tsx` defines that test id on the custom container component.

- Observation: There is little or no focused test coverage around the table internals being refactored here.
  Evidence: The current package inspection did not reveal obvious test files specifically targeting `TableContent`, `DataTable`, or `useTableEditing`, so this plan includes creating them before moving logic.

- Observation: The virtual-row branch is difficult to assert through row count alone in jsdom because TanStack Virtual can legitimately render zero body rows when there is no real browser viewport measurement.
  Evidence: The new virtualization test had to assert the virtual-body styling contract on `TableBody` instead of assuming rendered row elements would exist under jsdom.

- Observation: The repository-wide `pnpm tsgo` command currently fails in an unrelated package, so it cannot be used as a clean acceptance signal for this refactor alone.
  Evidence: `packages/amber/views/GameAssignments/domain/memberChoices.test.ts` reports `Type 'Map<number, string>' is not assignable to type 'GameCategoryByGameId'` even though none of the table files import or modify that code path.

## Decision Log

- Decision: Keep the public API stable in `packages/ui/components/Table/index.tsx`, `packages/ui/components/Table/Table.tsx`, and `packages/ui/components/Table/DataTable.tsx` during this cleanup.
  Rationale: This is a maintainability refactor of shared infrastructure. Changing public props and exports at the same time would make the work harder to validate and would increase migration risk for callers across the monorepo.
  Date/Author: 2026-04-12 / Hermes.

- Decision: Extract pure logic and small hooks first, and move JSX-heavy rendering second.
  Rationale: The highest current risk is hidden behavior coupling. Pulling pure state transitions and row-selection, editing, and expansion rules into small helpers creates a testable seam before visual rearrangement begins.
  Date/Author: 2026-04-12 / Hermes.

- Decision: Treat expansion and virtualization as separate concerns, and preserve the current rule that expanded content is not virtualized until a dedicated expanded-row virtualization design exists.
  Rationale: The current code already assumes those features do not safely compose. Preserving that rule keeps the refactor behavior-neutral.
  Date/Author: 2026-04-12 / Hermes.

- Decision: Remove duplicated “expanded only” row filtering by giving one layer ownership of the derived visible-row list.
  Rationale: Duplicated derivation increases the chance that keyboard navigation, pagination padding, virtualization counts, and rendering disagree about which rows exist.
  Date/Author: 2026-04-12 / Hermes.

- Decision: Replace DOM test-id coupling for expansion scroll preservation with an explicit container interface owned by table rendering code.
  Rationale: A testing label is not a stable runtime contract. A named ref or callback is easier to understand and safer to change.
  Date/Author: 2026-04-12 / Hermes.

- Decision: Give `DataTable.tsx` sole ownership of visible-row derivation and pass the resolved rows into `TableContent.tsx` rather than letting both layers derive them.
  Rationale: This preserves the “one owner” goal from the plan and makes empty-state, pagination padding, keyboard navigation, and body rendering all reason over the same row list.
  Date/Author: 2026-04-12 / Hermes.

- Decision: Exclude `__tests__` and `*.test.tsx` files from `packages/ui/tsconfig.json` so the package-level library typecheck stays focused on shipped source files, while Vitest remains the validation path for table tests.
  Rationale: `pnpm -F @amber/ui tsc` is the library package’s source validation command. The new tests rely on Vitest globals and jest-dom matchers, which are already validated by `pnpm test` rather than by the package’s library tsconfig.
  Date/Author: 2026-04-12 / Hermes.

## Outcomes & Retrospective

The shared table system is now decomposed into smaller modules without changing the public API of `Table.tsx`, `DataTable.tsx`, or `index.tsx`. The body renderer now has dedicated files for visible-row derivation, virtualization, editable-cell navigation, base-row rendering, and expanded-row rendering. The editing system now has separate modules for caller-facing internal types, validation normalization, edit-map construction, active-cell bookkeeping, and pending-new-row wiring. Expansion scroll preservation no longer relies on a DOM `data-testid` selector and instead uses an explicit scroll-container context owned by the table renderer.

The focused behavior tests added by this plan are passing, along with `pnpm -F @amber/ui tsc` and `pnpm lint`. The only validation gap is repository-wide `pnpm tsgo`, which still fails in pre-existing `packages/amber` code outside this refactor. The main lesson from implementation was that keeping one clear owner for derived visible rows simplified several concerns at once: empty-state handling, keyboard navigation, virtualization, and expanded-only filtering now all follow the same source of truth.

## Context and Orientation

All relevant code for this cleanup lives under `packages/ui/components/Table`. The entry point exported to consumers is `packages/ui/components/Table/index.tsx`, which currently re-exports `DataTable`, `Table`, table actions, constants, utility helpers, filters, and editing types.

There are two top-level React components to understand. `packages/ui/components/Table/Table.tsx` is the convenience wrapper that most callers likely use. It accepts raw data and column definitions, injects default actions, manages persisted table state through `packages/ui/components/Table/useTableState.ts`, adds the expansion control column when `renderExpandedContent` is present, manages pending add-row state for editable tables, and creates the TanStack table instance through `packages/ui/components/Table/useTable.tsx`. `packages/ui/components/Table/DataTable.tsx` is the lower-level renderer that takes a prepared TanStack table instance and renders the sticky heading area, filter bar, toolbar, optional “Show Expanded” switch, sticky header, body, and footer.

The TanStack table instance is created in `packages/ui/components/Table/useTable.tsx`. TanStack Table is the third-party state and row-model library used here. In plain language, it owns derived table behavior such as sorting, filtering, grouping, pagination, row expansion, and selection. This hook also injects the selection column and default column metadata.

The main overloaded file is `packages/ui/components/Table/TableContent.tsx`. It currently contains cell rendering, row rendering, hover-action state, editing click behavior, keyboard navigation between editable cells, expanded-row rendering, virtual-row setup through `@tanstack/react-virtual`, warnings about suspicious pagination configuration, and cleanup when active edited rows disappear. This is the central decomposition target.

Inline editing lives in `packages/ui/components/Table/editing/useTableEditing.ts`. This hook exposes `TableEditingState<TData>`, which is consumed directly by `DataTable.tsx` and `TableContent.tsx`. It currently handles active-cell tracking, edit buffering, cell and row validation, save and discard logic, add-row branching during save, and derived state such as `hasChanges`, `hasErrors`, and `editedRowCount`. The editing configuration types are defined in `packages/ui/components/Table/editing/types.ts`.

Expansion support is split across several files. `packages/ui/components/Table/Table.tsx` conditionally prepends the `_expander` column defined by constants in `packages/ui/components/Table/constants.ts`. `packages/ui/components/Table/components/RowExpansionButton.tsx` toggles row expansion. `packages/ui/components/Table/TableContent.tsx` renders the extra expanded-content row and also disables virtualization when expanded content is present. `packages/ui/components/Table/DataTable.tsx` and `TableContent.tsx` both derive filtered row lists for the `showExpandedOnly` feature.

Sticky container structure is provided by `packages/ui/components/Table/components/TableStyles.tsx`, `packages/ui/components/Table/TableHeader.tsx`, and `packages/ui/components/Table/TableFooter.tsx`. These files are not the main decomposition target, but they define important constraints: the table is rendered as flex-based `div` roles rather than native table layout, the header and footer are sticky, and row and body sizing interact with virtualization.

The refactor should preserve these external contracts unless the plan explicitly says otherwise.

- `packages/ui/components/Table/Table.tsx` remains the convenience wrapper for raw data plus columns.
- `packages/ui/components/Table/DataTable.tsx` remains the renderer for a provided table instance.
- `packages/ui/components/Table/index.tsx` continues to export the same public surface unless a later, separate migration plan says otherwise.
- `packages/ui/components/Table/editing/types.ts` remains the home of caller-facing editing configuration types.
- `packages/ui/components/Table/editing/useTableEditing.ts` may become a thin compatibility wrapper around smaller helpers, but callers inside this package should still be able to consume `TableEditingState<TData>`.

## Milestones

### Milestone 1: Freeze current behavior with focused tests and explicit ownership boundaries

At the end of this milestone, the repository will still render the same table behavior, but there will be focused tests that describe the expected editing, expansion, and virtualization interactions. A novice should be able to run the new tests and see that expanded rows disable virtualization, editable cells save and discard correctly, and `showExpandedOnly` affects the visible row set in exactly one way. This milestone reduces the risk of the later code move.

The work in this milestone is to add tests near `packages/ui/components/Table` and to write small pure helpers for row derivation where that helper can be introduced without changing behavior. The acceptance is that the tests fail if the current behavior changes accidentally.

### Milestone 2: Split body rendering and row derivation out of `TableContent.tsx`

At the end of this milestone, `packages/ui/components/Table/TableContent.tsx` will be an orchestration shell rather than a monolith. Row derivation, virtual-row setup, row hover state, editable-cell navigation, and expanded-row rendering will each have a focused module. A novice should be able to open a file and understand one job at a time, such as “derive visible rows” or “render one row.”

The work in this milestone is to create small files under `packages/ui/components/Table/content` or a similarly named subdirectory and move code out of `TableContent.tsx` in behavior-preserving steps. The acceptance is unchanged tests from Milestone 1, plus typecheck success.

### Milestone 3: Split editing state transitions out of `useTableEditing.ts`

At the end of this milestone, editing logic will no longer be one large hook with all state transitions embedded in a single file. The active-cell state machine, row-change building, full-validation pass, and save and discard flow will be isolated into helpers or focused hooks. `useTableEditing.ts` will remain as the package-level compatibility entry point that assembles those helpers into the existing `TableEditingState<TData>` interface.

The work in this milestone is to move pure logic first, then simplify the top-level hook. The acceptance is that editing tests prove no change in save, discard, validation, and add-row branching behavior.

### Milestone 4: Reduce `Table.tsx` and `DataTable.tsx` to stable orchestration shells

At the end of this milestone, `Table.tsx` will own wrapper concerns only, and `DataTable.tsx` will own layout concerns only. Expansion-column injection, pending new-row wiring, persisted-state wiring, visible-row derivation, and sticky layout orchestration will each be in clearly named helpers. A novice should no longer need to read both large components to understand one feature.

The work in this milestone is to extract narrowly named helpers and make prop flow explicit. The acceptance is that all tests still pass and the public API remains stable.

## Plan of Work

Begin by creating a focused test seam around current behavior. Add tests next to the table package, using React Testing Library and Vitest already present in the root toolchain. The first tests should target behavior that is easy to break during decomposition and hard to infer later: editing a cell and committing it, discarding active and saved edits, showing validation errors, filtering to expanded rows only, and preserving the current no-virtualization rule when expanded content is enabled. If a test requires building a small fixture table, keep that fixture local to the test file so that the tests read like executable examples.

Once tests exist, decompose `packages/ui/components/Table/TableContent.tsx`. Create a small derived-rows helper, for example `packages/ui/components/Table/content/useVisibleTableRows.ts`, whose only job is to return the row list and pagination padding inputs used by the body. This helper should own the `showExpandedOnly` rule so that `DataTable.tsx` stops deriving displayed rows separately. Then create a virtualization helper, for example `packages/ui/components/Table/content/useTableRowVirtualization.ts`, that accepts the visible rows, compact mode, and container ref and returns the virtualizer plus flags such as `enableVirtualRows`. This isolates the current “expanded content disables virtualization” rule into one place with a documented reason. Next, extract row-level rendering into one or more small components such as `packages/ui/components/Table/content/TableBodyRow.tsx` and `packages/ui/components/Table/content/TableExpandedRow.tsx`. Move keyboard navigation into a focused helper such as `packages/ui/components/Table/content/useEditableCellNavigation.ts`. Keep `TableContent.tsx` as the assembly file that wires these pieces together.

After the body is decomposed, split `packages/ui/components/Table/editing/useTableEditing.ts`. Start with pure functions that do not need React state: normalizing validation results, coercing input values, applying row changes, building the next edits map, and validating all edits. These can move into files such as `packages/ui/components/Table/editing/editingState.ts` and `packages/ui/components/Table/editing/editingValidation.ts`. Then move active-cell bookkeeping and navigation-sensitive behavior into a helper such as `packages/ui/components/Table/editing/useActiveTableCell.ts`. Keep the public return shape `TableEditingState<TData>` unchanged so that `DataTable.tsx` and `TableContent.tsx` do not need a large migration. If helpful, define small internal types in `packages/ui/components/Table/editing/internalTypes.ts`, but do not move caller-facing config types out of `packages/ui/components/Table/editing/types.ts`.

Finally, simplify the top-level shells. In `packages/ui/components/Table/Table.tsx`, extract expansion-column injection into a helper such as `packages/ui/components/Table/expansion/buildExpansionColumn.tsx`, extract pending add-row wiring into a helper such as `packages/ui/components/Table/editing/usePendingNewRow.ts`, and extract action assembly into a helper such as `packages/ui/components/Table/actions/buildDefaultTableActions.tsx`. In `packages/ui/components/Table/DataTable.tsx`, remove duplicated row derivation and keep it focused on sticky layout, heading, toolbar, and footer composition. Replace the DOM lookup contract in `packages/ui/components/Table/components/RowExpansionButton.tsx` with an explicit ref or callback passed from the body or container layer so that expansion scroll preservation is a real interface rather than a hidden selector dependency.

## Concrete Steps

All commands below are run from the repository root.

    cd /Users/ggp/dev/git/amber

Before changing code, confirm the package still typechecks in its current state.

    pnpm -F @amber/ui tsc

Expected success signal:

    > @amber/ui tsc
    ... no TypeScript errors ...

Add focused tests for the current table behavior. If no table test directory exists yet, create one such as:

    packages/ui/components/Table/__tests__/tableEditing.test.tsx
    packages/ui/components/Table/__tests__/tableExpansion.test.tsx
    packages/ui/components/Table/__tests__/tableContentVirtualization.test.tsx

Run only the new tests while iterating.

    pnpm test -- --run packages/ui/components/Table/__tests__/tableEditing.test.tsx packages/ui/components/Table/__tests__/tableExpansion.test.tsx packages/ui/components/Table/__tests__/tableContentVirtualization.test.tsx

Expected success signal after the tests are implemented:

    RUN  v...
    ✓ packages/ui/components/Table/__tests__/tableEditing.test.tsx
    ✓ packages/ui/components/Table/__tests__/tableExpansion.test.tsx
    ✓ packages/ui/components/Table/__tests__/tableContentVirtualization.test.tsx

Create the new focused modules and move code in small steps. After each extraction, rerun the same targeted tests and then rerun the package typecheck.

    pnpm test -- --run packages/ui/components/Table/__tests__/tableEditing.test.tsx packages/ui/components/Table/__tests__/tableExpansion.test.tsx packages/ui/components/Table/__tests__/tableContentVirtualization.test.tsx
    pnpm -F @amber/ui tsc

When the decomposition is complete, run a broader validation sweep from the repository root.

    pnpm -F @amber/ui tsc
    pnpm test -- --run packages/ui/components/Table/**
    pnpm tsgo
    pnpm lint

If the repository has no glob-friendly table tests at that point, run the explicit file list instead.

During implementation, update this ExecPlan at every stopping point. In particular, append concrete entries to `Progress`, record every behavior discovery in `Surprises & Discoveries`, and add a note at the bottom of the file describing what changed in the plan and why.

## Validation and Acceptance

The change is acceptable only if a human can verify that the table still behaves the same while the implementation becomes easier to navigate.

Type-level acceptance is that `pnpm -F @amber/ui tsc`, `pnpm tsgo`, and `pnpm lint` succeed with no new TypeScript or lint errors.

Behavioral acceptance is that focused tests prove the following observable outcomes.

Editing acceptance: a test mounts a small `DataTable` or `Table` with `cellEditing.enabled: true`, edits one editable cell, commits the edit, and observes the edited value being displayed. A save action calls the configured `onSave` with one row update whose `original`, `updated`, and `changes` values match the edit. A discard action clears the pending edit and removes the unsaved-change footer message.

Validation acceptance: a test configures `validateCell` or `validateRow`, enters an invalid value, and observes the error state exposed in the UI, such as disabled save and the “Fix validation errors before saving.” message from `packages/ui/components/Table/DataTable.tsx`.

Expansion acceptance: a test mounts a table with `renderExpandedContent`, expands a row through `packages/ui/components/Table/components/RowExpansionButton.tsx`, and observes the extra expanded-content row rendered below the base row. A second assertion toggles “Show Expanded” and observes that only expanded rows remain visible.

Virtualization acceptance: a test mounts more than 20 rows without expanded content and verifies that row virtualization is enabled through the rendered structure or through the virtual-row count assumptions encoded in the body helper tests. A paired test mounts expanded content and verifies that the body uses the non-virtual path even when `useVirtualRows` is true.

Wrapper acceptance: a test or integration fixture mounts `packages/ui/components/Table/Table.tsx` with row selection, expansion content, and editing enabled together, then verifies that default behavior still works and that no caller-facing props changed.

Maintainability acceptance: the final file structure must make it obvious where to edit each concern. A novice should be able to answer the following by opening one or two files, not six: where visible rows are derived, where virtualization is decided, where expanded rows are rendered, where active edited cell state lives, and where the wrapper injects expansion and selection columns.

## Idempotence and Recovery

This refactor should be done in additive, reversible steps. Each extraction should leave the old behavior intact and should be validated immediately with tests and typecheck. If a move breaks behavior, revert only the last extraction and keep the new tests. The tests are the recovery anchor.

Creating helper files is idempotent because rerunning the steps simply updates those files in place. Moving pure helper logic out of `useTableEditing.ts` and `TableContent.tsx` is safe to repeat as long as imports are kept consistent and the compatibility wrapper functions remain in place.

Do not remove or rename the public exports in `packages/ui/components/Table/index.tsx` during this plan. That preserves a safe rollback boundary. If a proposed helper name turns out to be poor, rename it before other files begin depending on it broadly.

If a step fails halfway through and the table no longer renders, restore a passing state by temporarily re-exporting or re-wrapping the previous implementation from the old file path, then resume extraction in smaller pieces.

## Artifacts and Notes

Important current implementation snippets to preserve or explicitly replace:

Expanded content currently disables virtualization in the body.

    const hasExpandedContent = !!renderExpandedContent
    const enableVirtualRows = rows.length > 20 && useVirtualRows && !hasExpandedContent

Expanded-only filtering is duplicated today and should end with one owner.

    // packages/ui/components/Table/DataTable.tsx
    const displayedRows = useMemo(
      () => (showExpandedOnly ? allRows.filter((row) => row.getIsExpanded()) : allRows),
      [allRows, showExpandedOnly],
    )

    // packages/ui/components/Table/TableContent.tsx
    const rows = useMemo(
      () => (showExpandedOnly ? allRows.filter((row) => row.getIsExpanded()) : allRows),
      [allRows, showExpandedOnly],
    )

Expansion scroll preservation currently depends on a DOM selector that should become an explicit interface.

    const container = (event.currentTarget as HTMLElement)
      .closest<HTMLElement>('[data-testid="TableContainerSortOf"]')

The editing hook currently owns all of these jobs in one file and should be split while preserving `TableEditingState<TData>`:

- active-cell tracking
- edit map construction
- cell and row validation
- save and discard flow
- add-row branching during save
- derived booleans such as `hasChanges` and `hasErrors`

## Interfaces and Dependencies

Use the existing dependencies already present in the repo:

- `@tanstack/react-table` for row, cell, column, and table instance types.
- `@tanstack/react-virtual` for row virtualization.
- `@mui/material` and existing custom table style wrappers for rendering.
- `vitest` and `@testing-library/react` for tests.

Preserve these public interfaces:

- `packages/ui/components/Table/Table.tsx` continues exporting `Table`.
- `packages/ui/components/Table/DataTable.tsx` continues exporting `DataTable`.
- `packages/ui/components/Table/index.tsx` continues exporting the same public surface unless a separate migration plan is created.
- `packages/ui/components/Table/editing/types.ts` remains the source of caller-facing editing configuration types.
- `packages/ui/components/Table/editing/useTableEditing.ts` continues exporting `TableEditingState<TData>` and the same externally consumed editing API.

Introduce internal interfaces with narrow ownership. The exact filenames may change slightly, but the responsibilities must exist.

In `packages/ui/components/Table/content/useVisibleTableRows.ts`, define a helper that accepts the table instance and `showExpandedOnly` flag and returns the visible row list used by the body. This helper must be the only owner of that derivation.

In `packages/ui/components/Table/content/useTableRowVirtualization.ts`, define a helper that accepts visible rows, compact mode, `useVirtualRows`, `hasExpandedContent`, and the container ref, then returns the virtualizer state needed by the body renderer.

## Plan Update Notes

At implementation time, this plan was updated to record the concrete helper filenames that were actually introduced under `packages/ui/components/Table/content`, `packages/ui/components/Table/editing`, and `packages/ui/components/Table/expansion`, because the work moved from design intent to checked-in code. The validation notes were also updated to record that repository-wide `pnpm tsgo` is currently blocked by unrelated `packages/amber` type errors, while the table-specific validations requested by this plan now pass.

In `packages/ui/components/Table/content/useEditableCellNavigation.ts`, define a helper that accepts the table instance, editing state, and visible rows and returns navigation behavior that only visits editable user cells.

In `packages/ui/components/Table/content/TableBodyRow.tsx`, define a focused row renderer that receives the already-derived row, editing state, and row-action props. It must not derive global row lists or own virtualization setup.

In `packages/ui/components/Table/content/TableExpandedRow.tsx`, define a focused expanded-content renderer that receives the base row, `expandedContentSx`, and `displayGutter`. It must not decide whether a row is expanded; it only renders when asked.

In `packages/ui/components/Table/editing/editingState.ts`, define pure helpers for normalizing validation results, coercing input values, applying row changes, and building the next edits map.

In `packages/ui/components/Table/editing/editingValidation.ts`, define pure helpers for validating the current edits map and returning the next edit state plus error information.

In `packages/ui/components/Table/expansion/buildExpansionColumn.tsx`, define a helper that returns the `_expander` column definition now assembled inline in `Table.tsx`.

If scroll preservation is kept, expose it through an explicit interface, for example a `containerRef` prop or a callback owned by `DataTable.tsx` or `TableContent.tsx`. Do not keep `RowExpansionButton.tsx` coupled to `data-testid='TableContainerSortOf'` as a runtime dependency.

Plan update note: Initial draft created after direct repository inspection so a future implementer can start from this file alone. The plan chooses API preservation and test-first extraction to reduce risk in a heavily shared UI component.
