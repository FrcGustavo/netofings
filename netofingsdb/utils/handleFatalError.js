const chalk = require('chalk');
const { info } = require('./debug');

const handleFatalError = (error) => {
  info(`${chalk.red('[fatal error]')} ${error.message}`);
  info(error.stack);
  process.exit(1);
};

module.exports = handleFatalError;
