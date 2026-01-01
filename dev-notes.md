# Developer Notes

## Logging

Both the front and backends use [debug](https://github.com/debug-js/debug) for logging, I like this since it has a symmetrical api on both sides.

Logging is configured based on structured names. All of the logging in this app has a name that starts with "amber", the next.js library uses the "next" prefix.

Server side logging is configured by setting the `DEBUG` variable to a string containing a comma separate list of log names.

e.g.

```sh
$ DEBUG='amber:server:*,amber:db:query' pnpm dev:nw
```

Client side is set by setting

```
localStorage.debug = 'amber:*'
```

or the like in the browser console.

If you want the full firehose then you can set `DEBUG='\*'. On the UI side, that's pretty reasonable, but on the backend it's likely too noisy to be useful. Next.js uses this same system and uses it a lot.

These packages all use the "amber" prefix, followed by the package name:

[Prisma](https://www.prisma.io/) logging in sent to `"amber:db"` with the the Prisma logging types as further differentiators. `"amber:db:query"` or `"amber:db:info"` likely being the two most interesting options.

[TRPC](https://trpc.io/docs/) logging is configured with `"amber:trpc"`.

You can use negations such as `DEBUG='*,-next:*,-prisma:*,-send,-compression' pnpm dev:nw` - for further details see the main docs at [debug](https://github.com/debug-js/debug).

## TimeZones on Mac

In Ventura this is tricky to do un the gui, but you can do it from the command line.

### Get the current TZ

```sh
sudo systemsetup -gettimezone
```

### Disable network time

You can't change any of this without disabling NTP

```sh
sudo systemsetup -setusingnetworktime off
```

### set your new TZ

```sh
sudo systemsetup -settimezone GMT
```

### Restore everything

Once you're done

```sh
sudo systemsetup -settimezone America/Los_Angeles
sudo systemsetup -setusingnetworktime on
```

## Issues with serverless function size

run:

```sh
NEXT_DEBUG_FUNCTION_SIZE=1 vercel build
```

Note that this builds acnw by default, but for this sort of problem that's probably sufficient.

This will log the sizes of the various libraries that are taking up your serverless function space. Use that information to edit `outputFileTracingExcludes` entry in the `next.config.js`.

# Testing with Stripe

There's an annoying circular reference when trying to test Stripe on a Preview build. The Auth0 path defaults to the randomly generated hostname, but the Stripe webhook need to be created with a known host before you can get the webhook secret, and that needs to be passed in as an environment variable and build time, before you know what the hostname will be.

To work around this you need to do a few things.

Push your branch to git, a branch like ggp/stripe-payments will be deployed with a random name as well as a redirect to a predictable name such as https://amberconnw-git-ggp-stripe-payments-wyrdrune.vercel.app/.

Create new environment variables that are applied to the Preview environment, and most importantly, only applied to this new branch.

set APP_BASE_URL=https://amberconnw-git-ggp-stripe-payments-wyrdrune.vercel.app/ or whatever the branch deployment url is. Without this you can't login.

set STRIPE_WEBHOOK_SECRET= the secret you get when you reveal it for the new webhook that you add at https://dashboard.stripe.com/test/webhooks. Note that for the above url, the webhook address is
https://amberconnw-git-ggp-stripe-payments-wyrdrune.vercel.app/api/stripe/webhooks

## Testing Stripe locally

Update the stripe cli tools, on mac that's `brew upgrade stripe`

login - `stripe login`, make sure that the webhook signing secret matches what's in your .env file

run `stripe listen --forward-to http://localhost:30000/api/stripe/webhooks` or port 30001 for acus

Make sure that you don't have ZScaler running in "Internet Security" mode unless you can get your IT admin to allow stripe passthrough. If you start getting weird stripe connectivity errors, this was it for me.

## Package hierarchy

```
ambercon (root)
│
├── Configuration Packages
│   └── @amber/tsconfig ────────────────── TypeScript base configurations
│
├── Infrastructure Layer
│   ├── @amber/environment ────────────── Environment config & validation
│   └── @amber/server ─────────────────── Database setup & migrations, tRPC server & Prisma client
│       └── depends on:
│           └── @amber/environment
│
├── Service Layer
│   ├── @amber/api ────────────────────── Server-side API implementations
│   │   └── depends on:
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
│           ├── @amber/server
│           └── @amber/ui
│
├── Testing Layer
│   └── @amber/playwright ─────────────── Shared Playwright test utilities
│       └── depends on:
│           └── @playwright/test
│
└── Applications
    ├── acnw ──────────────────────────── AmberCon NW (Next.js :30000)
    │   └── depends on:
    │       ├── @amber/amber
    │       ├── @amber/api
    │       ├── @amber/client
    │       ├── @amber/environment
    │       ├── @amber/playwright
    │       ├── @amber/server
    │       └── @amber/ui
    └── acus ──────────────────────────── AmberCon US (Next.js :30001)
        └── depends on:
            ├── @amber/amber
            ├── @amber/api
            ├── @amber/client
            ├── @amber/environment
            ├── @amber/playwright
            ├── @amber/server
            └── @amber/ui
```

This project is a pnpm monorepo with packages in the apps and packages folders. The project is two next.js and react based web apps, with two separate sites, acnw and acus, both in the apps folder. Their shared dependencies are all in the packages folder.

The project uses Auth0 as an auth system using @auth0/nextjs-auth0.

Much of the build can be tested by running `pnpm tsgo` that runs tsgo on every relevant package.
