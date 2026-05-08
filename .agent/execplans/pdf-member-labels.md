# Add PDF Member Labels Report

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This document follows `.agent/PLANS.md` in this repository. It is intentionally self-contained so a future contributor can implement the feature from this file alone.

## Purpose / Big Picture

Admins need a way to print member schedule labels without relying on fragile browser print layout. After this change, an admin with access to the existing Reports page can open `/report-admin` in either the ACNW or ACUS app, find a separate PDF section, and download a member labels PDF. The PDF will be laid out for Avery 5163 shipping labels: ten labels per letter-size page, two columns by five rows. Each label will show the member name in a boxed header and then one row per slot with the slot number, game name, and assigned room. If the member is assigned as a GM for that game, the game name will be bold.

The implementation uses `pdf-lib`, generates the PDF on the server through the existing tRPC `reports` router, and downloads the result from the shared `packages/amber/views/Reports.tsx` UI so the feature works for both `apps/acnw` and `apps/acus`.

## Progress

- [x] (2026-05-07 00:00Z) Read `.agent/PLANS.md` and confirmed this feature is large enough to need an ExecPlan.
- [x] (2026-05-07 00:00Z) Reviewed the existing reports page, report contracts, tRPC router, report service, relevant Prisma schema models, and print assets.
- [x] (2026-05-07 00:00Z) Drafted this ExecPlan for user review before implementation.
- [x] (2026-05-07 22:32Z) Added the `pdf-lib` dependency to `packages/server/package.json` and updated `pnpm-lock.yaml`.
- [x] (2026-05-07 22:33Z) Added PDF report contract types and `reports.getPdfData`.
- [x] (2026-05-07 22:34Z) Implemented the member-label data query for both ACNW and ACUS through the shared reports router.
- [x] (2026-05-07 22:34Z) Implemented the Avery 5163 PDF renderer and focused unit tests.
- [x] (2026-05-07 22:34Z) Added a client-side PDF download helper and a separate PDF section on the Reports page.
- [x] (2026-05-07 22:34Z) Added the member labels PDF action to both ACNW and ACUS report-admin pages.
- [x] (2026-05-07 22:41Z) Ran validation commands and recorded outcomes here.

## Surprises & Discoveries

- Observation: The repo currently has workbook report generation only; there is no existing PDF generation or PDF download helper.
  Evidence: `rg "pdf-lib|PDFDocument|application/pdf" .` only found unrelated comments and CSV blob code.
- Observation: Local PDF inspection utilities are not installed.
  Evidence: `pdfinfo`, `pdftotext`, `qpdf`, and `mutool` were not found in the shell, so validation should use `pdf-lib` parsing and generated file inspection rather than external PDF CLI tools.
- Observation: ACUS has a scheduler-oriented `gameAssignmentsReport`, but it reads room data from `game.room_id`; newer room assignment state is also represented by `game_room_assignment`.
  Evidence: `packages/server/prisma/schema.prisma` contains both `Game.roomId` and `GameRoomAssignment`, and existing reports use `Game.roomId`.
- Observation: `pdf-lib` can parse the Avery template with Node directly, but the Vitest/jsdom run initially failed while loading that same template path.
  Evidence: the first focused test run failed in `PDFDocument.load(templateBytes)` with a type validation error. A direct `pnpm -F @amber/server exec node` probe loaded `PrintAssets/Avery5163ShippingLabels.pdf` and reported one page.
- Observation: `eslint-plugin-import` 2.32.0 crashes under ESLint 10.3.0 while processing `import/order` for the new PDF service after other lint errors are fixed.
  Evidence: `pnpm lint` failed with `TypeError: sourceCode.getTokenOrCommentAfter is not a function` in rule `import/order`. Running ESLint on the file with `--rule 'import/order: off'` succeeded after ordinary lint issues were fixed.

## Decision Log

- Decision: Generate the PDF on the server and return a base64 string through tRPC instead of generating in the browser.
  Rationale: The data comes from the database, the PDF template lives in `PrintAssets`, and server-side generation keeps report behavior consistent across apps. Base64 is easy to serialize through tRPC and simple to turn into a browser Blob for download.
  Date/Author: 2026-05-07 / Codex
