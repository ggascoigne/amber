#!/bin/bash
set -x

. ./.env

OUTPUT=./acnw2_data.sql

mysqldump --max_allowed_packet=1G --skip-add-locks --skip-comments --skip-extended-insert  \
  --create-options --single-transaction --quick --routines --triggers --hex-blob \
  --default-character-set=utf8 --user=${LOCAL_DATABASE_USER} --password=${LOCAL_DATABASE_PASSWORD} ${LOCAL_DATABASE_NAME} \
  > ${OUTPUT}

