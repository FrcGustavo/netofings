# Netofings

Netofings monitors agents through a web dashboard, API, and terminal client. Each unit manages its own dependencies with npm. Make coordinates local development and builds.

## Repository layout

| Path | Responsibility | npm package |
| --- | --- | --- |
| `apps/frontend/` | React and Vite dashboard | `frontend` |
| `apps/cli/` | Terminal monitoring application | `@netofings/cli` |
| `services/backend/` | NestJS API, broker, persistence, and database migrations | `backend` |
| `clients/agent/` | Metric publishing client used by the CLI and external consumers | `@netofings/agent` |

Repository guidance follows the root, layer, and unit `AGENTS.md` files. Each unit owns its source, tests, dependencies, and configuration. Add shared infrastructure or finite jobs only when there is an actual shared resource or standalone process; backend database migrations remain with `services/backend/`.

## Requirements

- Make and Docker with Compose 2.24 or later for the containerized environment
- Node.js 24 and npm 11 for host-side builds and checks

## Development

```bash
make up
```

Open the dashboard at `http://localhost:5173`. The API is available at `http://localhost:3000/api`, MQTT at `mqtt://localhost:1883`, and pgAdmin at `http://localhost:5050`. Compose starts PostgreSQL and applies the backend migrations before starting the API. `make ps` shows the running services, `make logs` follows their logs, and `make down` removes the containers while preserving database volumes.

Start a unit and its dependencies independently:

```bash
make backend                  # API, MQTT broker, migrations, and PostgreSQL
make frontend                 # Dashboard plus the backend and its dependencies
make -C services/backend up    # Same as make backend, from the unit Makefile
make -C apps/frontend up      # Same as make frontend, from the unit Makefile
```

The interactive CLI and agent example use separate containers on demand. Export `NETOFINGS_AGENT_TOKEN` with a token created in the dashboard before running the monitor or publishing metrics. The agent example measures the container where it runs.

```bash
make cli ARGS='--help'
make cli ARGS='monitor'
make agent-example
```

The unit equivalents are `make -C apps/cli up ARGS='monitor'` and `make -C clients/agent up`. Compose uses local development defaults, with optional `.db.env`, `.pgadmin.env`, and `.redis.env` overrides from the repository root and `services/backend/.env` for API settings. Use the same PostgreSQL credentials as your existing volume if you reuse one. Each unit also exposes its host-side commands through its Makefile.

## Build and checks

From the repository root:

```bash
make install
make build
make lint
make test
```

Use `make -C services/backend test` or `make -C apps/cli test` to run a single test suite. The CLI Makefile builds the local agent package before it builds the CLI. Run `make help` for the available root targets.

## Container build

The production image builds the frontend and backend with their respective lockfiles. The Makefile calls `services/backend/Dockerfile` with the repository root as the build context:

```bash
make image IMAGE=netofings
```

The backend serves the built frontend in the combined image. Run database migrations with `make -C services/backend migrations-run`.
