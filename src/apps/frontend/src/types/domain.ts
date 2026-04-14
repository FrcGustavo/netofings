export type AgentToken = {
  id: string
  token: string
  revoked: boolean
  createdAt: string
  descripcion?: string
}

export type Agent = {
  id?: string
  uuid?: string
  username: string
  name: string
  hostname: string
  connected: boolean
  tokens?: AgentToken[]
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
    