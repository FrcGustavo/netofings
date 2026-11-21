# Etapa 1: construir frontend con el repo completo disponible
FROM node:24-slim AS frontend-build
WORKDIR /app

COPY . .
RUN npm install --include=dev
RUN npm run build --workspace=frontend

# Etapa 2: construir backend con el repo completo disponible
FROM node:24-slim AS backend-build
WORKDIR /app

COPY . .
RUN npm install --include=dev
RUN npm run build --workspace=backend

# Etapa 3: imagen final de producción
FROM node:24-slim AS production
WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json turbo.json ./
COPY src/apps/frontend/package.json ./src/apps/frontend/
COPY src/apps/backend/package.json ./src/apps/backend/
COPY src/packages/agent/package.json ./src/packages/agent/
COPY src/packages/cli/package.json ./src/packages/cli/
COPY --from=backend-build /app/node_modules ./node_modules

COPY --from=backend-build /app/src/apps/backend/dist ./src/apps/backend/dist
COPY --from=frontend-build /app/src/apps/frontend/dist ./src/apps/backend/frontend/dist

EXPOSE 3000
CMD ["node", "src/apps/backend/dist/main.js"]
