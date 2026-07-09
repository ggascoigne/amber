#!/usr/bin/env sh

echo "Node: $(node --version)" 
echo "pnpm: $(pnpm --version)"

rm -rf apps/*/.next

pnpm i

if ! pnpm tsgo ; then 
  retVal=$?
  echo "exiting due to build error"
  exit $retVal
fi

if ! pnpm lint ; then 
  retVal=$?
  echo "exiting due to build error"
  exit $retVal
fi

if ! pnpm format --check ; then 
  retVal=$?
  echo "exiting due to build error"
  exit $retVal
fi

if ! CI=true pnpm run test ; then
  retVal=$?
  echo "exiting due to build error"
  exit $retVal
fi


if ! pnpm -r --sequential test:e2e ; then
  retVal=$?
  echo "exiting due to build error"
  exit $retVal
fi
