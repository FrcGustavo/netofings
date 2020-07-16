'use strct';

const db = require('../index');

async function run() {
  const config = {
    database: process.env.DB_NAME || 'netofings',
    username: process.env.DB_USER || 'gusi',
    password: process.env.DB_PASS || '123456',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
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

  console.log('--agent--');
  console.log(agent);

  const agents = await Agent.findAll().catch(handleFatalError);
  console.log('--agents--');
  console.log(agents);

  const metrics = await Metric.findByAgentUuid(agent.uuid).catch(handleFatalError);
  console.log('--metrics--');
  console.log(metrics);

  const metric = await Metric.create(agent.uuid, {
    type: 'memory',
    value: '300',
  }).catch(handleFatalError);

  console.log('--metric--');
  console.log(metric);

  const metricsByType = await Metric.findByTypeAgentUuid('memory', agent.uuid).catch(handleFatalError);
  console.log('--metrics--');
  console.log(metricsByType);
}

function handleFatalError(error) {
  console.error(error.message);
  console.error(error.stack);
  process.exit(1);
}

run();
