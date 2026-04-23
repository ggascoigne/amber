# Reduce ACNW/ACUS Next.js page-wrapper and route duplication

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This plan must be maintained in accordance with `.agent/PLANS.md` from the repository root.

## Purpose / Big Picture

AmberCon Northwest (`apps/acnw`) and AmberCon US (`apps/acus`) currently implement many of the same Next.js file-system routes and navigation entries twice. After this change, a contributor should be able to add or change a shared page wrapper or shared navigation entry in one obvious place, while still preserving the small set of real convention-specific differences such as ACNW-only accommodation routes, the ACUS hotel page, and differing authentication rules.

A novice should be able to prove the cleanup worked by running both apps, visiting shared pages like `/game-assignments`, `/member-admin`, and `/transactions` in each app, and observing that the rendered behavior and menu visibility stay the same while the duplicated wrapper and route wiring code is reduced and easier to follow.

## Progress

- [x] (2026-04-12 17:03Z) Read `.agent/PLANS.md` and confirmed the required ExecPlan structure and living-document rules.
- [x] (2026-04-12 17:03Z) Inspected `apps/acnw/pages/_app.tsx`, `apps/acus/pages/_app.tsx`, `apps/acnw/views/Routes.tsx`, `apps/acus/views/Routes.tsx`, and representative duplicated page wrappers.
- [x] (2026-04-12 17:03Z) Verified with a file-content comparison that many page files are literally identical across `apps/acnw/pages` and `apps/acus/pages` at the same relative paths.
- [x] (2026-04-12 17:03Z) Verified the route arrays share most paths and differ only in a small set of convention-specific entries.
- [ ] Implement a shared page-wrapper helper module and migrate the simple duplicated page wrappers to it.
- [ ] Implement a shared route-definition builder and migrate both apps’ `views/Routes.tsx` to thin convention-specific configuration files.
- [ ] Simplify both apps’ `_app.tsx` files so the only per-app shell differences are convention metadata such as title, banner, and route definition source.
- [ ] Run lint, type validation, and both Next.js production builds, then manually verify representative shared and convention-specific routes in both apps.
- [ ] Update this ExecPlan with implementation progress, surprises, final decisions, and retrospective notes.

## Surprises & Discoveries

- Observation: The repeated page wrappers are extremely thin. A typical shared wrapper is only a `configGetServerSideProps` export plus a component that renders a shared view from `@amber/amber/views/...`.
  Evidence: `apps/acnw/pages/game-assignments.tsx` and `apps/acus/pages/game-assignments.tsx` are representative examples.

- Observation: The root navigation is not computed in the app pages themselves. Both apps hand a `rootRoutes` function into `packages/amber/components/RootComponent.tsx`, which memoizes `rootRoutes(configuration)` and passes the result into layout and route guarding.
  Evidence: `packages/amber/components/RootComponent.tsx` computes routes from `rootRoutes(configuration)` and uses them throughout the shell.

- Observation: The route arrays are mostly the same, with only a few convention-specific paths.
  Evidence: Both `apps/acnw/views/Routes.tsx` and `apps/acus/views/Routes.tsx` define large overlapping route lists, while the known differences are concentrated in accommodation, hotel, and a few convention-specific labels.

- Observation: Two routes that look shared are intentionally different in authentication behavior.
  Evidence: ACNW protects `game-signup/[[...all]].tsx` and `game-choices/[[...all]].tsx` with Auth0 page auth, while ACUS exports `configGetServerSideProps` directly for those routes.

- Observation: `report-admin.tsx` is not a simple wrapper duplicate.
  Evidence: The report list differs materially between the conventions, including different report definitions and permission-gated entries.

## Decision Log

- Decision: Keep Next.js file-system routes in `apps/acnw/pages` and `apps/acus/pages`, but replace repeated wrapper bodies with shared helper functions and shared route-definition data.
  Rationale: Next.js pages in this repository are file-based entry points. Removing the files entirely would increase routing risk. Thin per-file exports preserve the current routing model while eliminating repetitive implementation details.
  Date/Author: 2026-04-12 / Hermes.

- Decision: Treat the first-pass cleanup target as simple wrapper pages and root route wiring, not all app differences.
  Rationale: Files such as `report-admin.tsx`, `about.tsx`, and `_document.tsx` contain real convention-specific content or metadata. Folding those into the same refactor would mix cleanup with product behavior changes and make the migration harder to validate.
  Date/Author: 2026-04-12 / Hermes.

