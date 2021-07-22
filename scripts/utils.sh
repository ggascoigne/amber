function cleanDb () {
  user=$1
  database=$2
  connectionString=$3

# use this since dropdb barfs is there's an open connection
# and I tend to leave postico or intellij connected, and this drops those connections
# note that this might seem more complex than necessary, but it works on RDS too
/usr/local/bin/psql ${connectionString} > /dev/null << EOF
DROP DATABASE IF EXISTS temporary_db_that_shouldnt_exist;
CREATE DATABASE temporary_db_that_shouldnt_exist with OWNER ${user};
\\connect temporary_db_that_shouldnt_exist
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${database}';
DROP DATABASE IF EXISTS ${database};
CREATE DATABASE ${database} WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8';
ALTER DATABASE ${database} OWNER TO ${user};
\\connect ${database}
DROP DATABASE IF EXISTS temporary_db_that_shouldnt_exist;
EOF
}

# yes it relies on globals, but it still saves typing
function getPgString () {
  echo "postgresql://${DATABASE_ADMIN}:${DATABASE_ADMIN_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}$([ -n "$DATABASE_SSL" ] && echo '?sslmode=require')"
}
