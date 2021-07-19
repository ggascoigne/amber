#!/bin/bash
#set -x

BACKUP_DIR=~/Documents/Acnw-Backups
mkdir -p ${BACKUP_DIR}

source `dirname $0`/utils.sh

while read line; do export $line; done < <(grep DATABASE .env.aws-prod | egrep -v '^#')
PG_ARGS=$(getPgString)

DATE=`date "+%m%d%Y.%H%M"`
OUTPUT=${DATABASE_NAME}.${DATE}.dump

echo backup run at ${DATE}

/usr/local/bin/pg_dump ${PG_ARGS} -Fc --schema=public > ${BACKUP_DIR}/${OUTPUT}

cmp ${BACKUP_DIR}/${OUTPUT} ${BACKUP_DIR}/latest
if [ $? -ne 0 ] ; then
  echo backup changed, compressing and re-linking
  ln -fs ${OUTPUT} ${BACKUP_DIR}/latest
else
  echo backup unchanged
  rm ${BACKUP_DIR}/${OUTPUT}
fi