- Decision: Preserve existing behavioral differences explicitly in configuration rather than implicitly in copied files.
  Rationale: The important differences that remain after deduplication are few and understandable: route labels, route presence, title strings, about and accommodation pages, and whether some pages require authentication. These are better represented as data than as copy-pasted modules.
  Date/Author: 2026-04-12 / Hermes.

## Outcomes & Retrospective

Initial planning outcome: the repository already has a strong shared center in `packages/amber`, and the duplication mostly lives in app entry-point wrappers and route lists. That means the cleanup can be incremental, low-risk, and easy to verify if it introduces shared wrapper helpers and declarative route configuration without changing the underlying shared views.

No code has been changed yet. The main remaining risk is accidentally changing authentication or menu visibility while migrating route definitions. The validation section below is designed to catch that early.

## Context and Orientation

This repository is a monorepo rooted at the repository root. The two convention apps relevant to this cleanup are `apps/acnw` for AmberCon Northwest and `apps/acus` for AmberCon US.

A page wrapper in this repository means a file under `apps/acnw/pages` or `apps/acus/pages` that exists mainly because Next.js uses the filesystem as its router. Most of these files do not contain business logic. They usually do three things: import a React view, export `getServerSideProps`, and export a tiny `NextPage` component that renders the imported view.

A root route in this repository means an entry in a `RootRoutes` array, which is the navigation model used by the shared app shell. The type lives in `packages/amber/components/Navigation/types.ts` as `RouteInfo` and `RootRoutes`. These route objects include the URL path, label text, permission checks, and optional conditions based on configuration flags or user state.

The current shell wiring works like this.

`apps/acnw/pages/_app.tsx` and `apps/acus/pages/_app.tsx` both render `packages/amber/components/RootComponent.tsx`. They each pass three convention-specific pieces of data: a page title string, a `Banner` component from the local app, and a `rootRoutes` function imported from the local app’s `views/Routes.tsx`.

Inside `packages/amber/components/RootComponent.tsx`, the app configuration is loaded and then `rootRoutes(configuration)` is memoized. The resulting route list is passed into layout and route guarding. This means the two local `views/Routes.tsx` files are the only convention-specific route-definition source for the app shell today.

The representative duplicated files that should anchor this refactor are:

- `apps/acnw/pages/_app.tsx`
- `apps/acus/pages/_app.tsx`
- `apps/acnw/views/Routes.tsx`
- `apps/acus/views/Routes.tsx`
- `apps/acnw/pages/game-assignments.tsx`
- `apps/acus/pages/game-assignments.tsx`
- `apps/acnw/pages/index.tsx`
- `apps/acus/pages/index.tsx`
- `apps/acnw/pages/about.tsx`
- `apps/acus/pages/about.tsx`
- `packages/amber/components/RootComponent.tsx`
- `packages/amber/components/Navigation/types.ts`

Representative same-path page files already known to be identical include:

- `about-amber.tsx`
- `anti-harassment-policy.tsx`
- `contact.tsx`
- `covid-policy.tsx`
- `credits.tsx`
- `faq.tsx`
- `game-admin.tsx`
- `game-assignments.tsx`
- `game-history.tsx`
- `gm/[[...all]].tsx`
- `index.tsx`
- `lookup-admin.tsx`
- `member-admin.tsx`
- `membership/[[...all]].tsx`
- `payment-success.tsx`
- `payment.tsx`
- `room-assignments.tsx`
- `schedule.tsx`
- `settings-admin.tsx`
- `stripe.tsx`
- `transactions.tsx`
- `user-admin.tsx`

The same-path page files that must be handled carefully or left convention-specific are:

- `_app.tsx`
- `_document.tsx`
- `about.tsx`
- `game-book/[[...all]].tsx`
- `game-choices/[[...all]].tsx`
- `game-signup/[[...all]].tsx`
- `report-admin.tsx`

The route files are also mostly duplicated. Their shared core is large, and the differences are small and understandable. That is exactly the kind of situation where a shared route builder plus small per-convention configuration is clearer than two hand-maintained arrays.

## Milestones

### Milestone 1: Replace identical page wrappers with shared wrapper helpers

At the end of this milestone, the duplicated trivial page wrappers in `apps/acnw/pages` and `apps/acus/pages` still exist as Next.js route files, but their internals are reduced to shared helper usage. A novice should be able to add one more shared page by following an obvious pattern instead of copy-pasting another full wrapper body.

