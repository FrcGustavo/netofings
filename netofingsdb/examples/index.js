'use strct';

const db = require('../index');
const handleFatalError = require('../utils/handleFatalError');
const { info } = require('../utils/debug');
const {
  database, username, password, host, dialect,
} = require('../config');

async function run() {
  const config = {
    database, username, password, host, dialect,
  };

  const { Agent, Metric } = await db(config).catch(handleFatalError);

  const agent = await Agent.createOrUpdate({
    uuid: 'xxx',
    name: 'test',
    username: 'test',
    hostname: 'test',
    pid: 1,
    connected: true,
  }).catch(handleFatalError);

  info('--agent--');
  info(agent);

  const agents = await Agent.findAll().catch(handleFatalError);
  info('--agents--');
  info(agents);

  const metrics = await Metric.findByAgentUuid(agent.uuid).catch(handleFatalError);
  info('--metrics--');
  info(metrics);

  const metric = await Metric.create(agent.uuid, {
    type: 'memory',
    value: '300',
  }).catch(handleFatalError);

  info('--metric--');
  info(metric);

  const metricsByType = await Metric.findByTypeAgentUuid('memory', agent.uuid).catch(handleFatalError);
  info('--metrics--');
  info(metricsByType);
}

run();
