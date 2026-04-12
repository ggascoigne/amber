# Router Folder Refactor

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds. This document follows the requirements in `.agent/PLANS.md`.

## Purpose / Big Picture

After this change, every router in `packages/server/src/api/routers` lives in its own folder instead of a mostly flat directory. A contributor should be able to open `packages/server/src/api/routers/<routerName>/` and find the router entry point in `index.ts` plus its schemas, queries, mutations, tests, and helper modules nearby. The existing import surface from `packages/server/src/api/appRouter.ts` should remain stable, so `import './routers/games'` still resolves without calling code changes outside the router tree.

## Progress

- [x] (2026-04-08 19:33Z) Audited `packages/server/src/api/routers` and grouped every top-level router with its prefixed sibling files.
- [x] (2026-04-08 19:33Z) Chose the target convention: `packages/server/src/api/routers/<routerName>/index.ts` for the router entry point, shortened filenames inside each folder (`schemas.ts`, `queries.ts`, `mutations.ts`, and so on), and the existing `roomAssignments` helper folder expanded to include its router entry point and schemas.
- [x] (2026-04-08 19:37Z) Moved 111 top-level router files into per-router folders, renamed router entry points to `index.ts`, shortened sibling filenames, and updated relative imports throughout the router tree.
- [x] (2026-04-08 19:37Z) Ran `pnpm tsgo`, `pnpm test`, and `pnpm lint`; fixed `roomAssignments` import-order warnings with `pnpm exec eslint --fix packages/server/src/api/routers/roomAssignments/*.ts`; reran lint cleanly.

## Surprises & Discoveries

- Observation: `roomAssignments` was already partially folderized, but its router entry point and schema files still lived at the top level.
  Evidence: `packages/server/src/api/routers/roomAssignments.ts` imports helpers from `./roomAssignments/*` while `packages/server/src/api/routers/roomAssignments/` already contains planner and assignment modules.

- Observation: The structural move itself compiled and tested cleanly, but `roomAssignments` picked up import-order warnings because `schemas.ts` became a local sibling import.
  Evidence: The first `pnpm lint` run reported 19 `import/order` warnings in `packages/server/src/api/routers/roomAssignments/*.ts`, all resolved by `eslint --fix`.

## Decision Log

- Decision: Keep `packages/server/src/api/appRouter.ts` imports unchanged and rely on directory `index.ts` resolution.
  Rationale: This preserves the public shape of the router import paths while still moving implementation files into folders.
  Date/Author: 2026-04-08 / Codex

- Decision: Rename moved files to shortened names inside each folder instead of keeping repeated router prefixes.
  Rationale: Once a file is inside `routers/<routerName>/`, names like `games.schemas.ts` add noise; `schemas.ts` and `queries.ts` are easier to scan and match the existing `roomAssignments` helper style.
  Date/Author: 2026-04-08 / Codex

## Outcomes & Retrospective

The router tree now matches the intended per-router folder convention. `packages/server/src/api/appRouter.ts` still imports routers as `./routers/<routerName>`, but each path now resolves to a folder entry point with colocated helpers and tests. Validation passed end to end with `pnpm tsgo`, `pnpm test`, and `pnpm lint`.

## Context and Orientation

The tRPC API routers live under `packages/server/src/api/routers`. Before this refactor, most routers were defined by a top-level `*.ts` router entry point alongside prefixed helper files such as `games.schemas.ts`, `games.queries.ts`, and `games.mutations.ts`. `packages/server/src/api/appRouter.ts` imports each router from `./routers/<routerName>`, so a folder with an `index.ts` file can replace a single-file module without changing the import site.

The main router groups are `auth`, `config`, `email`, `gameAssignments`, `gameChoices`, `gameRooms`, `games`, `hotelRoomDetails`, `hotelRooms`, `lookups`, `memberships`, `payments`, `reports`, `roomAssignments`, `settings`, `slots`, `stripe`, `transaction`, and `users`. Some groups have only a router file, while others also have schemas, query helpers, mutation helpers, and tests. `roomAssignments` already has a directory full of helper modules and tests, so this refactor folds its remaining top-level files into that existing folder.

## Plan of Work

Create a folder under `packages/server/src/api/routers/` for each router group. Move the main router file into `index.ts` in that folder. Move each related top-level sibling file whose name starts with the router name into the same folder and rename it by dropping the repeated router prefix. Examples: `packages/server/src/api/routers/games.ts` becomes `packages/server/src/api/routers/games/index.ts`; `packages/server/src/api/routers/games.schemas.ts` becomes `packages/server/src/api/routers/games/schemas.ts`; `packages/server/src/api/routers/users.query.test.ts` becomes `packages/server/src/api/routers/users/query.test.ts`.

After the filesystem moves, update relative imports within the moved files. Imports that previously referenced `./games.schemas` or `./users.query` inside the flat directory should reference `./schemas` or `./query` from inside the new folder. Imports from router files to `../trpc` or `../inRlsTransaction` will usually become `../../trpc` and `../../inRlsTransaction` because `index.ts` now lives one directory deeper. Imports from helper modules back to the API package root similarly need one more `..` segment.

## Concrete Steps

From the repository root `/Users/ggp/dev/git/amber`, perform the refactor with filesystem moves and import updates. Then run:

    pnpm tsgo
    pnpm test
    pnpm lint

Expected outcome: the TypeScript compiler, tests, and lint pass with the new folder layout. If any failure points to a stale import path, fix the import and rerun the failing command.

Executed during implementation:

    pnpm tsgo
    pnpm test
    pnpm lint
    pnpm exec eslint --fix packages/server/src/api/routers/roomAssignments/*.ts
    pnpm lint

## Validation and Acceptance

Acceptance is met when `packages/server/src/api/appRouter.ts` still imports each router as `./routers/<routerName>`, each router now resides in `packages/server/src/api/routers/<routerName>/index.ts`, related helpers and tests are colocated in the same folder, and the repository validation commands complete successfully. A human can verify the structural result by listing `packages/server/src/api/routers` and seeing only router directories rather than the old flat prefixed files.

## Idempotence and Recovery

The move plan is idempotent if applied once to a clean tree. If a command fails mid-refactor, inspect `git status --short` to see which files moved and then continue updating imports against the actual filesystem state. Recovery is safe because the worktree is clean before the refactor and all changes are ordinary renames plus import edits.

## Artifacts and Notes

Key starting evidence:

    packages/server/src/api/appRouter.ts imports routers as ./routers/<routerName>
    packages/server/src/api/routers/roomAssignments.ts imports helpers from ./roomAssignments/*
    packages/server/src/api/routers contains flat groups such as games.ts, games.schemas.ts, games.queries.ts, and games.mutations.ts

## Interfaces and Dependencies

No new external dependencies are required. The relevant internal modules are `packages/server/src/api/appRouter.ts`, `packages/server/src/api/trpc.ts`, `packages/server/src/api/inRlsTransaction.ts`, and every file under `packages/server/src/api/routers`. Each router folder must export the same router symbol from `index.ts` that `appRouter.ts` currently imports, such as `gamesRouter`, `usersRouter`, or `roomAssignmentsRouter`.
