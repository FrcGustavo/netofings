const debug = require('debug')('netofings:db:setup');
const inquirer = require('inquirer');
const db = require('./index');
const handleFatalError = require('./utils/handleFatalError');
const { info } = require('./utils/debug');
const {
  database, username, password, host, dialect,
} = require('./config');

const prompt = inquirer.createPromptModule();

async function setup() {
  const setupYes = process.argv.includes('--yes');

  if (!setupYes) {
    const answer = await prompt({
      type: 'confirm',
      name: 'setup',
      message: 'This will destroy your database, are you sure?',
    });

    if (!answer.setup) {
      return info('Nothing happened :)');
    }
  }

  const config = {
    database,
    username,
    password,
    host,
    dialect,
    logging: (s) => debug(s),
    setup: true,
  };

  await db(config).catch(handleFatalError);

  info('Success!');
  return process.exit(0);
}

setup();
