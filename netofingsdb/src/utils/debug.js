const debug = require('debug');
const config = require('../config');

const info = debug(`${config.logPrefix}:info`);
const dev = debug(`${config.logPrefix}:dev`);
const error = debug(`${config.logPrefix}:error`);

module.exports = { info, dev, error };
