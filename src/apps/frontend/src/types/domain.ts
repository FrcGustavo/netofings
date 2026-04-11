export type Agent = {
  id?: string
  uuid?: string
  name: string
  hostname: string
  connected: boolean
}

export type Metric = {
  id?: string
  type: string
  value: number | string
  createdAt?: string
}

export type MetricsByType = Record<string, Metric[]>

export type AgentMessageEvent = {
  agent: Agent
  metrics?: Metric[]
  timestamp?: number
}
    