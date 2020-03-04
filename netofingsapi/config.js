'use strict'

const debug = require('debug')('netofings:api:db')

module.exports = {
  db: {
    database: process.env.DB_NAME || 'netofings',
    username: process.env.DB_USER || 'gusi',
    password: process.env.DB_PASS || '123456',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => debug(s)
  }
}
