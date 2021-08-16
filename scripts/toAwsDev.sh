#!/bin/bash
#set -x

echo "dont run this until you verify that the database permissions are going to be correct"
exit 1

source `dirname $0`/utils.sh

while read line; do export $line; done < <(grep DATABASE .env.aws-prod | egrep -v '^#')
PG_INPUT_ARGS=$(getPgString)
ORIGINAL_DATABASE_NAME=${DATABASE_NAME}

while read line; do export $line; done < <(grep DATABASE .env.aws-dev | egrep -v '^#')
PG_OUTPUT_ARGS=$(getPgString)

cleanDb ${DATABASE_ADMIN} ${DATABASE_NAME} ${PG_OUTPUT_ARGS} 2>&1 | grep -v NOTICE

/usr/local/bin/pg_dump ${PG_INPUT_ARGS} -Fc --schema=public > ${ORIGINAL_DATABASE_NAME}.dump

export PGHOST=${DATABASE_HOST}
export PGPORT=${DATABASE_PORT}
export PGUSER=${DATABASE_ADMIN}
export PGPASSWORD=${DATABASE_ADMIN_PASSWORD}

echo "expect a warning about 3 errors since we can't run as superuser on RDS"

/usr/local/bin/pg_restore \
  -j4 \
  --clean \
  -d ${DATABASE_NAME} \
  --no-privileges \
  --no-owner \
  --if-exists \
  ${ORIGINAL_DATABASE_NAME}.dump

echo Done
