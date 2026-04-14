import { Alert, Box, CircularProgress, Divider, Typography } from '@mui/material'
import { useAgentMetrics } from '../hooks/useAgentMetrics'

type AgentMetricsPanelProps = {
  agentId: string
  open: boolean
}

export function AgentMetricsPanel({ agentId, open }: AgentMetricsPanelProps) {
  const { data, isPending, isError, error } = useAgentMetrics(agentId, open)
  const grouped = Object.entries(data ?? {})

  if (!open) {
    return null
  }

  if (isPending) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', py: 2 }}>
        <CircularProgress size={24} />
      </Box>
    )
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ mt: 1.5 }}>
        {error instanceof Error ? error.message : 'Failed to load metrics'}
      </Alert>
    )
  }

  if (grouped.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ mt: 1.5 }} variant="body2">
        No metrics available yet.
      </Typography>
    )
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Metrics
      </Typography>
      {grouped.map(([type, metrics], index) => {
        const latest = metrics[0]

        return (
          <Box key={`${type}-${index}`} sx={{ py: 0.75 }}>
            <Typography variant="body2">
              {type}: {latest ? String(latest.value) : '-'}
            </Typography>
            {index < grouped.length - 1 ? <Divider sx={{ mt: 0.75 }} /> : null}
          </Box>
        )
      })}
    </Box>
  )
}