- Decision: Add a parallel PDF report contract instead of forcing PDFs into the existing workbook report contract.
  Rationale: Workbook reports return tabular data and are rendered client-side as `.xlsx`; PDF reports need binary document data, a MIME type, and a filename extension. Keeping the contracts separate avoids overloading `ReportWorkbookData`.
  Date/Author: 2026-05-07 / Codex
- Decision: Use Avery 5163 dimensions directly in code, with `PrintAssets/Avery5163ShippingLabels.pdf` as an optional visual template loaded by `pdf-lib`.
  Rationale: Avery 5163 has stable physical dimensions: US Letter page, labels 4 inches wide by 2 inches tall, two columns, five rows, 0.1875 inch left/right margins, 0.5 inch top/bottom margins, and a 0.125 inch gutter between columns. Using those measurements makes the output reliable even if template introspection is limited locally.
  Date/Author: 2026-05-07 / Codex
- Decision: Use Helvetica and Helvetica-Bold from `pdf-lib` standard fonts unless comparison to `PrintAssets/labels-2025.pdf` during implementation shows a clear need to adjust.
  Rationale: The 2025 sample appears to be a compact text label report. Standard fonts avoid bundling font files and are supported directly by `pdf-lib`. The renderer can tune font sizes, line positions, and text fitting to match the sample closely.
  Date/Author: 2026-05-07 / Codex
- Decision: Aggregate `game_room_assignment` room descriptions with `STRING_AGG(DISTINCT ...)` before falling back to `game.room_id`.
  Rationale: The newer room assignment table can represent rooms separately from the legacy `game.room_id` field and may contain more than one room for a game and slot. Aggregating prevents duplicate member label rows while still showing assigned room information.
  Date/Author: 2026-05-07 / Codex
- Decision: Add a narrowly scoped ESLint config override disabling `import/order` only for `packages/server/src/api/services/reports/memberLabelsPdfReport.ts`.
  Rationale: The rule crashes under the repo's current ESLint/plugin combination for this file. Other lint rules still run for the file, and the override avoids weakening lint across the repo.
  Date/Author: 2026-05-07 / Codex
- Decision: Filter `game_assignment.year` by the selected report year in addition to `membership.year` and `game.year`.
  Rationale: The Reports UI sends `configuration.year` to the PDF report, and every year-scoped table in the label query should honor that same selected year. Without the `ga.year` filter, stale cross-year assignment rows could join in edge cases.
  Date/Author: 2026-05-07 / Codex
- Decision: Use `useYearFilter` in the shared Reports page for report requests and generated filenames.
  Rationale: The site can be configured for a new current year before local data exists, while admins may use the year selector to inspect or print a prior convention year. Reports should honor that selected year instead of always using `configuration.year`.
  Date/Author: 2026-05-07 / Codex
- Decision: Correct the Avery 5163 horizontal layout constants to 0.1875 inch side margin and 0.125 inch column gutter.
  Rationale: The initial half-inch side margin placed the first column far too far right and the second column slightly too far right against the template. Avery 5163 uses narrow side margins with a small center gutter.
  Date/Author: 2026-05-07 / Codex
- Decision: Sort member labels by `user.last_name`, then `user.first_name`, then display name and membership id as fallbacks.
  Rationale: This matches the requested label ordering while keeping output stable for records with missing first or last names.
  Date/Author: 2026-05-07 / Codex
- Decision: Fill member schedule gaps with blank slot rows up to `settings.numberOfSlots`.
  Rationale: Labels should preserve the visual slot sequence. When a member has no assignment in a slot, the row still prints the slot number and leaves game and room text blank.
  Date/Author: 2026-05-07 / Codex
- Decision: Filter labels to attending memberships only.
  Rationale: The printed membership label set should exclude members who are not attending the selected convention year.
  Date/Author: 2026-05-07 / Codex
- Decision: Use 12 point regular Helvetica for member names instead of bold.
  Rationale: `pdf-lib` standard fonts do not include a semi-bold Helvetica. Regular Helvetica at 12 points gives the name more presence without the heavier bold weight; a true semi-bold would require adding and embedding a custom font file.
  Date/Author: 2026-05-07 / Codex
