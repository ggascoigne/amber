# First time setup

unzip the attached zip with the various .env files into `./apps/acus`

These examples use pnpm, if you're using something else, remember that my alias is pn=pnpm.

Ensure that you have all node modules installed:

```bash
$ pn i
```

Run docker

```bash
$ pn --filter database db:docker:up
```

This runs a postgres server on port 54320.

use whatever postgres tool you like to create an empty database on that server called `acus`.

I use:

```
ADMIN_DATABASE_URL="postgres://ggp:@127.0.0.1:54320/acus"
DATABASE_URL="postgres://acnw_user:123456@127.0.0.1:54320/acus"
```

You don't have to use these, but you do need 2 accounts, and they need to match the ones in the env files.

Note that .env.local.back is the important one, and should by default match .env.  The scripts that copy data between database instances depend on these file names, and also at some points replace the .env file and then put it back.


Once you've created a database:

```bash
$ DB_ENV=acus ./scripts/toLocal.sh
```

You should get some output like this:

```
using: postgres://ggp:*****@127.0.0.1:54320/acus
using postgresql://ggp:@127.0.0.1:54320/acus
resetting database owner for acnw_user... done
Done
```

Then run:

```bash
$ pn dev:us
```
