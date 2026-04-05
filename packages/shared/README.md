# `@amber/shared`

`@amber/shared` is the workspace package for code that is explicitly safe to
import from either browser code or server code.

The point of this package is to give the repo a clear home for pure shared
utilities. If code lives here, callers should be able to import it from React
components, Next.js client bundles, Next.js server code, tRPC routers, tests,
or scripts without accidentally dragging server-only dependencies into the
import graph.

## What belongs here

Code in `@amber/shared` should be:

- pure or close to pure utility code
- safe to evaluate at import time
- independent of request context
- independent of app runtime configuration
- useful to both browser and server callers

Examples of good fits:

- date and time formatting helpers
- configuration parsing and shared schemas
- slot and scheduling utilities
- small domain constants and enums
- pure data transformation helpers
- validation schemas that do not depend on server-only code

Current examples in this package are
[`slotHelpers.ts`](./src/slotHelpers.ts) and
[`configuration.ts`](./src/configuration.ts).

## What does not belong here

Do not put code in `@amber/shared` if it depends on:

- Prisma or database access
- Auth0 or user session state
- Next.js server APIs
- filesystem access
- environment variable loading
- request or response objects
- email or Stripe SDK setup
- any import-time side effects

As a practical rule: if a browser bundle would break, bloat, or become
surprising because of an import, the code does not belong in `@amber/shared`.

## Dependency limits

Dependencies in this package should stay small and platform-neutral. Runtime
libraries are acceptable when they are known to work in both browser and server
environments. `luxon` is acceptable here for that reason.

Avoid turning this package into a miscellaneous dumping ground. If a helper is
only used on the server, keep it in `@amber/server`. If it is only a UI concern,
keep it in `@amber/amber` or `@amber/ui`.

## Usage

Import shared utilities from the package root:

    import { getSlotDescription, SlotFormat } from '@amber/shared'

Do not reach into another package's internal path for code that should live
here. In particular, browser-facing code should not import shared utilities from
`@amber/server/src/...` when the utility can instead live in `@amber/shared`.

## Current structure

- `src/index.ts`: public exports for the package
- `src/configuration.ts`: shared settings/config parsing and types
- `src/dot2val.ts`: helper used by the configuration parser
- `src/slotHelpers.ts`: browser-safe slot utilities
- `src/slotHelpers.test.ts`: canonical tests for the slot utility behavior
