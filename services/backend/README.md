# Netofings Backend

Backend API and broker integration for Netofings, built with NestJS.

## Responsibilities

- Exposes HTTP API under `/api`.
- Subscribes to MQTT events from agents.
- Persists agents and metrics in PostgreSQL.
- Serves data used by frontend and CLI.

## Tech stack

- NestJS
- TypeORM
- PostgreSQL
- MQTT transport (`mqtt://localhost:1883` by default)

## Environment variables

This app reads database values from environment variables:

- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `PORT` (optional, default `3000`)

## Local development

From the repository root:

```bash
make backend
```

From this directory, `make up` starts the same Docker services. Compose applies migrations before starting the backend. To run the backend on the host instead:

```bash
make install
make dev
```

## Scripts

- `npm run build`
- `npm run start`
- `npm run start:dev`
- `npm run start:prod`
- `npm run lint`
- `npm run test`
- `npm run test:e2e`

## Migrations

```bash
npm run migrations:generate -- <name>
make migrations-run
```

When upgrading a legacy database with integer agent and metric IDs, the initial migration moves the old tables and their data to `netofings_legacy` before creating the current schema. The application uses the new tables in `public`. Legacy agents had no account ownership, so their records remain available for inspection in the archive.

## Notes

- Global API prefix is `api`.
- MQTT microservice and HTTP server start together from `src/main.ts`.
