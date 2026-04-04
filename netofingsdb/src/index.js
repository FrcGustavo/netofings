const defaults = require('defaults');
const setupDatabase = require('./lib/db');
const setupAgentModel = require('./models/agent');
const setupMetricModel = require('./models/metric');
const setupAgent = require('./lib/agent');
const setupMetric = require('./lib/metric');

/**
 * @typedef {object} DbConfig
 * @property {string} [database]
 * @property {string} [username]
 * @property {string} [password]
 * @property {string} [host]
 * @property {string} [dialect]
 * @property {{max?: number, min?: number}} [pool]
 * @property {{raw?: boolean}} [query]
 * @property {boolean} [setup]
 * @property {(message: string) => void} [logging]
 */

/**
 * @param {DbConfig} config
 */
module.exports = async function (config) {
  config = defaults(config, {
    dialect: 'sqlite',
    pool: {
      max: 10,
      min: 0,
    },
    query: {
      raw: true,
    },
  });
  const sequelize = setupDatabase(config);
  const AgentModel = setupAgentModel(config);
  const MetricModel = setupMetricModel(config);

  AgentModel.hasMany(MetricModel);
  MetricModel.belongsTo(AgentModel);

  await sequelize.authenticate();

  if (config.setup) {
    await sequelize.sync({ force: true });
  }

  const Agent = setupAgent(AgentModel);
  const Metric = setupMetric(MetricModel, AgentModel);

  return { Agent, Metric };
};
