import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { io } from 'socket.io-client'
import { queryKeys } from '../../../lib/queryKeys'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL

export function useAgentRealtime() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const socket = io(SOCKET_URL ?? window.location.origin, {
      reconnection: true,
    })

    const refreshAgents = () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.agents.all,
      })

      void queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'metrics',
      })
    }

    socket.on('agent/message', refreshAgents)
    socket.on('agent/connected', refreshAgents)
    socket.on('agent/disconnected', refreshAgents)

    return () => {
      socket.off('agent/message', refreshAgents)
      socket.off('agent/connected', refreshAgents)
      socket.off('agent/disconnected', refreshAgents)
      socket.close()
    }
  }, [queryClient])
}
