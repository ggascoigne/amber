# Project Overview

This project is a pnpm monorepo with packages in the apps and packages folders.
The project is two next.js and react based web apps, with two separate sites,
acnw and acus, both in the apps folder. Their shared dependencies are all in the
packages folder (see below).

This is a React, TypeScript, Next.js project, using @mui and trpc.

## Package hierarchy

```
ambercon (root)
│
├── Configuration Packages
│   └── @amber/tsconfig ────────────────── TypeScript base configurations
│
├── Infrastructure Layer
│   ├── @amber/environment ────────────── Environment config & validation
│   ├── @amber/database ───────────────── Database setup & migrations
│   │   └── depends on:
│   │       └── @amber/environment
│   └── @amber/server ─────────────────── tRPC server & Prisma client
│       └── depends on:
│           ├── @amber/database
│           └── @amber/environment
│
├── Service Layer
│   ├── @amber/api ────────────────────── Server-side API implementations
│   │   └── depends on:
│   │       ├── @amber/database
│   │       ├── @amber/environment
│   │       └── @amber/server
│   └── @amber/client ─────────────────── tRPC hooks & client utilities
│       └── depends on:
│           ├── @amber/api
│           └── @amber/server
│
├── UI Layer
│   ├── @amber/ui ─────────────────────── Reusable UI components library
│   └── @amber/amber ──────────────────── Main component aggregator
│       └── depends on:
│           ├── @amber/api
│           ├── @amber/client
│           ├── @amber/database
│           ├── @amber/server
│           └── @amber/ui
│
└── Applications
    ├── acnw ──────────────────────────── AmberCon NW (Next.js :30000)
    │   └── depends on:
    │       ├── @amber/amber
    │       ├── @amber/api
    │       ├── @amber/client
    │       ├── @amber/database
    │       ├── @amber/environment
    │       ├── @amber/server
    │       └── @amber/ui
    └── acus ──────────────────────────── AmberCon US (Next.js :30001)
        └── depends on:
            ├── @amber/amber
            ├── @amber/api
            ├── @amber/client
            ├── @amber/database
            ├── @amber/environment
            ├── @amber/server
            └── @amber/ui
```

The project uses Auth0 as an auth system using @auth0/nextjs-auth0.

## Development instructions

- Respect my prettier settings, code can be reformatted using `pnpm format`.
- I prefer function expressions over function declarations.
- I prefer all Typescript to assume strict mode
- I prefer: `thing ? 'whatever' : null` over `thing && 'whatever'` (especially
  in JSX).
- I like descriptive TypeScript type names (no one-letter type names for me). I
  also prefer the Array generic over the bracket syntax.
- I prefer to avoid using React.FC
- I generally prefer using types to interfaces
- I prefer the pattern where if a component is called Foo, then it's properties
  are called props and their type is FooProps, and FooProps will be defined
  directly before the component.

## Testing Instructions

- run `pnpm tsgo` to run the native typescript compiler and validate the
  typescript.
- run `pnpm test` to run the sadly small set of tests
- run `pnpm lint` to run the lint rules.
