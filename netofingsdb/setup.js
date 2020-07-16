const debug = require('debug')('netofings:db:setup');
const inquirer = require('inquirer');
const db = require('./index');
const handleFatalError = require('./utils/handleFatalError');

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
      return console.log('Nothing happened :)');
    }
  }

  const config = {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: (s) => debug(s),
    setup: true,
  };

  await db(config).catch(handleFatalError);

  console.log('Success!');
  return process.exit(0);
}

setup();
