#!/usr/bin/env sh

FILE=./version.ts
if [ -d .git ]
then
  val=$(git show --no-patch --no-notes --pretty='{ hash: "%H", date: "%cI" }' HEAD)
else
  d=$(date -Iseconds)
  val="{ hash: \"dev\", date: \"$d\" }"
fi
echo "export const gitHash=$val" > $FILE
