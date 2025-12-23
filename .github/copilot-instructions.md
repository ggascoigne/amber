# AmberCon Project AI Instructions

## Architecture Overview

This is a **pnpm monorepo** with two separate Next.js convention management sites (acnw, acus) sharing common infrastructure through workspace packages. The architecture follows a layered dependency model:

```
Infrastructure: @amber/environment → @amber/server
Services: @amber/api (server-side) → @amber/client (tRPC hooks)
UI: @amber/ui (components) → @amber/amber (aggregator)
Apps: acnw (port 30000), acus (port 30001), ui-test (port 30003)
```

**Key architectural decisions:**

- **tRPC for type-safe API**: Server routers in `packages/server/src/api/routers/`, consumed via `useTRPC()` hook in components
- **Prisma with PostgreSQL**: Schema at `packages/server/prisma/schema.prisma`, generates client to `packages/server/src/generated/prisma`
- **Row-Level Security (RLS)**: All database queries wrap in `inRlsTransaction()` which sets PostgreSQL session variables for `user.id` and `user.admin`
- **Auth0 integration**: Using `@auth0/nextjs-auth0`, user context flows through tRPC context
- **Dual database management**: Knex for migrations (`packages/server/support/db/migrations/`), Prisma for queries

## Critical Developer Workflows

### Development

```bash
# Start ACNW site (runs migrations + boots app)
pnpm dev:nw  # Starts on port 30000

# Start ACUS site
pnpm dev:us  # Starts on port 30001

# Database setup (requires local backup - see dev notes)
DB_ENV=acnw pnpm -F server db:import
pnpm -F server db:start  # Starts Docker PostgreSQL
```

### Database Operations

```bash
# Generate new migration (sets DB_ENV=acnw by default)
pnpm db:generate [name]

# Run migrations for specific env
DB_ENV=acnw pnpm -F server db:migrate:up

# Pull schema changes from DB to Prisma
DB_ENV=acnw pnpm -F server prisma:db:pull
```

### Testing & Validation

```bash
pnpm test        # Runs vitest suite
pnpm tsgo        # Type-check all packages (preferred over tsc)
pnpm lint        # ESLint (oxlint exists, but isn't generally run since it lacks thorough coverage)
pnpm format      # Prettier (auto-fixes)
```

## Project-Specific Code Conventions

### TypeScript Preferences (AGENTS.md)

- **Function expressions over declarations**: `const foo = () => {}` not `function foo() {}`
- **Explicit types for component props**: `type FooProps = {...}` directly before component
- **Prefer `type` over `interface`**: Unless extending is needed
- **Descriptive generic names**: `Array<Game>` over `Game[]`, no single-letter types
- **Avoid React.FC**: Direct function components with typed props
- **Strict null checks**: `thing ? 'value' : null` over `thing && 'value'` (especially in JSX)

### Prettier Configuration (package.json)

```json
{
  "printWidth": 120,
  "singleQuote": true,
  "semi": false,
  "jsxSingleQuote": true
}
```

### Package-Specific Patterns

**tRPC Router Pattern** (`packages/server/src/api/routers/`):

```typescript
export const gamesRouter = createTRPCRouter({
  getByYear: publicProcedure
    .input(z.object({ year: z.number() }))
    .query(async ({ input, ctx }) =>
      inRlsTransaction(ctx, async (tx) => tx.game.findMany({ where: { year: input.year } })),
    ),
})
```

**Client Usage** (components):

```typescript
const trpc = useTRPC()
const { data: games } = useQuery(trpc.games.getByYear.queryOptions({ year: 2024 }))
```

## Integration Points & Data Flow

### Authentication Flow

1. Auth0 handles login at `/api/auth/[auth0]` (via `@auth0/nextjs-auth0`)
2. Session data passes to tRPC context in `packages/server/src/api/context.ts`
3. RLS enforcement: `inRlsTransaction()` sets `user.id` and `user.admin` PostgreSQL session vars
4. Database policies enforce access control at row level

### Configuration & Environment

- **Environment files**: Each app has `.env` for dev, `.env.test` for testing
- **DB_ENV variable**: Switches between acnw/acus databases (`DB_ENV=acnw` or `DB_ENV=acus`)
- **Runtime config**: Loaded via tRPC `settings.getSettings` query, provided through `ConfigProvider`
- **Logging**: Uses `debug` library, configure with `DEBUG='amber:*'` (server) or `localStorage.debug = 'amber:*'` (client)

### MDX Content

- Content files in `apps/{acnw,acus}/content/*.mdx`
- Frontmatter parsed with `remark-mdx-frontmatter`, exported as `metadata`
- MDX components registered in `mdx-components.tsx` at app root

## Package Responsibility Map

| Package              | Purpose                                    | Import Examples                                          |
| -------------------- | ------------------------------------------ | -------------------------------------------------------- |
| `@amber/environment` | Config validation, connection strings      | `import { processEnv, isDev } from '@amber/environment'` |
| `@amber/server`      | Prisma client, tRPC routers, auth context  | `import { db } from '@amber/server'`                     |
| `@amber/api`         | Server-side business logic, email, Stripe  | `import { sendEmail } from '@amber/api/email'`           |
| `@amber/client`      | tRPC hooks, client utilities               | `import { useTRPC } from '@amber/client'`                |
| `@amber/ui`          | Reusable MUI components                    | `import { GraphQLError } from '@amber/ui'`               |
| `@amber/amber`       | High-level app components, config provider | `import { RootComponent } from '@amber/amber'`           |

## Common Gotchas

1. **Database context switching**: Always set `DB_ENV=acnw` or `DB_ENV=acus` for database operations
2. **RLS requirements**: Never use raw Prisma client - always wrap queries in `inRlsTransaction(ctx, async (tx) => ...)`
3. **Prisma generation**: Run `pnpm -F server prisma:generate` after schema changes
4. **Package filtering**: Use `-F` flag for workspace operations: `pnpm -F acnw dev`
5. **Boot before dev**: Apps auto-run `boot` script (migrations + git hash) before starting dev server
6. **Next.js transpilePackages**: Required for `@amber/*` and MUI packages (see `next.config.js`)

## Important Files to Reference

- [AGENTS.md](../AGENTS.md) - Full package hierarchy, coding preferences
- [dev-notes.md](../dev-notes.md) - Logging, timezone testing, Stripe setup
- [packages/server/prisma/schema.prisma](../packages/server/prisma/schema.prisma) - Database schema
- [packages/server/src/api/trpc.ts](../packages/server/src/api/trpc.ts) - tRPC initialization with middleware
- [packages/server/src/api/inRlsTransaction.ts](../packages/server/src/api/inRlsTransaction.ts) - RLS pattern
- [.github/copilot-instructions-playwright.md](.github/copilot-instructions-playwright.md) - Accessibility-first testing patterns
