#!/usr/local/bin/bash
#set -x
source ./.env.aws-prod

function vc_secrets() {
  echo Y | now secrets rm $1 >/dev/null 2>&1
  vc secrets add $1 $2
}

vc_secrets database_host "${DATABASE_HOST}"
vc_secrets database_name "${DATABASE_NAME}"
vc_secrets database_admin "${DATABASE_ADMIN}"
vc_secrets database_admin_password "${DATABASE_ADMIN_PASSWORD}"
vc_secrets database_user "${DATABASE_USER}"
vc_secrets database_user_password "${DATABASE_USER_PASSWORD}"
vc_secrets database_port "${DATABASE_PORT}"
vc_secrets database_ssl "${DATABASE_SSL}"
vc_secrets database_ssl_cert "${DATABASE_SSL_CERT}"
vc_secrets auth0_domain "${REACT_APP_AUTH0_DOMAIN}"
vc_secrets auth0_client_id "${REACT_APP_AUTH0_CLIENT_ID}"

vc_secrets smtp_username "${SMTP_USERNAME}"
vc_secrets smtp_password "${SMTP_PASSWORD}"
vc_secrets smtp_host "${SMTP_HOST}"
vc_secrets smtp_port "${SMTP_PORT}"
