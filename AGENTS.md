# Netofings repository guidance

User instructions take precedence over this file. Guidance inherits from repository root to layer to unit: `/AGENTS.md` defines shared rules, `/<layer>/AGENTS.md` defines a layer's responsibility, and `/<layer>/<unit>/AGENTS.md` defines that unit's stack, commands, and conventions. Child files specialize their parent without repeating it.

## Architecture

| Layer | Current unit | Responsibility |
| --- | --- | --- |
| `apps/` | `frontend`, `cli` | Interactive web and terminal applications |
| `services/` | `backend` | Persistent API, broker, and data capability |
| `clients/` | `agent` | Reusable metric publishing client |

Place code according to responsibility and lifecycle. A finite, standalone executable belongs in `jobs/`. Database migrations belong to `services/backend/`, which owns the schema. Put reusable runtime libraries with real consumers in `packages/` and shared deployment resources in `infrastructure/`. Create a layer when there is a unit that needs it.

Every unit owns its source, tests, dependencies, configuration, and runtime entrypoints. Keep unit-specific Dockerfiles with the unit. Expose cross-unit functionality through public package interfaces. Do not make a reusable client depend on an application or service's private implementation.

## Repository tooling

Each Node.js unit owns its `package.json`, `package-lock.json`, and `Makefile`. Preserve public package names when moving files. Regenerate lockfiles with npm after manifest changes. The root Makefile coordinates unit targets and local infrastructure. The CLI depends on the agent through its local npm package and builds the agent before building the CLI.

The root `docker-compose.yml` includes the unit Compose files. `make up` starts the development stack. Each runnable unit exposes an `up` target with its dependencies. Interactive and example programs run on demand. The production image combines the built frontend with the backend. Its Dockerfile lives at `services/backend/Dockerfile` and uses the repository root as Docker context. The backend owns its migration container and command.

Run the affected units' available build, lint, and meaningful test commands. For cross-unit contracts or deployment changes, check the relevant integration points. Report checks that could not run. Use `make build`, `make lint`, and `make test` at the root or `make -C <unit> <target>` for a focused check.

## Change discipline

Inspect working-tree changes before editing and preserve unrelated work. Keep changes scoped to the requested units. Do not commit, push, publish, or deploy unless explicitly requested. Keep secrets and local environment files out of Git. Comments should explain non-obvious reasons rather than narrate straightforward code.
