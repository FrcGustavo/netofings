import { fetchJson } from './fetcher'
import type { Agent, MetricsByType } from '../types/domain'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export function getAgents(): Promise<Agent[]> {
  return fetchJson<Agent[]>('/agents', {
    baseUrl: API_BASE_URL,
  })
}

export function getAgent(uuid: string): Promise<Agent> {
  return fetchJson<Agent>(`/agent/${uuid}`, {
    baseUrl: API_BASE_URL,
  })
}

export function getAgentMetrics(
  agentId: string,
  type?: string,
): Promise<MetricsByType> {
  if (!agentId) {
    return Promise.reject(new Error('agentId is required'))
  }

  const basePath = `/agents/${agentId}/metrics`
  const path = type ? `${basePath}?type=${encodeURIComponent(type)}` : basePath

  return fetchJson<MetricsByType>(path, {
    baseUrl: API_BASE_URL,
  })
}
