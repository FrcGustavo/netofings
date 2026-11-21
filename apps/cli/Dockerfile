FROM node:24-slim AS agent
WORKDIR /app/clients/agent

COPY clients/agent/package.json clients/agent/package-lock.json ./
RUN npm ci
COPY clients/agent/ ./
RUN npm run build

CMD ["npm", "run", "example"]

FROM agent AS cli
WORKDIR /app/apps/cli

COPY apps/cli/package.json apps/cli/package-lock.json ./
RUN npm ci
COPY apps/cli/ ./
RUN npm run build

ENTRYPOINT ["node", "dist/bin.js"]
CMD ["--help"]
