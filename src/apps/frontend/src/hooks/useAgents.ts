import { useQuery } from '@tanstack/react-query'
import { getAgents } from '../lib/api'
import { queryKeys } from '../lib/queryKeys'

export function useAgents() {
  return useQuery({
    queryKey: queryKeys.agents.all,
    queryFn: getAgents,
  })
}
