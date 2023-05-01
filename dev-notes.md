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