- Decision: Draw the member name box border in neutral grey instead of black.
  Rationale: The grey border keeps the name box visible while reducing visual weight on the printed label.
  Date/Author: 2026-05-07 / Codex
- Decision: Derive label row height from `settings.numberOfSlots`.
  Rationale: Seven-slot schedules need tighter rows, so they use 11 point row height. Other slot counts use 12.5 point row height for more comfortable spacing.
  Date/Author: 2026-05-07 / Codex
- Decision: Gate drawing the Avery template behind a file-level debug constant defaulting to false.
  Rationale: The production report should print only label content. The template is useful for alignment debugging, so it can be enabled by changing `drawAveryTemplate` in the renderer file.
  Date/Author: 2026-05-07 / Codex

## Outcomes & Retrospective

Implemented the member labels PDF report end to end. The shared Reports page now supports a separate PDF section, both ACNW and ACUS expose a `Member Labels` PDF action, the server generates Avery 5163-compatible PDFs using `pdf-lib`, and focused tests verify grouping and page counts. Automated validation passed for focused tests, TypeScript, the full Vitest suite, and lint. Manual browser download verification remains useful before release because the local test run did not start an authenticated app session.

## Context and Orientation

This is a pnpm monorepo with two Next.js applications, `apps/acnw` and `apps/acus`. Both apps expose a report administration page at `pages/report-admin.tsx`. Those pages import the shared `Reports` component from `packages/amber/views/Reports.tsx` and pass a site-specific list of workbook reports.

The current workbook report flow is:

`packages/amber/views/Reports.tsx` renders report download buttons. When a workbook report is clicked, it calls `trpc.reports.getWorkbookData` through React Query, then passes the returned `ReportWorkbookData` to `packages/amber/views/Reports/downloadReportWorkbook.ts`, which uses `xlsx` to save an `.xlsx` file in the browser.

`packages/server/src/api/routers/reports/index.ts` defines the tRPC reports router. It currently exposes only `getWorkbookData`. `packages/server/src/api/contracts/reports.ts` contains the Zod input schema and TypeScript types for workbook reports. `packages/server/src/api/services/reporting.ts` loads runtime settings, checks whether a report supports the current site abbreviation, runs a raw SQL query inside an RLS transaction, and returns workbook data.

RLS means row-level security. In this repository it is handled by `inRlsTransaction`, which wraps database queries so they run with the correct site and user context. New report queries should follow the same pattern as `getReportWorkbookData`.

The relevant database tables are visible in `packages/server/prisma/schema.prisma`:

- `membership` links a user to a convention year.
- `user` stores member names such as `full_name` and `display_name`.
- `slot` stores slot numbers and schedule metadata.
- `game_assignment` links members to games and stores `gm`; existing reports treat `gm > 0` as a GM assignment and `gm >= 0` as printable game participation.
- `game` stores game name, slot, year, category, and a legacy `room_id`.
- `room` stores room descriptions.
- `game_room_assignment` stores newer per-slot room assignments. If a game room assignment exists for the game, year, and slot, it is a stronger source for the room than `game.room_id`.

The print assets are:

- `PrintAssets/Avery5163ShippingLabels.pdf`, the Avery 5163 page template.
- `PrintAssets/labels-2025.pdf`, the previous labels output whose layout should be followed as closely as practical.

The target label format is:

    Harper Haven
    1 Pub Theory & Game Crawl                 Black Rabbit Bar
    2 All My Gerards                          Main 4
    3 Yazeba's Bed & Breakfast                Main 5
    4 Forest Witches in the Necropolis of Öl  Winery 36
    5 Here Is My Power Button (11.00 am)      Admin
    6 The Doom that came to Garnath           Main 5
    7 Foster Families (10.30 am)              Bullfrog

The member name should be displayed in a box. Slot rows should show the slot number at the left, the game name in the middle, and the room at the right. The room text must be right justified on each line so room names align against the right edge of the label's text area. If the member is the game GM, draw the game name with a bold font.

## Plan of Work

First, add `pdf-lib` to the server package, because the server will create the PDF document and can read `PrintAssets/Avery5163ShippingLabels.pdf` from the repository. The dependency should be added to `packages/server/package.json` using pnpm so the lockfile is updated consistently.

