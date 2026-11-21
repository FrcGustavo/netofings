import { authorizedFetch } from './authorizedFetch'
import type { Agent, MetricsByType } from '../types/domain'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export function getAgents(): Promise<Agent[]> {
  return authorizedFetch<Agent[]>('/agents', {
    baseUrl: API_BASE_URL,
  })
}

export function getAgent(uuid: string): Promise<Agent> {
  return authorizedFetch<Agent>(`/agents/${uuid}`, {
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

  return authorizedFetch<MetricsByType>(path, {
    baseUrl: API_BASE_URL,
  })
}

export function createAgent(agent: Partial<Agent>): Promise<Agent> {
  return authorizedFetch<Agent>('/agents', {
    method: 'POST',
    baseUrl: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(agent)
  })
}

export function createAgentToken(agentId: string, descripcion: string): Promise<any> {
  return authorizedFetch(`/agents/${agentId}/tokens`, {
    method: 'POST',
    baseUrl: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ descripcion })
  })
}

export function deleteAgent(agentId: string): Promise<void> {
  return authorizedFetch(`/agents/${agentId}`, {
    method: 'DELETE',
    baseUrl: API_BASE_URL
  })
}
