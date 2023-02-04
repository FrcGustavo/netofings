import Debug from 'debug';
import http from 'node:http';
import chalk from 'chalk';
import express from 'express';
import asyncify from 'express-asyncify';
import { api } from './api';

const debug = Debug('netofings:api');
const PORT = process.env.PORT || 3000;
const app = asyncify(express());
const server = http.createServer(app);

app.use('/api', api);

app.use((err: any, req: any, res: any, next: any) => {
  debug(`Error: ${err.message}`);

  if (err.message.match(/not found/)) {
    return res.status(404).send({ error: err.message });
  }

  res.status(500).send({ error: err.message });
});

function handleFatalError(err: any) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`);
  console.error(err.stack);
  process.exit(1);
}

if (!module.parent) {
  process.on('uncaughtException', handleFatalError);
  process.on('unhandledRejection', handleFatalError);

  server.listen(PORT, () => {
    console.log(`${chalk.green('[platziverse-api]')} server listening on port ${PORT}`);
  });
}