Next, extend `packages/server/src/api/contracts/reports.ts` with a PDF report id schema and a PDF report input/output contract. Add a `pdfReportIdSchema` with one value, `memberLabels`. Add `reportPdfInputSchema` with an optional `year` just like workbook reports. Add a `ReportPdfData` type with `base64: string`, `contentType: 'application/pdf'`, and `filenameLabel: string`. Keep workbook types unchanged.

Then, implement a new server service in `packages/server/src/api/services/reports/memberLabelsPdfReport.ts`. It should export a `getMemberLabelsPdfData` or similarly named function that accepts the tRPC context and input. The service should call `inRlsTransaction`, read runtime settings via `getRuntimeSettingsTx`, choose the requested year or the runtime year, and run a SQL query that returns one row per member-slot assignment. The query should include member id, member display name, slot number, game name, a boolean `isGm`, and room description. It should filter to `membership.year = year`, `game.year = year`, `game.category = 'user'`, and `game_assignment.gm >= 0`. It should order by member name, member id, slot number, and game name. It should use the best available room source with `COALESCE(game_room_room.description, game_room.description)`, where the first value comes from `game_room_assignment` joined on game id, slot id, and year, and the fallback comes from `game.room_id`.

The same file should contain or call pure helper functions that group rows into member labels. A label model should have `memberName` and `assignments`. Each assignment should have `slot`, `gameName`, `room`, and `isGm`. Missing rooms should render as an empty string rather than failing the PDF generation.

Add a PDF renderer in the same service file or in a sibling module such as `packages/server/src/api/services/reports/memberLabelsPdf.ts`. The renderer should use `pdf-lib` to load `PrintAssets/Avery5163ShippingLabels.pdf` if it is present. For each page of ten labels, create a new letter-size page in the output PDF and draw the copied template page behind the text if the template loads successfully. If the template cannot be loaded, continue with a blank letter page so tests and local development are not blocked by a missing asset. Coordinates should use PDF points, where one inch is 72 points. Avery 5163 label geometry should be encoded as constants:

- page width 612 points and height 792 points.
- label width 288 points and height 144 points.
- left margin 13.5 points.
- top margin 36 points.
- two columns and five rows.
- horizontal gap 9 points.
- vertical gap 0 points.

Within each label, reserve a small inset so text does not touch the die-cut edge. Draw the member name box near the top of the label, using a slightly larger font, approximately 10 to 11 points. Draw assignment rows below it using approximately 7 to 8 point text. Draw the slot number in a fixed left column, draw the room in a fixed right column right justified against that column's right edge, and fit the game name into the remaining width. If a game name is too long, shrink it down to a minimum readable size, then truncate with an ellipsis if it still does not fit. Use Helvetica-Bold for the game name when `isGm` is true, and Helvetica otherwise.

The renderer should return PDF bytes. The tRPC service should return those bytes as base64 with `contentType: 'application/pdf'` and `filenameLabel: 'member-labels'`.

Wire the service into `packages/server/src/api/routers/reports/index.ts` by adding a protected query such as `getPdfData`. The query input should be `reportPdfInputSchema`, and for now it should dispatch only `memberLabels` to the member labels service. Unsupported ids should fail through schema validation.

On the client, add `packages/amber/views/Reports/downloadReportPdf.ts`. It should accept a filename and `ReportPdfData`, decode the base64 string into bytes, create a `Blob` with `application/pdf`, create an object URL, click a temporary anchor with the `download` attribute, and revoke the object URL after starting the download. It should guard against server-side rendering the same way `downloadReportWorkbook.ts` does.

Update `packages/amber/views/Reports.tsx` to support separate workbook and PDF report sections. Keep the existing workbook behavior intact. Add a `PdfReportRecord` type with `name`, `pdfReportId`, optional `fileLabel`, optional `perm`, and optional `virtual`. Update `ReportsProps` to accept `reports` for workbook reports and `pdfReports` for PDF reports, defaulting `pdfReports` to an empty array. Render a PDF section below the existing list only when at least one PDF report is visible after permission and virtual-site filtering. The PDF section should have a modest heading such as `PDF Reports` and buttons like `Download Member Labels PDF`. Use existing Material UI components; keep styling simple and consistent with the current page.

