#!/bin/bash

#set -x

. ./.env

LOCAL_DATABASE_NAME=${LOCAL_DATABASE_NAME:-acnw2_dev}

echo "Recreating database ${LOCAL_DATABASE_NAME}"

MYSQL_PWD=${LOCAL_PASSWORD} mysql --user=${LOCAL_USER} --default-character-set=utf8  << EOF
DROP DATABASE IF EXISTS ${LOCAL_DATABASE_NAME};
CREATE DATABASE ${LOCAL_DATABASE_NAME} DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
EOF

echo "Inserting knex records"
# remove if kex-migrate fixes it's issue

MYSQL_PWD=${LOCAL_PASSWORD} mysql --user=${LOCAL_USER} \
  --default-character-set=utf8 --database=${LOCAL_DATABASE_NAME} << 'EOF'
DROP TABLE IF EXISTS `knex_migrations`;
CREATE TABLE `knex_migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `batch` int(11) DEFAULT NULL,
  `migration_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
DROP TABLE IF EXISTS `knex_migrations_lock`;
CREATE TABLE `knex_migrations_lock` (
  `is_locked` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO `knex_migrations_lock` VALUES (0);
EOF

# Create schema in a acnw-1 format
./node_modules/.bin/knex-migrate up 20171015105936-acnw-1-schema.js

echo "Loading data from latest live acnw database"

/usr/local/bin/plink -ssh -pw ${KEYSTOR_PASSWORD} -P ${ACNW1_SSH_PORT} -noagent -l ${REMOTE_USER} ${ACNW1_HOST} \
  MYSQL_PWD=${REMOTE_DATABASE_PASSWORD} /usr/bin/mysqldump --max_allowed_packet=1G --skip-add-locks --skip-comments --skip-extended-insert \
  --compress --single-transaction --quick --routines --triggers --hex-blob --no-create-info \
  --default-character-set=utf8 \
  --user=${REMOTE_DATABASE_USER} ${REMOTE_DATABASE_NAME} |
MYSQL_PWD=${LOCAL_PASSWORD} mysql --user=${LOCAL_USER} \
  --default-character-set=utf8 --database=${LOCAL_DATABASE_NAME}

./node_modules/.bin/knex-migrate up
