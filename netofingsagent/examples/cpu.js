'use strict'

const os = require('os')
const NetofingsAgent = require('../')

const agent = new NetofingsAgent({
  name: 'cpu-monitor',
  username: 'local',
  interval: 2000
})

function snapshotCpuTimes () {
  const cpus = os.cpus()

  return cpus.reduce((acc, cpu) => {
    const total = Object.values(cpu.times).reduce((sum, time) => sum + time, 0)
    acc.idle += cpu.times.idle
    acc.total += total
    return acc
  }, { idle: 0, total: 0 })
}

let previous = snapshotCpuTimes()

agent.addMetric('cpu', function getCpuUsagePercent () {
  const current = snapshotCpuTimes()

  const idle = current.idle - previous.idle
  const total = current.total - previous.total

  previous = current

  if (total <= 0) {
    return 0
  }

  const usagePercent = (1 - (idle / total)) * 100
  return Number(usagePercent.toFixed(2))
})

agent.on('message', payload => {
  console.log(payload.metrics)
})

agent.connect()
