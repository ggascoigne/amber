# Migrations

If you add migrations you need to sync the code with Prisma.

Specifically, run this:

pn -F acnw boot
DATABASE_URL="postgres://acnw_user:123456@127.0.0.1:54320/acnw" pn -F @amber/server prisma:db:pull
pn -F @amber/server postinstall
