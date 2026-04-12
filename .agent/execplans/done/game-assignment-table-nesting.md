# Add Nested Row Support and Row Creation to @amber/ui Table

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This plan must be maintained in accordance with `.agent/PLANS.md` from the repository root.

## Purpose / Big Picture

After this change, the `@amber/ui` Table component can expand rows to render nested, tabular content and can add new rows through the existing cell-editing workflow. This enables the Game Assignment dashboard to show per-row nested tables (members per game, slots per member, etc.) and to add assignments from within those nested tables. A ui-test view and Playwright coverage will demonstrate the new expansion and add-row behavior.

## Progress

- [x] (2026-01-21 18:19Z) Drafted the ExecPlan with expansion and add-row editing requirements.
- [x] (2026-01-21 19:36Z) Added row expansion props to Table/DataTable and rendered expanded content rows.
- [x] (2026-01-21 19:36Z) Extended table editing for draft row creation and the `autocomplete` editor type.
- [x] (2026-01-21 19:36Z) Added a ui-test view demonstrating nested tables with row creation and autocomplete editing.
- [x] (2026-01-21 19:36Z) Added Playwright coverage in ui-test for expansion, editing, and row addition.
- [x] (2026-01-21 20:09Z) Ran `pnpm tsgo`, `pnpm lint`, `pnpm test`, and `pnpm -F ui-test test:e2e`.

## Surprises & Discoveries

- Observation: Playwright warmup logs may show PGlite timing warnings even when tests pass.
  Evidence: `apps/ui-test/playwright/fixtures.ts` logs during local run.

## Decision Log

- Decision: Provide a `renderExpandedContent` prop on `DataTable`/`Table` instead of hard-coding a nested table layout.
  Rationale: The dashboard needs multiple nested table layouts; a render prop keeps the Table generic and reusable.
  Date/Author: 2026-01-21 / Codex.

- Decision: Default to disabling virtualization when row expansion is enabled.
  Rationale: Virtual row height measurement becomes complex with variable expanded content; disabling virtualization avoids layout bugs for nested tables.
  Date/Author: 2026-01-21 / Codex.

- Decision: Add an `autocomplete` editor type to `TableCellEditor` rather than building bespoke member selectors in each table.
  Rationale: The dashboard needs autocomplete member selection in multiple nested tables; a standardized editor reduces duplication.
  Date/Author: 2026-01-21 / Codex.

## Outcomes & Retrospective

- Delivered nested row expansion, add-row editing, and autocomplete editing in `@amber/ui` Table.
- Added ui-test coverage and Playwright spec for nested row editing/creation.
- Verified with `pnpm tsgo`, `pnpm lint`, `pnpm test`, and `pnpm -F ui-test test:e2e`.

## Context and Orientation

The Table component is defined in `packages/ui/components/Table`. It uses TanStack Table v8 with a `useTable` wrapper, `DataTable` for rendering, and `TableContent` for row virtualization and cell editing. A cell-editing system already exists in `packages/ui/components/Table/editing`, with column-level meta definitions in `packages/ui/types/tanstack-table.d.ts`. Row expansion is supported at the TanStack data-model level (`getExpandedRowModel` in `useTable.tsx`) but no UI exists for rendering expanded rows or toggling expansion.

## Plan of Work

Add a new `renderExpandedContent` prop to `DataTable` and `Table` that accepts `(row: Row<TData>) => ReactNode`, and a matching `getRowCanExpand` callback for enabling expansion per row. When provided, render a new expansion toggle column (icon button) and insert an expanded content row immediately after the main row when `row.getIsExpanded()` is true. The expanded row should stretch the full table width and respect `displayGutter` spacing.

Extend the table editing system to support a draft new row. Provide an `addRowConfig` in `DataTableEditingConfig` that includes `createRow`, `onAddRow`, and `isNewRow` helpers. The Table wrapper should manage a `pendingNewRow` state and append it to the data passed into `useTable` while editing is active. Once required fields are committed, call `onAddRow` and remove the draft row so the parent data can replace it with persisted data.

Add an `autocomplete` editor type in `TableCellEditor` that renders a MUI `Autocomplete` with per-row options. Extend `TableEditColumnConfig` to include `getAutocompleteOptions`, `getOptionLabel`, and `isOptionEqual` so the editor can be reused for member assignment selection. Ensure the autocomplete editor commits on selection and supports Escape to cancel.

Create a new ui-test view that demonstrates a parent table with expandable rows, nested tables, and add-row behavior. Use mock data with at least two parent rows and nested rows with different shapes. Add a Playwright test that expands a row, edits a nested cell, adds a new nested row via autocomplete, and verifies the new row is persisted in the view state.

