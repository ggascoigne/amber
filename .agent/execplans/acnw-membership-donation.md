# ACNW Membership Donation Selection

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This document must be maintained in accordance with [.agent/PLANS.md](/home/ggp/dev/git/amber/.agent/PLANS.md).

## Purpose / Big Picture

After this change, the AmberCon Northwest membership wizard will collect a concrete donation amount during registration instead of asking for a generic willingness to contribute and later asking again on the payment page. A member will be able to select a preset sponsorship amount or enter a custom amount, save that amount on the membership record, and see the payment page default to the actual balance owed without a second donation prompt.

## Progress

- [x] (2026-05-26 19:22Z) Mapped the current ACNW membership wizard, shared membership utilities, persistence schemas, SQL-backed membership queries, transaction update path, and shared payment flow.
- [x] (2026-05-26 19:39Z) Added the membership `donation` field through Prisma, a Knex migration, tRPC schemas, raw SQL select lists, query builders, and shared membership types.
- [x] (2026-05-26 19:40Z) Replaced the ACNW convention-step checkbox-only subsidy prompt with preset donation choices plus an “Other” amount field backed by `membership.donation`.
- [x] (2026-05-26 19:40Z) Updated membership transaction calculation so the initial membership transaction amount includes both `cost` and `donation`.
- [x] (2026-05-26 19:41Z) Split ACNW payment behavior by passing ACNW-specific payment input options from `apps/acnw/pages/payment.tsx`, hiding the donation prompt for the new workflow while preserving ACUS behavior.
- [x] (2026-05-26 19:46Z) Ran focused membership tests, `pnpm tsgo`, and `pnpm lint` successfully after regenerating Prisma typed SQL and applying the local migration.

## Surprises & Discoveries

- Observation: The shared payment page currently manufactures a default donation amount of `80` whenever the logged-in member has `offerSubsidy` set.
  Evidence: `packages/amber/views/Payment/PaymentInput.tsx` initializes `donation` with `membership ? (loggedInUserId === user.id && membership.offerSubsidy ? 80 : 0) : 0`.

- Observation: The initial membership transaction amount is derived only from `getMembershipCost(...)`, so persisted donation must be added there or the user balance will ignore it.
  Evidence: `packages/amber/utils/transactionUtils.ts` uses `0 - getMembershipCost(configuration, membershipValues)` for both create and update.

- Observation: Prisma typed SQL generation validates the `.sql` files against the configured local database schema, so adding `m.donation` to the query files required applying the local migration before `prisma generate --sql` would succeed.
  Evidence: `pnpm -F server prisma:generate` initially failed with `column m.donation does not exist`, then succeeded immediately after `DB_ENV=acnw pnpm -F server db:migrate:up`.

## Decision Log

- Decision: Keep the new donation choice ACNW-only by editing the ACNW membership wizard and ACNW payment page entry path rather than changing ACUS behavior.
  Rationale: The user explicitly scoped the workflow change to ACNW, and both apps already have app-local page and wizard files that can diverge safely.
  Date/Author: 2026-05-26 / Codex

- Decision: Persist donation on `membership` as a nullable-free numeric field defaulting to `0`, parallel to `cost`.
  Rationale: The requested behavior needs donation available during later payment and membership summary flows, and a database default avoids null handling drift in older rows.
  Date/Author: 2026-05-26 / Codex

- Decision: Preserve a narrow compatibility path for legacy ACNW memberships that previously had only `offerSubsidy=true` and no stored amount by keeping the payment-page donation field visible only for that case.
  Rationale: The new workflow hides the donation prompt because the amount is now chosen during registration, but older saved memberships do not have a persisted amount to honor.
  Date/Author: 2026-05-26 / Codex

## Outcomes & Retrospective

The ACNW workflow now captures a real donation amount during registration, stores it on the membership record, includes it in the initial membership transaction, and suppresses the duplicate ACNW payment-page donation prompt for the new flow. Validation passed with focused membership tests, a full workspace `tsgo` run, and a full repo `lint` run.

## Context and Orientation

The ACNW membership wizard lives in `apps/acnw/views/Memberships/`. The current contribution prompt is in `apps/acnw/views/Memberships/MembershipStepConvention.tsx`. Form values flow through `apps/acnw/views/Memberships/MembershipWizard.tsx`, then into shared persistence helpers in `packages/amber/utils/membershipUtils.ts`.

