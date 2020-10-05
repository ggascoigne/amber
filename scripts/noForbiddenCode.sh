#!/bin/bash

RESTORE='\033[0m'
RED='\033[00;31m'
YELLOW='\033[00;33m'
BLUE='\033[00;34m'

FORBIDDEN=( 'DO NOT COMMIT' 'DO-NOT-COMMIT' 'debugger' )
FOUND=''

for j in "${FORBIDDEN[@]}"
do
  for i in `git diff --cached --name-only | grep -v $(basename $0) | grep -v eslint`
  do

    # the trick is here...use `git show :file` to output what is staged
    # test it against each of the FORBIDDEN strings ($j)

    if echo `git show :$i` | grep -iq "$j"; then

      FOUND+="${BLUE}$i ${RED}contains ${RESTORE}\"$j\"${RESTORE}\n"

    fi
  done
done

# if FOUND is not empty, REJECT the COMMIT
# PRINT the results (colorful-like)

if [[ ! -z $FOUND ]]; then
  printf "${YELLOW}COMMIT REJECTED\n"
  printf "$FOUND"
  exit 1
fi
