# Netofings

Monorepo de Netofings, evolucionado desde el proyecto original del curso [Advanced Node.js Course](https://platzi.com/clases/nodejs/) de Platzi.

## Estructura refactorizada

El código nuevo vive dentro de `src/` usando workspaces de npm y Turbo.

### Apps (`src/apps`)

- `backend` (`src/apps/backend`): API y servicios en NestJS.
- `frontend` (`src/apps/frontend`): dashboard web en React + Vite.

### Packages (`src/packages`)

- `@netofings/agent` (`src/packages/agent`): cliente/agente que recolecta y publica métricas.
- `@netofings/cli` (`src/packages/cli`): CLI para monitoreo en terminal.

## Proyectos legacy (compatibilidad)

Estos folders siguen en el repo como referencia o compatibilidad mientras se completa la migración:

- `netofingsagent/`
- `netofingsapi/`
- `netofingsCli/`
- `netofingsdb/`
- `netofingsmqtt/`
- `netofingsWeb/`

## Requisitos

- Node.js 20+
- npm 11+
- Docker (opcional, para infraestructura local)

## Instalación

```bash
npm install
```

## Comandos del monorepo

Desde la raíz del proyecto:

```bash
npm run build
npm run dev
npm run lint
npm run test
```

Estos scripts ejecutan tareas sobre workspaces usando Turbo (`turbo.json`).

## Comandos por proyecto

### Backend

```bash
npm run start:dev --workspace=backend
npm run test --workspace=backend
```

### Frontend

```bash
npm run dev --workspace=frontend
npm run build --workspace=frontend
```

### Agent package

```bash
npm run build --workspace=@netofings/agent
npm run example --workspace=@netofings/agent
```

### CLI package

```bash
npm run build --workspace=@netofings/cli
npm run dev --workspace=@netofings/cli
```

## Infra local

Existe `docker-compose.yml` en la raíz para levantar dependencias locales (por ejemplo broker, base de datos y servicios auxiliares) según tu flujo.