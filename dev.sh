#!/usr/bin/env bash
eval "$(fnm env)"

fnm use
pnpm db:start
vc dev -l 30000
