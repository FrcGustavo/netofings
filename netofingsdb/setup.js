'use strict'

const debug = require('debug')('netofings:db:setup')
const db = require('./index')

async function setup () {
  const config = {
    database: process.env.DB_NAME || 'netofings',
    username: process.env.DB_USER || 'gusi',
    password: process.env.DB_PASS || '123456',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => debug(s),
    setup: true
  }

  await db(config).catch(handleFatalError)

  console.log('Success!')
  process.exit(1)
}

function handleFatalError (error) {
  console.error(error.message)
  console.error(error.stack)
  process.exit(1)
}

setup()
