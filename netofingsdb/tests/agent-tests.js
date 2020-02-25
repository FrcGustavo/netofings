'use strict'

const test = require('ava')

const config = {
  logging: function () {}
}
let db = null

test.beforeEach(async () => {
  const setupDatabase = require('../index')
  db = await setupDatabase(config)
})

test('Agent', t => {
  t.truthy(db.Agent, 'Agent service should exist')
})
