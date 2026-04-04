const { Sequelize } = require('sequelize');

/** @type {import('sequelize').Sequelize | null} */
let sequelize = null;

/**
 * @param {object} config
 */
module.exports = function setupDatabase(config) {
  if (!sequelize) {
    sequelize = new Sequelize(config);
  }
  return sequelize;
};
