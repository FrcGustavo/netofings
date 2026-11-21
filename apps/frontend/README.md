# Netofings Frontend

Web dashboard for Netofings, built with React and Vite.

## Responsibilities

- Shows agents and metrics in real time.
- Consumes backend API routes under `/api`.
- Provides navigation between dashboard and agent metric views.

## Tech stack

- React 19
- Vite
- TypeScript
- TanStack Query
- Material UI + X Charts

## API proxy

During development, Vite proxies `/api` to the backend. Compose sets the proxy target to `http://backend:3000` inside its network.

- Default target: `http://localhost:3000`
- Override with: `VITE_API_PROXY_TARGET`

## Local development

From the repository root:

```bash
make frontend
```

From this directory, `make up` starts the same Docker services. To run Vite on the host instead:

```bash
make install
make dev
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

## Build output

Production artifacts are generated in `dist/`.
