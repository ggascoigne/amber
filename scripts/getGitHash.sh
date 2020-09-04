#!/usr/bin/env sh

echo "export const gitHash='$(git rev-parse HEAD)'" > src/version.ts