This milestone should migrate the known identical wrappers first, then handle the near-identical wrappers for `game-signup` and `game-choices` using a protected helper for ACNW and a plain helper for ACUS. The acceptance is that all route file paths remain unchanged and the visible pages still work exactly as before.

### Milestone 2: Replace duplicated route arrays with a shared route-definition builder

At the end of this milestone, both convention apps still provide their own `rootRoutes` function, but those functions are thin adapters around a shared builder plus small convention-specific configuration files. A novice should be able to find all shared route definitions in one place and all convention-specific differences in one much smaller place.

This milestone should preserve path labels, permissions, and conditions exactly. The acceptance is that menu visibility and route guarding remain unchanged in both apps.

### Milestone 3: Simplify the app shell wrappers and validate both conventions end to end

At the end of this milestone, `_app.tsx` in each app reads like straightforward shell configuration rather than partially duplicated implementation. Both apps should still build, and both shared and convention-specific routes should be manually verifiable in dev mode.

The acceptance is that a human can run both apps, visit representative shared pages and convention-only pages, and observe no behavior regressions.

## Plan of Work

Start by introducing one shared helper module under `packages/amber` for Next.js page wrappers. The helper must cover the two wrapper modes that matter in this cleanup: a plain page using `configGetServerSideProps`, and a page whose `getServerSideProps` is wrapped with `auth0.withPageAuthRequired`. Place this helper in a path that is clearly reusable by both apps, such as `packages/amber/nextjs/pageFactories.tsx` or `packages/amber/utils/pageFactories.tsx`. Keep the implementation tiny and explicit; the goal is not cleverness but a single obvious place where page-wrapper behavior is defined.

Then migrate the identical page wrappers to use that helper. Do not change their file paths, because those paths are the Next.js routes. The file-level route names must remain stable. Each page file should become a very small adapter that points at the shared view and chooses the correct wrapper helper. For example, a page like `apps/acnw/pages/game-assignments.tsx` and `apps/acus/pages/game-assignments.tsx` should no longer duplicate the same `NextPage` body and `getServerSideProps` export by hand.

After the simple identical wrappers are migrated, address the near-duplicate wrappers that differ only by authentication behavior. `apps/acnw/pages/game-signup/[[...all]].tsx` and `apps/acnw/pages/game-choices/[[...all]].tsx` should use the protected helper, while the ACUS versions should use the plain helper. This keeps the important behavior difference while still deduplicating the wrapper shape.

Next, introduce a shared route-definition builder in `packages/amber`, for example `packages/amber/components/Navigation/buildConventionRoutes.ts` or `packages/amber/routes/buildRootRoutes.ts`. The builder should take convention-specific configuration data and return a `RootRoutes` value. The data passed in by each app should include only the true differences: title and label strings, route presence toggles, route-specific conditions, and app-specific extra routes.

Create one small convention-specific route configuration file per app, such as:

- `apps/acnw/views/routeConfig.ts`
- `apps/acus/views/routeConfig.ts`

These files should declare the app’s about label, any app-only route entries, and any app-only route conditions. Then rewrite `apps/acnw/views/Routes.tsx` and `apps/acus/views/Routes.tsx` so they become thin wrappers around the shared builder instead of hand-maintained arrays.

With the route builder in place, simplify both `_app.tsx` files so they read like shell configuration rather than custom implementations. They will still stay in each app, because they import the local `Banner` and define the local title, but the structure should become obviously shared and stable.

Do not refactor `_document.tsx` in this pass. That file contains convention-specific metadata such as descriptions and keywords, which is not the same cleanup problem. Do not refactor `report-admin.tsx` into the shared path in this pass either, because the report arrays differ materially between conventions. Do not attempt to merge the `about` views themselves; `apps/acnw/pages/about.tsx` and `apps/acus/pages/about.tsx` intentionally point at different local view files.

As each page or route file is migrated, run type and lint checks before moving on. Once the shared pages and route builder are complete, run both production builds and then both dev servers to verify shared URLs and convention-specific URLs still work.

## Concrete Steps

Run all commands from the repository root.

    cd /Users/ggp/dev/git/amber

Create the shared page-wrapper helper module in `packages/amber`. If you choose `packages/amber/nextjs/pageFactories.tsx`, define helper exports for plain config-backed pages and protected config-backed pages.

Update the duplicated wrapper pages a few at a time, starting with the safest identical files:

