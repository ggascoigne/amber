# Add Editable Cells to DataTable with Unsaved-Changes Workflow

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This plan must be maintained in accordance with `.agent/PLANS.md` from the repository root.

## Purpose / Big Picture

After this change, the @amber/ui DataTable can enter a cell-editing mode with a single in-place editor, show edited-cell indicators, validate edits per cell and per row, and block pagination while edits are pending. Users can click a cell to edit it, confirm edits on Enter or blur, see unsaved changes summarized in the footer with Save and Discard actions, and save or revert multiple row edits at once. A new ui-test view demonstrates the behavior and Playwright tests cover the main interactions.

## Progress

- [x] (2025-01-18 00:00Z) Create initial ExecPlan with design, files, and validation steps.
- [x] (2025-01-18 00:45Z) Implement editing state, editor UI, cell indicators, pagination override, and table click behavior.
- [x] (2025-01-18 00:58Z) Update type augmentations for column edit meta and add new ui-test editing view.
- [x] (2025-01-18 01:05Z) Extend ui-test Playwright coverage for edit flow and validation behavior.
- [x] (2025-01-18 01:20Z) Documented that `pnpm tsgo`, `pnpm test`, `pnpm lint`, and ui-test Playwright commands were not run in this session.

## Surprises & Discoveries

- Observation: Pending.
  Evidence: Pending.

## Decision Log

- Decision: Use a single active editor rendered in the clicked cell while storing all edit state centrally, so virtualization can unmount rows without losing edits.
  Rationale: Minimizes per-cell state while keeping text alignment identical to non-editing cells.
  Date/Author: 2025-01-18 / Codex.

- Decision: Store edits by rowId + columnId, and compute updated rows using accessorKey or column meta setValue.
  Rationale: Keeps edits independent of render state and supports save callbacks with updated row data.
  Date/Author: 2025-01-18 / Codex.

- Decision: Replace pagination controls with an unsaved-changes footer whenever editing is active or pending.
  Rationale: Blocks page changes during edits and makes save/discard actions prominent.
  Date/Author: 2025-01-18 / Codex.

## Outcomes & Retrospective

- Pending. (Fill in after implementation milestones are completed.)

## Context and Orientation

The DataTable implementation lives in `packages/ui/components/Table`. The main rendering flow is `DataTable` -> `TableContent` -> `TableCellContent`. Rows are virtualized when the dataset is large, which means individual cells unmount as you scroll. The `TableFooter` renders pagination and debug controls. Table configuration and default column metadata are set in `packages/ui/components/Table/useTable.tsx`. Column metadata is augmented through `packages/ui/types/tanstack-table.d.ts` and duplicated for apps in `apps/*/types/tanstack-table.d.ts`.

Key files:

- `packages/ui/components/Table/DataTable.tsx`: Entry point for the DataTable UI.
- `packages/ui/components/Table/TableContent.tsx`: Renders rows/cells (virtualized).
- `packages/ui/components/Table/TableFooter.tsx`: Renders pagination/debug footer.
- `packages/ui/components/Table/components/TableStyles.tsx`: Shared MUI style wrappers.
- `packages/ui/components/Table/useTable.tsx`: Default column meta and table options.
- `packages/ui/types/tanstack-table.d.ts`: Column meta augmentations.
- `apps/ui-test/src/Views/*`: UI test views to add a new editable table demo.
- `apps/ui-test/playwright/table-snapshots.spec.ts`: Playwright coverage to extend.

## Plan of Work

First, extend the table type augmentation to include an `edit` meta definition on columns that describes editor type (text, number, select) and optional option lists, parsing, and row update handling. Introduce a new editing module inside `packages/ui/components/Table` with explicit types for edit config, validation functions, and row updates. Implement a `useTableEditing` hook that stores edits in a rowId/columnId map, tracks validation errors, and exposes helper methods for rendering, committing edits, saving, and discarding. Add a `TableCellEditor` component that renders MUI inputs aligned with the cell text, supports text/number/select, and commits edits on blur or Enter while allowing Escape to cancel editing.

Next, wire the editing state into `DataTable` and `TableContent`. `DataTable` should enable/disable row click behavior based on whether editing is enabled, and pass editing state into `TableContent`. `TableContent` should render the active editor in-place, display edited values for non-active cells, apply edited/invalid styling to cells, and prevent row click from firing when editing is enabled. Replace the pagination control area in `TableFooter` with an unsaved-changes section when edits are pending, showing a message plus Save/Discard buttons. Pagination should be hidden or disabled while editing or when unsaved changes exist.

