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
npm run start:dev --workspace=backend
```

Or from this folder:

```bash
npm run start:dev
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
npm run migrations:generate --workspace=backend -- <name>
npm run migrations:run --workspace=backend
```

## Notes

- Global API prefix is `api`.
- MQTT microservice and HTTP server start together from `src/main.ts`.
