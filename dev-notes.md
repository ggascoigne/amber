# Various dev notes

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

This will log the sizes of the various libraries that are taking up your serverless function space.  Use that information to edit `outputFileTracingExcludes` entry in the `next.config.js`.


# Testing with Stripe

There's an annoying circular reference when trying to test Stripe on a Preview build.  The Auth0 path defaults to the randomly generated hostname, but the Stripe webhook need to be created with a known host before you can get the webhook secret, and that needs to be passed in as an environment variable and build time, before you know what the hostname will be.

To work around this you need to do a few things.

Push your branch to git, a branch like ggp/stripe-payments will be deployed with a random name as well as a redirect to a predictable name such as https://amberconnw-git-ggp-stripe-payments-wyrdrune.vercel.app/.

Create new environment variables that are applied to the Preview environment, and most importantly, only applied to this new branch.

set AUTH0_BASE_URL=https://amberconnw-git-ggp-stripe-payments-wyrdrune.vercel.app/ or whatever the branch deployment url is.  Without this you can't login.

set STRIPE_WEBHOOK_SECRET= the secret you get when you reveal it for the new webhook that you add at https://dashboard.stripe.com/test/webhooks.  Note that for the above url, the webhook address is 
https://amberconnw-git-ggp-stripe-payments-wyrdrune.vercel.app/api/stripe/webhooks

## Testing Stripe locally

Update the stripe cli tools, on mac that's `brew upgrade stripe`

login - `stripe login`, make sure that the webhook signing secret matches what's in your .env file

run `stripe listen --forward-to http://localhost:30000/api/stripe/webhooks` or port 30001 for acus

Make sure that you don't have ZScaler running in "Internet Security" mode unless you can get your IT admin to allow stripe passthrough.  If you start getting weird stripe connectivity errors, this was it for me.

## Package hierarchy


api -> (depends on) database
amber -> database (via getServerSideProps, which in turn depends on client)
acnw/pages -> api
acus -> api
amber -> api (though not for much)
acnw -> amber
acus -> amber
amber -> ui
amber -> client
api -> client
cli/script tools depend on database

client doesn't directly depend on database, but is generated from the postgres database which is in turn generated from database

acnw -> amber ->  database
                  ui
                  api
                  client (graphql)
        api ->    database
                  client (graphql)

Plan:

client gets deleted

server depends on database

cli/script tools depend on database

api gets replaced by server
