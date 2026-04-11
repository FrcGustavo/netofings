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

During development, Vite proxies `/api` to the backend.

- Default target: `http://localhost:3000`
- Override with: `VITE_API_PROXY_TARGET`

## Local development

From the repository root:

```bash
npm run dev --workspace=frontend
```

Or from this folder:

```bash
npm run dev
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

## Build output

Production artifacts are generated in `dist/`.
