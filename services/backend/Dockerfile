FROM node:24-slim AS frontend-development
WORKDIR /app/apps/frontend

COPY apps/frontend/package.json apps/frontend/package-lock.json ./
RUN npm ci --include=dev
COPY apps/frontend/ ./

FROM frontend-development AS frontend-build
RUN npm run build

FROM node:24-slim AS backend-development
WORKDIR /app/services/backend

COPY services/backend/package.json services/backend/package-lock.json ./
RUN npm ci --include=dev
COPY services/backend/ ./

FROM backend-development AS backend-build
RUN npm run build && npm prune --omit=dev --no-audit

FROM node:24-slim AS production
WORKDIR /app
ENV NODE_ENV=production

COPY --from=backend-build /app/services/backend/package.json ./services/backend/
COPY --from=backend-build /app/services/backend/node_modules ./services/backend/node_modules
COPY --from=backend-build /app/services/backend/dist ./services/backend/dist
COPY --from=frontend-build /app/apps/frontend/dist ./services/backend/frontend/dist

EXPOSE 3000
CMD ["node", "services/backend/dist/main.js"]