- `apps/acnw/pages/game-assignments.tsx`
- `apps/acus/pages/game-assignments.tsx`
- `apps/acnw/pages/room-assignments.tsx`
- `apps/acus/pages/room-assignments.tsx`
- `apps/acnw/pages/member-admin.tsx`
- `apps/acus/pages/member-admin.tsx`
- `apps/acnw/pages/transactions.tsx`
- `apps/acus/pages/transactions.tsx`

Then migrate the rest of the verified identical wrappers listed in the Context section, followed by the authentication-variant near-duplicates:

- `apps/acnw/pages/game-signup/[[...all]].tsx`
- `apps/acus/pages/game-signup/[[...all]].tsx`
- `apps/acnw/pages/game-choices/[[...all]].tsx`
- `apps/acus/pages/game-choices/[[...all]].tsx`

After the pages are migrated, create the shared route builder under `packages/amber` and move app-specific route data into:

- `apps/acnw/views/routeConfig.ts`
- `apps/acus/views/routeConfig.ts`

Then update `apps/acnw/views/Routes.tsx` and `apps/acus/views/Routes.tsx` so they call the builder with the local configuration.

When the route builder is in place, simplify:

- `apps/acnw/pages/_app.tsx`
- `apps/acus/pages/_app.tsx`

Run type validation after the first batch of page migrations.

    pnpm tsgo

Expected success signal:

    Scope: all workspace projects
    ...
    Done in ...

Run lint after the page migration and again after the route migration.

    pnpm lint

Expected success signal:

    eslint ...
    0 problems

Run both production builds after all edits are complete.

    pnpm build:nw
    pnpm build:us

Expected success signal for each build:

    Next.js build completed successfully

Start the dev servers one at a time for manual verification.

    pnpm dev:nw
    pnpm dev:us

Expected local URLs:

- ACNW on `http://localhost:30000`
- ACUS on `http://localhost:30001`

Visit the following shared pages in both apps and confirm they still render and appear in the menu where appropriate:

- `/game-assignments`
- `/room-assignments`
- `/member-admin`
- `/transactions`
- `/credits`
- `/faq`

Visit the following convention-specific pages and confirm they still differ appropriately:

- ACNW: `/about-edgefield`
- ACNW: `/virtual-details`
- ACNW: `/hotel-room-types`
- ACNW: `/hotel-rooms`
- ACNW: `/game-rooms`
- ACUS: `/hotel`

Verify the authentication difference was preserved:

- In ACNW, an unauthenticated request to `/game-signup` and `/game-choices` should still require login.
- In ACUS, those routes should still use the existing non-protected server-side props path.

Update this ExecPlan after each milestone, including the actual commands run, any errors encountered, and any deviations from the original implementation order.

## Validation and Acceptance

The cleanup is accepted only if all of the following are true.

Both apps still compile and validate:

- `pnpm tsgo` succeeds from `/Users/ggp/dev/git/amber`
- `pnpm lint` succeeds from `/Users/ggp/dev/git/amber`
- `pnpm build:nw` succeeds from `/Users/ggp/dev/git/amber`
- `pnpm build:us` succeeds from `/Users/ggp/dev/git/amber`

Both apps still serve the same user-visible pages for the shared wrapper routes. A human should be able to start each dev server and confirm that visiting `/game-assignments`, `/room-assignments`, `/member-admin`, `/transactions`, `/credits`, and `/faq` renders the same screens as before the refactor.

The menu must still be correct. Because `RootComponent` uses `rootRoutes(configuration)` to populate layout and route guarding, the cleanup must preserve path labels, permissions, and configuration-based conditions. In practice, that means:

- ACNW still shows the same about route labeling and convention-specific entries.
- ACUS still shows its existing about route labeling and hotel route.
- Shared routes remain visible or hidden according to the same permission and configuration logic as before.

The authentication difference for game signup and game choices must remain unchanged. This is crucial because the current files show that ACNW wraps `getServerSideProps` with Auth0 for those routes, while ACUS does not.

A useful before-and-after proof is a small spot-check matrix:

- ACNW `/game-assignments`: page loads, menu entry exists.
- ACUS `/game-assignments`: page loads, menu entry exists.
- ACNW `/about-edgefield`: page loads.
- ACUS `/hotel`: page loads.
- ACNW unauthenticated `/game-signup`: login required.
- ACUS `/game-signup`: existing non-protected behavior preserved.

## Idempotence and Recovery

This refactor should be performed in small, additive steps and is safe to repeat if done carefully.