## Concrete Steps

1. Update `packages/ui/components/Table/DataTable.tsx` to accept `renderExpandedContent` and `getRowCanExpand` props, and to pass these to `TableContent`.
2. Update `packages/ui/components/Table/TableContent.tsx` to render an expanded-content row after each data row when `row.getIsExpanded()` is true. Add an expand/collapse button column using a new component in `packages/ui/components/Table/components`.
3. Update `packages/ui/components/Table/Table.tsx` to expose the new expansion props and, when expansion is enabled, default `useVirtualRows` to false unless explicitly overridden.
4. Update `packages/ui/components/Table/editing/types.ts` to add `autocomplete` editor metadata and a new-row config in `DataTableEditingConfig`.
5. Update `packages/ui/components/Table/editing/TableCellEditor.tsx` to render the autocomplete editor and commit on selection.
6. Update `packages/ui/types/tanstack-table.d.ts` and `apps/*/types/tanstack-table.d.ts` to include the new editor metadata types.
7. Add a new ui-test view under `apps/ui-test/src/Views` and a route entry, then extend `apps/ui-test/playwright/table-snapshots.spec.ts` with the new assertions.

## Validation and Acceptance

Acceptance is met when:

- A Table can expand rows via the new `renderExpandedContent` prop, and expanded content renders directly under the parent row.
- An expandable table can add a new nested row using the add-row editing workflow without throwing type or runtime errors.
- The autocomplete editor works inside a cell, supports keyboard selection, and commits the value on selection or blur.
- The ui-test Playwright spec demonstrates expansion, editing, and row addition.

Run from the repo root:

- `pnpm tsgo`
- `pnpm lint`
- `pnpm test`
- `pnpm -F ui-test playwright test`

## Idempotence and Recovery

These changes are additive and can be reapplied safely. If expansion rendering causes layout issues, temporarily disable virtualization via `useVirtualRows={false}` on the affected tables while adjusting styles. If autocomplete editing fails, fall back to the existing select editor and record the issue in `Surprises & Discoveries` before proceeding.

## Artifacts and Notes

Include a short snippet of the expanded row markup in this plan after implementation to show how the expanded content row is inserted and styled. Keep it small and focused on the row structure.

Expanded row snippet:

```tsx
{
  expandedContent ? (
    <TableRow key={`${row.id}-expanded`} pageElevation={pageElevation} sx={{ display: 'flex', width: '100%' }}>
      <TableCell
        sx={[
          { flex: '1 1 auto', width: '100%', borderRight: 'none' },
          ...(Array.isArray(expandedContentSx) ? expandedContentSx : [expandedContentSx]),
        ]}
      >
        {expandedContent}
      </TableCell>
    </TableRow>
  ) : null
}
```

## Interfaces and Dependencies

Add the following interfaces to `packages/ui/components/Table/editing/types.ts`:

type TableAutocompleteOption = {
label: string
value: string | number
}

type TableEditAutocompleteConfig<TData extends RowData> = {
options?: Array<TableAutocompleteOption>
getOptions?: (row: Row<TData>) => Array<TableAutocompleteOption>
getOptionLabel?: (option: TableAutocompleteOption) => string
isOptionEqual?: (option: TableAutocompleteOption, value: TableAutocompleteOption) => boolean
}

Extend `TableEditColumnConfig` with:

type TableEditColumnType = 'text' | 'number' | 'select' | 'autocomplete'

type TableEditColumnConfig<TData extends RowData> = {
...
autocomplete?: TableEditAutocompleteConfig<TData>
}

Extend `DataTableEditingConfig` with:

type DataTableAddRowConfig<TData extends RowData> = {
enabled: boolean
createRow: () => TData
onAddRow: (row: TData) => Promise<void> | void
isNewRow: (row: TData) => boolean
}

type DataTableEditingConfig<TData extends RowData> = {
enabled: boolean
...
addRow?: DataTableAddRowConfig<TData>
}

Add the expansion props to `DataTableProps` and `Table` props:

renderExpandedContent?: (row: Row<TData>) => ReactNode
getRowCanExpand?: (row: Row<TData>) => boolean

The expansion UI should use MUI icon buttons and leverage `row.getToggleExpandedHandler()` from TanStack Table. Use function expressions and `type` declarations for all new types.

Plan update note: Initial draft created for nested row support and add-row editing.
Plan update note: Marked expansion, editing, ui-test view, and Playwright coverage steps complete after implementing the nested table support.
Plan update note: Added a validation step to reflect pending test execution.