Update `apps/acnw/pages/report-admin.tsx` and `apps/acus/pages/report-admin.tsx` to pass `pdfReports={[{ name: 'Member Labels', pdfReportId: 'memberLabels' }]}` to `Reports`. This makes the feature available for both sites.

Finally, add tests. Server tests should cover the pure grouping and PDF rendering behavior without requiring a live database. A focused Vitest file such as `packages/server/src/api/services/reports/memberLabelsPdfReport.test.ts` should construct two members with assignments, render the PDF, reload it using `PDFDocument.load`, and assert that the expected number of pages is produced for 1, 10, and 11 labels. It should also test that the grouping preserves slot order and `isGm`. If text extraction is not available, do not assert raw text content from the PDF; verify structure, page count, and that the renderer returns non-empty bytes. If practical, add a client helper test for base64-to-Blob decoding, but prioritize server tests because that is where the layout behavior lives.

## Concrete Steps

From the repository root `/Users/ggp/dev/git/amber`, install the dependency:

    pnpm -F @amber/server add pdf-lib

If the package filter name fails, inspect `packages/server/package.json`; the package name is currently `@amber/server`, and the workspace may also accept `pnpm -F server add pdf-lib`.

Edit `packages/server/src/api/contracts/reports.ts` to add:

    export const pdfReportIdSchema = z.enum(['memberLabels'])

    export const reportPdfInputSchema = z.object({
      pdfReportId: pdfReportIdSchema,
      year: z.number().int().optional(),
    })

    export type PdfReportId = z.infer<typeof pdfReportIdSchema>
    export type ReportPdfInput = z.infer<typeof reportPdfInputSchema>

    export type ReportPdfData = {
      base64: string
      contentType: 'application/pdf'
      filenameLabel: string
    }

Use these exact names unless an implementation detail makes a different name substantially clearer; if names change, update this plan.

Create `packages/server/src/api/services/reports/memberLabelsPdfReport.ts`. Define descriptive exported types for testable helpers, for example:

    export type MemberLabelAssignment = {
      gameName: string
      isGm: boolean
      room: string
      slot: number
    }

    export type MemberLabel = {
      assignments: Array<MemberLabelAssignment>
      memberName: string
    }

    export const groupMemberLabelRows = (rows: Array<MemberLabelRow>): Array<MemberLabel> => ...

    export const renderMemberLabelsPdf = async (labels: Array<MemberLabel>): Promise<Uint8Array> => ...

    export const getMemberLabelsPdfData = async (ctx: Context, input: ReportPdfInput): Promise<ReportPdfData> => ...

The SQL query in that service should follow this shape, with exact aliases adapted to the TypeScript row type:

    SELECT
      m.id AS "memberId",
      COALESCE(NULLIF(u.full_name, ''), u.display_name, u.email) AS "memberName",
      g.slot_id AS "slot",
      g.name AS "gameName",
      CASE WHEN ga.gm > 0 THEN TRUE ELSE FALSE END AS "isGm",
      COALESCE(gra_room.description, game_room.description, '') AS "room"
    FROM membership m
      JOIN "user" u ON m.user_id = u.id
      JOIN game_assignment ga ON m.id = ga.member_id
      JOIN game g ON g.id = ga.game_id
      LEFT JOIN game_room_assignment gra
        ON gra.game_id = g.id
        AND gra.slot_id = g.slot_id
        AND gra.year = g.year
      LEFT JOIN room gra_room ON gra.room_id = gra_room.id
      LEFT JOIN room game_room ON g.room_id = game_room.id
    WHERE
      m.year = ${year}
      AND g.year = ${year}
      AND g.category = 'user'
      AND ga.gm >= 0
    ORDER BY
      "memberName",
      m.id,
      g.slot_id,
      g.name

If this query creates duplicate rows because multiple `game_room_assignment` rows exist for a game and slot, add the same filter used elsewhere in the room assignment code to prefer the active or override row, and document the decision in this plan.

Edit `packages/server/src/api/routers/reports/index.ts` so it imports `reportPdfInputSchema` and `getMemberLabelsPdfData`, and adds:

    getPdfData: protectedProcedure
      .input(reportPdfInputSchema)
      .query(async ({ ctx, input }) => getMemberLabelsPdfData(ctx, input)),

