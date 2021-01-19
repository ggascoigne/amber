#!/usr/bin/env sh

echo "export const gitHash=$(git show --no-patch --no-notes --pretty='{ hash: "%H", date: "%cI" }' HEAD)" > src/version.ts
