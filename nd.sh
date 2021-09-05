#!/usr/bin/env bash
eval "$(fnm env)"

fnm use
yarn db:start
vc dev -l 30000
