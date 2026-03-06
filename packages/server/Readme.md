# packages/server

Database management code - schema and migration is managed using knex and lives under support, other scripts etc live under ./scripts
Prisma schema and access functions - under prisma
TRPC server routes - under src

Container-backed database scripts default to Docker. To use Podman on one
machine without changing the repo default, export
`AMBER_CONTAINER_CLI=podman` before running the `db:*` scripts.