Edit `packages/amber/views/Reports/downloadReportPdf.ts` with the browser download helper described above.

Edit `packages/amber/views/Reports.tsx` to import `PdfReportId`, import `downloadReportPdf`, add `PdfReportRecord`, add `pdfReports?: Array<PdfReportRecord>` to props, add a second active id state for PDF downloads, filter PDF reports with the same virtual and permission rules, and call:

    trpc.reports.getPdfData.queryOptions({
      pdfReportId,
      year: configuration.year,
    })

Use the same filename convention as workbooks:

    `${abbr}${configuration.year}-${fileLabel}-${timestamp}.pdf`

Edit `apps/acnw/pages/report-admin.tsx` and `apps/acus/pages/report-admin.tsx` to define:

    const pdfReports: Array<PdfReportRecord> = [{ name: 'Member Labels', pdfReportId: 'memberLabels' }]

and render:

    <Reports pdfReports={pdfReports} reports={reports} />

Add `packages/server/src/api/services/reports/memberLabelsPdfReport.test.ts` for pure grouping and renderer tests.

## Validation and Acceptance

Run all validation from `/Users/ggp/dev/git/amber`.

First run focused tests:

    pnpm test packages/server/src/api/services/reports/memberLabelsPdfReport.test.ts

Expect Vitest to report the new test file passing. The exact number of tests depends on implementation, but it should include coverage for grouping, one page for ten labels, and two pages for eleven labels.

Then run TypeScript validation:

    pnpm tsgo

Expect all workspace TypeScript projects to pass.

Then run the existing unit test suite:

    pnpm test

Expect the suite to pass.

Then run lint:

    pnpm lint

Expect no lint errors.

For manual acceptance, start either app after the implementation:

    pnpm dev:nw

Open `http://localhost:30000/report-admin`, authenticate if required, and verify that the Reports page shows existing workbook buttons and a separate PDF section containing `Download Member Labels PDF`. Click the button and confirm a PDF named like `ACNW2026-member-labels-<timestamp>.pdf` downloads. Repeat for ACUS with:

    pnpm dev:us

Open `http://localhost:30001/report-admin` and confirm the same PDF action exists and downloads a file named like `ACUS2026-member-labels-<timestamp>.pdf`.

Open the generated PDF in a local viewer. Verify that pages use the Avery 5163 ten-label layout, member names appear in boxed headers, rows show slot number, game name, and room, and GM game names are visibly bold.

## Idempotence and Recovery

All code edits are additive or narrowly scoped. Re-running tests and type checks is safe. Re-running `pnpm -F @amber/server add pdf-lib` should leave `package.json` and the lockfile stable once the dependency is already present.

If PDF generation fails because `PrintAssets/Avery5163ShippingLabels.pdf` cannot be loaded, the renderer should still produce a blank-background PDF with the same label geometry. That fallback keeps the report usable and makes unit tests independent of local PDF tooling.

If a manual download fails from the browser, inspect the tRPC network response for `reports.getPdfData`. A successful response should include `contentType: 'application/pdf'`, `filenameLabel: 'member-labels'`, and a non-empty `base64` string. If the response is correct but the browser does not download, debug `packages/amber/views/Reports/downloadReportPdf.ts`.

If room data looks wrong, compare the member label query with existing assignment reports and room assignment code. Prefer `game_room_assignment` when present and fall back to `game.room_id`; record any change in the Decision Log.

## Artifacts and Notes

Important files reviewed while drafting this plan:

    .agent/PLANS.md
    packages/amber/views/Reports.tsx
    packages/amber/views/Reports/downloadReportWorkbook.ts
    apps/acnw/pages/report-admin.tsx
    apps/acus/pages/report-admin.tsx
    packages/server/src/api/contracts/reports.ts
    packages/server/src/api/routers/reports/index.ts
    packages/server/src/api/services/reporting.ts
    packages/server/src/api/services/reports/index.ts
    packages/server/src/api/services/reports/gameAssignmentsReport.ts
    packages/server/src/api/services/reports/gameAndPlayersReport.ts
    packages/server/src/api/services/reports/membersForPlayerSchedulerReport.ts
    packages/server/prisma/schema.prisma
    packages/server/package.json
    package.json
    PrintAssets/Avery5163ShippingLabels.pdf
    PrintAssets/labels-2025.pdf

