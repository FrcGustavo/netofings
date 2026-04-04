'use strict'

const os = require('os')
const NetofingsAgent = require('../')

const agent = new NetofingsAgent({
  name: 'memory-monitor',
  username: 'local',
  interval: 2000
})

agent.addMetric('memory', function getMemoryUsagePercent () {
  const total = os.totalmem()
  const free = os.freemem()

  if (total <= 0) {
    return 0
  }

  const used = total - free
  const usagePercent = (used / total) * 100

  return Number(usagePercent.toFixed(2))
})

agent.on('message', payload => {
  console.log(payload.metrics)
})

agent.connect()
