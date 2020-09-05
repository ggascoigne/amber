#!/usr/local/bin/bash
#set -x
source ./.env.aws-prod

function now_secrets() {
  echo Y | now secrets rm $1 >/dev/null 2>&1
  now secrets add $1 $2
}

now_secrets database_host "${DATABASE_HOST}"
now_secrets database_name "${DATABASE_NAME}"
now_secrets database_user "${DATABASE_USER}"
now_secrets database_password "${DATABASE_PASSWORD}"
now_secrets database_port "${DATABASE_PORT}"
now_secrets database_ssl "${DATABASE_SSL}"
now_secrets database_ssl_cert "${DATABASE_SSL_CERT}"
now_secrets auth0_domain "${REACT_APP_AUTH0_DOMAIN}"
now_secrets auth0_client_id "${REACT_APP_AUTH0_CLIENT_ID}"
