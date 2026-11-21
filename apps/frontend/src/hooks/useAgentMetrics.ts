import { useQuery } from '@tanstack/react-query'
import { getAgentMetrics } from '../lib/api'
import { queryKeys } from '../lib/queryKeys'

export function useAgentMetrics(
  agentId: string,
  enabled: boolean,
  realtime = false,
) {
  return useQuery({
    queryKey: queryKeys.agents.metrics(agentId),
    queryFn: () => getAgentMetrics(agentId),
    enabled: enabled && Boolean(agentId),
    refetchInterval: realtime ? 2000 : false,
    refetchIntervalInBackground: realtime,
  })
}