Keeping the Next.js page files in place makes the migration idempotent: rerunning the edits should only simplify wrapper internals, not change route names. If a shared helper or route builder introduces a regression, revert the affected page or route file to its previous explicit form and rerun `pnpm tsgo` and `pnpm lint` before continuing.

Do not mix `_document.tsx` changes into this work. That file contains metadata and branding text, and changing it at the same time would make route-cleanup regressions harder to isolate.

If route-builder migration causes navigation drift, restore the old `apps/acnw/views/Routes.tsx` or `apps/acus/views/Routes.tsx` file first, confirm the app shell works again, and then reintroduce the builder with only one route group migrated at a time. Because `RootComponent` already accepts a `rootRoutes` function, the rollback boundary is clean and local.

If protected and non-protected page helpers become confusing, keep two explicit helper exports with obvious names instead of one configurable helper. Clarity is more important than minimizing lines.

## Artifacts and Notes

Representative duplicated page wrappers currently look like this:

    export const getServerSideProps = configGetServerSideProps

    const Page: NextPage = () => <GameAssignmentsPage />

    export default Page

Representative shell wiring currently looks like this.

From `apps/acnw/pages/_app.tsx`:

    <RootComponent title='AmberCon Northwest' banner={<Banner to='/' />} rootRoutes={rootRoutes} {...props} />

From `apps/acus/pages/_app.tsx`:

    <RootComponent title='Ambercon US' banner={<Banner to='/' />} rootRoutes={rootRoutes} {...props} />

From `packages/amber/components/RootComponent.tsx`:

    const routes = useMemo(() => rootRoutes(configuration), [configuration, rootRoutes])

Known same-path wrappers that are good first migration candidates include:

- `game-assignments.tsx`
- `room-assignments.tsx`
- `member-admin.tsx`
- `transactions.tsx`
- `credits.tsx`
- `faq.tsx`
- `index.tsx`
- `user-admin.tsx`

Known convention-specific paths that must remain configurable include:

- ACNW-only accommodation and room-management routes.
- ACUS-only `/hotel`.
- Auth-protected versus non-protected signup and choices routes.
- Convention-specific report-admin definitions.

## Interfaces and Dependencies

Use the existing shared types and shell contract rather than inventing a new app-shell system.

`packages/amber/components/Navigation/types.ts` already defines the route shape through `RouteInfo` and `RootRoutes`. The shared route builder introduced in this plan should return `RootRoutes` and should accept convention-specific input that is plain data, not JSX-heavy custom logic.

A good target shape is:

    export type ConventionRouteOverrides = {
      aboutLabel: string
      aboutSubText: string
      extraRoutes?: Array<RouteInfo>
      replaceRoutes?: Partial<Record<string, RouteInfo>>
      omitPaths?: Array<string>
    }

    export const buildConventionRootRoutes = (
      configuration: Configuration,
      overrides: ConventionRouteOverrides,
    ): RootRoutes => {
      ...
    }

The exact type names may vary, but the end state must keep `apps/acnw/views/Routes.tsx` and `apps/acus/views/Routes.tsx` small and data-driven.

For page wrappers, prefer two explicit helper entry points so the authentication behavior remains obvious.

    export const configPageGetServerSideProps = configGetServerSideProps
    export const createConfigPage = (View: React.ComponentType): NextPage => {
      ...
    }

    export const createProtectedConfigPage = (View: React.ComponentType): NextPage => {
      ...
    }

If the exact protected `getServerSideProps` type is awkward to express cleanly, document it in comments and prioritize readable usage in page files. The important requirement is that a reader can open a page file and immediately tell whether that route is protected.

Dependencies that must remain in use:

- `packages/amber/components/RootComponent.tsx` remains the shared app shell.
- `packages/amber/components/Navigation/types.ts` remains the source of truth for `RootRoutes`.
- The shared config-loading `getServerSideProps` helper remains the source of common page server-side behavior.
- The Auth0 page protection helper remains the source of route protection for routes that currently require it.
- Local app files such as `apps/acnw/components/Banner.tsx` and `apps/acus/components/Banner.tsx` remain app-specific and should not be merged in this cleanup.

Plan update note: Initial draft created after inspecting `.agent/PLANS.md`, both convention apps’ `_app.tsx` and `views/Routes.tsx`, representative page wrappers, `packages/amber/components/RootComponent.tsx`, and the known duplicated page set from earlier repo analysis.
