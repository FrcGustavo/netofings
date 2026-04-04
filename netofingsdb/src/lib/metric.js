/**
 * @param {any} MetricModel
 * @param {any} AgentModel
 */
module.exports = function setupMetric(MetricModel, AgentModel) {
  /**
   * @param {string} uuid
   */
  async function findByAgentUuid(uuid) {
    return MetricModel.findAll({
      attributes: ['type'],
      group: ['type'],
      include: [{
        attributes: [],
        model: AgentModel,
        where: {
          uuid,
        },
      }],
      raw: true,
    });
  }

  /**
   * @param {string} type
   * @param {string} uuid
   */
  async function findByTypeAgentUuid(type, uuid) {
    return MetricModel.findAll({
      attributes: ['id', 'type', 'value', 'createdAt'],
      where: {
        type,
      },
      limit: 20,
      order: [
        ['createdAt', 'DESC'],
      ],
      include: [{
        attributes: [],
        model: AgentModel,
        where: {
          uuid,
        },
      }],
      raw: true,
    });
  }

  /**
   * @param {string} uuid
   * @param {{ [key: string]: any }} metric
   */
  async function create(uuid, metric) {
    const agent = await AgentModel.findOne({
      where: { uuid },
    });

    if (agent) {
      Object.assign(metric, { agentId: agent.id });
      const result = await MetricModel.create(metric);
      return result.toJSON();
    }
  }

  return {
    create,
    findByAgentUuid,
    findByTypeAgentUuid,
  };
};
