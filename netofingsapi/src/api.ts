import Debug from 'debug';
import express from 'express';
import asyncify from 'express-asyncify';
import * as auth from 'express-jwt';
import Guard from 'express-jwt-permissions';
import db from 'netofingsdb';
import config from './config';

const debug = Debug('netofings:api:routes');
const guard = Guard();

export const api = asyncify(express.Router());

let services: any, Agent: any, Metric: any;

api.use('*', async (req, res, next) => {
  if (!services) {
    debug('Connecting to database');
    try {
      services = await db(config.db);
    } catch (error) {
      return next(error);
    }

    Agent = services.Agent;
    Metric = services.Metric;
  }

  next();
});

api.get('/agents', auth.expressjwt(config.auth as any), async (req, res, next) => {
  debug('A request has come to /agents');

  const { user } = req as any;

  if (!user || !user.username) {
    return next(new Error('Not authorized'));
  }

  let agents = [];
  try {
    if (user.admin) {
      agents = await Agent.findConnected();
    } else {
      agents = await Agent.findByUsername(user.username);
    }
  } catch (e) {
    return next(e);
  }

  res.send(agents);
});

api.get('/agent/:uuid', auth.expressjwt(config.auth as any), async (req, res, next) => {
  const { uuid } = req.params;

  debug(`request to /agent/${uuid}`);

  let agent;
  try {
    agent = await Agent.findByUuid(uuid);
  } catch (e) {
    return next(e);
  }

  if (!agent) {
    return next(new Error(`Agent not found with uuid ${uuid}`));
  }

  res.send(agent);
});

api.get('/metrics/:uuid', auth.expressjwt(config.auth as any), guard.check(['metrics:read']), async (req, res, next) => {
  const { uuid } = req.params;

  debug(`request to /metrics/${uuid}`);

  let metrics = [];
  try {
    metrics = await Metric.findByAgentUuid(uuid);
  } catch (e) {
    return next(e);
  }

  if (!metrics || metrics.length === 0) {
    return next(new Error(`Metrics not found for agent with uuid ${uuid}`));
  }

  res.send(metrics);
});

api.get('/metrics/:uuid/:type', auth.expressjwt(config.auth as any), async (req, res, next) => {
  const { uuid, type } = req.params;

  debug(`request to /metrics/${uuid}/${type}`);

  let metrics = [];
  try {
    metrics = await Metric.findByTypeAgentUuid(type, uuid);
  } catch (e) {
    return next(e);
  }

  if (!metrics || metrics.length === 0) {
    return next(new Error(`Metrics (${type}) not found for agent with uuid ${uuid}`));
  }

  res.send(metrics);
});