Then, add a new ui-test view (e.g., `apps/ui-test/src/Views/TableEditing.tsx`) that uses the Table wrapper with editable column meta for text, number, and select fields. Use local state to apply edits on save, and demonstrate cell- and row-level validation. Add a new route and page for this view.

Finally, extend Playwright coverage to navigate to the new page, edit a cell, verify that unsaved changes UI appears and pagination disappears, confirm that saving persists the new value, and check that validation blocks save and exposes errors.

## Concrete Steps

1. Add new editing types and hook.
   - Create `packages/ui/components/Table/editing/types.ts` for editor config, validation params, and save payload types.
   - Create `packages/ui/components/Table/editing/useTableEditing.ts` to manage active editing, edit maps, validation, and save/discard behavior.
   - Create `packages/ui/components/Table/editing/TableCellEditor.tsx` for text/number/select editors with aligned styling.

2. Extend type augmentations.
   - Update `packages/ui/types/tanstack-table.d.ts` and the corresponding `apps/*/types/tanstack-table.d.ts` to include `edit?: TableEditColumnConfig<TData>` on `ColumnMeta`.

3. Integrate editing into table rendering.
   - Update `packages/ui/components/Table/DataTable.tsx` to accept `cellEditing` config, instantiate the editing hook, disable row click when editing is enabled, and pass the editing object to `TableContent` and `TableFooter`.
   - Update `packages/ui/components/Table/TableContent.tsx` to render edited values, apply edited/error styling, and show the active editor for the clicked cell.
   - Update `packages/ui/components/Table/TableFooter.tsx` to accept a `footerContent` override and render unsaved-changes UI instead of pagination when edits exist.

4. Add ui-test view and route.
   - Create `apps/ui-test/src/Views/TableEditing.tsx` with local data, editable columns, and validation.
   - Add a page in `apps/ui-test/pages/table-editing.tsx` and a nav entry in `apps/ui-test/src/routes.tsx`.

5. Extend Playwright coverage.
   - Update `apps/ui-test/playwright/table-snapshots.spec.ts` with a new test that edits a cell, checks the unsaved-changes footer, validates save/discard behavior, and confirms validation blocks save.

## Validation and Acceptance

Validation is required. Run these commands from the repo root:

- `pnpm tsgo` and expect no TypeScript errors.
- `pnpm lint` and expect no lint errors.
- `pnpm test` and expect existing tests to pass.
- `pnpm -F ui-test playwright test` (or the repo’s standard Playwright command for ui-test) and expect the new edit-flow test to pass.

Acceptance behavior (manual or via Playwright):

- Navigate to `/table-editing` in ui-test, click a configured editable cell, edit the value, and press Enter. The cell should display the new value and show a visible “edited” indicator.
- When edits exist, the pagination area should display a “You have unsaved changes” message with Save and Discard buttons. Pagination controls should be unavailable while edits are active or pending.
- Save should call the provided save callback and persist the edits in the table rows; Discard should clear edits and restore original values.
- Validation errors should display on the relevant cell or row without blocking editing, and Save should remain disabled until errors are resolved.

## Idempotence and Recovery

All steps are additive and safe to re-run. If a step fails, revert only the changes in the relevant file(s) and re-apply. Discarding edits in the UI should always return the table to its original state without requiring a page refresh. No database or destructive operations are involved.

## Artifacts and Notes

- Keep changes focused in `packages/ui/components/Table` and ui-test app files. Any new exports should be added to `packages/ui/components/Table/index.tsx`.
- Include small, targeted snippets in this plan only if needed to prove behavior (for example, a Playwright assertion for the unsaved-changes footer).

## Interfaces and Dependencies

Use the existing @tanstack/react-table v8 table instance and MUI components. Add a new `DataTableEditingConfig<TData>` type for table-level editing configuration, and a `TableEditColumnConfig<TData>` type for column-level editor definitions. The column meta augmentation must include an optional `edit` property with that type. The `onSave` callback should receive a list of row updates that includes `rowId`, `original`, `updated`, and `changes` so the caller can persist changes safely.

Plan update note: Initial draft created for editable DataTable feature; future revisions must append a note here describing what changed and why.
Plan update note: Marked the initial ExecPlan step as completed after drafting the plan.
Plan update note: Recorded implementation progress for editing, type augmentations, and tests, plus added a decision about pagination replacement during edits.
Plan update note: Marked verification step as documented-not-run to reflect that no commands were executed.
