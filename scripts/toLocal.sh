#!/bin/bash
#set -x

source `dirname $0`/utils.sh

cd `dirname $0`/..

while read line; do export $line; done < <(grep DATABASE ./apps/${DB_ENV}/.env.aws-prod | egrep -v '^#')
PG_INPUT_ARGS=$(getPgString)
ORIGINAL_DATABASE_NAME=${DATABASE_NAME}

while read line; do export $line; done < <(grep DATABASE ./apps/${DB_ENV}/.env.local.bak | egrep -v '^#')
PG_OUTPUT_ARGS=$(getPgString)

cleanDb ${DATABASE_ADMIN} ${DATABASE_NAME} ${PG_OUTPUT_ARGS} 2>&1 | grep -v NOTICE

/usr/local/bin/pg_dump ${PG_INPUT_ARGS} -Fc --schema=public > ${ORIGINAL_DATABASE_NAME}.dump

export PGHOST=${DATABASE_HOST}
export PGPORT=${DATABASE_PORT}
export PGUSER=${DATABASE_ADMIN}
export PGPASSWORD=${DATABASE_ADMIN_PASSWORD}

/usr/local/bin/pg_restore \
  -j4 \
  --clean \
  -d ${DATABASE_NAME} \
  --no-privileges \
  --no-owner \
  --clean \
  --if-exists \
  --exit-on-error \
  ${ORIGINAL_DATABASE_NAME}.dump

./packages/database/scripts/resetDatabaseOwner.ts

rm ${ORIGINAL_DATABASE_NAME}.dump

echo Done
