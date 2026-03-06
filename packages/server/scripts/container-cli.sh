#!/usr/bin/env bash

set -euo pipefail

CONTAINER_CLI="${AMBER_CONTAINER_CLI:-docker}"

exec "${CONTAINER_CLI}" "$@"
