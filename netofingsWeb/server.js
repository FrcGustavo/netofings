'use strict'

const debug = require('debug')('netofings:web')
const http = require('http')
const path = require('path')
const express = require('express')
const asyncify = require('express-asyncify')
const socketio = require('socket.io')
const chalk = require('chalk')
const NetofingsAgent = require('netofingsagent')

const { pipe } = require('./utils')
const proxy = require('./proxy')

const port = process.env.PORT || 8080
const app = asyncify(express())
const server = http.createServer(app)
const io = socketio(server)
const agent = new NetofingsAgent()

app.use(express.static(path.join(__dirname, 'public')))
app.use('/', proxy)

// Socket.io / WebSockets
io.on('connect', socket => {
  debug(`Connected ${socket.id}`)

  pipe(agent, socket)
})

// Express Error Handler
app.use((err, req, res, next) => {
  debug(`Error: ${err.message}`)

  if (err.message.match(/not found/)) {
    return res.status(404).send({ error: err.message })
  }

  res.status(500).send({ error: err.message })
})

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

server.listen(port, () => {
  console.log(`${chalk.green('[platziverse-web]')} server listening on port ${port}`)
  agent.connect()
})