Useful command results from initial research:

    rg --files -g 'package.json' -g '*report*' -g '*Report*' -g 'PrintAssets/**'
    ... showed the shared Reports view, app report-admin pages, server report contracts/services, and both PDF print assets.

    rg "pdf-lib|PDFDocument|application/pdf" .
    ... found no existing PDF generation path.

Validation results after implementation:

    pnpm test packages/server/src/api/services/reports/memberLabelsPdfReport.test.ts
    Test Files  1 passed (1)
    Tests  4 passed (4)

    pnpm tsgo
    All 11 scoped workspace projects completed successfully.

    pnpm test
    Test Files  95 passed (95)
    Tests  326 passed (326)

    pnpm lint
    Completed successfully after adding the narrow import/order override described in the Decision Log.

    pnpm dev:nw
    Started the ACNW Next.js app at http://localhost:30000 after running the ACNW boot sequence and database migration. Next.js reported repeated Watchpack `EMFILE: too many open files, watch` warnings, but also reported `Ready`.

## Interfaces and Dependencies

The new dependency is `pdf-lib` in `packages/server/package.json`.

The server contract additions in `packages/server/src/api/contracts/reports.ts` must expose:

    pdfReportIdSchema
    reportPdfInputSchema
    type PdfReportId
    type ReportPdfInput
    type ReportPdfData

The tRPC reports router in `packages/server/src/api/routers/reports/index.ts` must expose:

    reports.getPdfData

The member labels service in `packages/server/src/api/services/reports/memberLabelsPdfReport.ts` must expose pure helpers for testing:

    groupMemberLabelRows(rows)
    renderMemberLabelsPdf(labels)
    getMemberLabelsPdfData(ctx, input)

The shared Reports view in `packages/amber/views/Reports.tsx` must accept:

    reports: Array<ReportRecord>
    pdfReports?: Array<PdfReportRecord>

The browser helper in `packages/amber/views/Reports/downloadReportPdf.ts` must expose:

    downloadReportPdf({ filename, pdfData })

At the end of the plan, both `apps/acnw/pages/report-admin.tsx` and `apps/acus/pages/report-admin.tsx` must pass a Member Labels PDF report record into the shared Reports view.

Plan revision note: Initial plan drafted on 2026-05-07 after reading the report code and print asset inventory. The plan chooses server-side `pdf-lib` generation, a separate PDF contract, and shared UI wiring because those choices fit the existing workbook report architecture while keeping binary PDF behavior distinct.

Plan revision note: Updated on 2026-05-07 to explicitly require room text to be right justified on each label row, matching the target sample format.

Plan revision note: Updated on 2026-05-07 after implementation to record completed work, validation outcomes, the room aggregation decision, the PDF template fallback discovery, and the scoped ESLint override.

Plan revision note: Updated on 2026-05-07 after follow-up review to record that the PDF report explicitly filters `game_assignment.year` by the selected report year.

Plan revision note: Updated on 2026-05-07 after diagnosing an empty ACNW 2026 PDF. Local ACNW has `config.year = 2026` but zero 2026 memberships, games, and assignments; the Reports page now uses `useYearFilter` so selecting 2025 requests and names 2025 reports.

Plan revision note: Updated on 2026-05-07 after visual review of the generated 2025 PDF showed both columns shifted right. The renderer now uses the Avery 5163 side margin and gutter rather than a generic half-inch side margin.

Plan revision note: Updated on 2026-05-07 to sort labels by last name, then first name, with stable fallbacks.

Plan revision note: Updated on 2026-05-07 to render blank rows for missing member schedule slots.

Plan revision note: Updated on 2026-05-07 to exclude non-attending memberships from the member labels query.

Plan revision note: Updated on 2026-05-07 to use 12 point regular Helvetica for member names because the built-in PDF fonts do not provide semi-bold.

Plan revision note: Updated on 2026-05-07 to draw the member name box with a grey border.

Plan revision note: Updated on 2026-05-07 to set row height to 11 for seven-slot schedules and 12.5 otherwise.

Plan revision note: Updated on 2026-05-07 to make Avery template drawing an opt-in debug setting that defaults to false.