Membership records are stored through the memberships tRPC router in `packages/server/src/api/routers/memberships/`. The create and update schemas are defined in `packages/server/src/api/routers/memberships/schemas.ts`. Read queries are assembled from typed SQL files under `packages/server/prisma/sql/` and then normalized in `packages/server/src/api/routers/memberships/queries.ts`. The database schema is declared in `packages/server/prisma/schema.prisma`, while schema migrations are authored manually in `packages/server/support/db/migrations/`.

The payment screen is shared in `packages/amber/views/Payment/`. `PaymentInput.tsx` calculates the per-user payment amount and currently renders both a payment amount selector and a donation field. `ElementsForm.tsx` serializes those values into Stripe metadata. Stripe webhook processing in `packages/server/src/api/services/payments/webhook.ts` already understands the split between `membership` and `donation`, so the main change there is to stop asking ACNW users for donation a second time.

## Plan of Work

First, add a `donation` field to the `Membership` Prisma model and create a Knex migration that adds a `double precision not null default 0` column to `membership`. Then thread that field through membership create/update schemas, raw SQL select lists, query result builders, direct Prisma `findMany` selects, shared API schemas, default membership values, and legacy conversion helpers so every existing membership read and write path remains consistent.

Next, change `apps/acnw/views/Memberships/MembershipStepConvention.tsx` so the existing checkbox still gates the contribution section, but selecting it reveals fixed options for sponsoring a full membership, sponsoring a short membership, `100`, `30`, and `Other`, with the “Other” amount using the same currency-input pattern as the payment donation field. Update ACNW validation and wizard normalization so a selected preset or custom value becomes `membership.donation`, and clearing the checkbox resets it to `0`.

Then update `packages/amber/utils/transactionUtils.ts` so membership transaction creation and updates use membership cost plus persisted donation. This ensures the balance on the payment page already includes both amounts.

Finally, keep ACUS untouched by introducing ACNW-specific payment view behavior. The ACNW payment page should reuse the shared Stripe submission flow but render a payment input variant that initializes the payment amount from the user balance and suppresses the donation field. If there is an existing free-text comment input in the ACNW payment flow, hide it there as well. Validate that ACUS still uses the shared behavior.

## Concrete Steps

From `/home/ggp/dev/git/amber`:

1. Edit the ACNW membership UI and shared membership utilities with `apply_patch`.
2. Edit `packages/server/prisma/schema.prisma` and add a new migration file in `packages/server/support/db/migrations/`.
3. Update membership router schemas, SQL files, and tests.
4. Run focused tests such as:
   `pnpm test -- --run packages/server/src/api/routers/memberships/schemas.test.ts packages/server/src/api/routers/memberships/queries.test.ts packages/server/src/api/routers/memberships/mutations.test.ts`
5. Run `pnpm tsgo`.

Expected validation details will be filled in as commands are run.

## Validation and Acceptance

Acceptance is complete when:

1. In ACNW registration, choosing a normal membership and checking the contribution box reveals the preset donation options and an “Other” amount input.
2. Saving a membership persists the selected donation amount, and reopening the membership shows the saved amount.
3. The transaction recorded for a membership equals `cost + donation`, so the payment page initializes to the resulting balance without needing a separate donation entry.
4. The ACNW payment page shows only the payment amount UI for the logged-in user’s balance and does not offer the shared donation prompt.
5. ACUS membership and payment flows continue to behave as before.

## Idempotence and Recovery

The code edits are additive and can be re-applied safely by re-running tests after each patch. The migration is also additive; if it fails locally, fix the migration file and re-run the standard migration command for the correct `DB_ENV`. Avoid deleting or rewriting existing migration history.

## Artifacts and Notes

Important current behavior references:

    apps/acnw/views/Memberships/MembershipStepConvention.tsx
    packages/amber/utils/transactionUtils.ts
    packages/amber/views/Payment/PaymentInput.tsx
    packages/server/src/api/routers/memberships/queries.ts

## Interfaces and Dependencies

At completion, these interfaces must exist:

- `Membership` in `packages/server/prisma/schema.prisma` includes `donation Float @default(0)`.
- Membership create and update router schemas in `packages/server/src/api/routers/memberships/schemas.ts` accept `donation`.
- `MembershipFormType` and downstream membership API schemas include `donation`.
- ACNW membership wizard submits `membership.donation`.
- Membership transaction amount calculation includes persisted `donation`.
