import { Alert, Box, Button, Card, CardContent, CircularProgress, Typography } from '@mui/material'
import { LineChart } from '@mui/x-charts/LineChart'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { useMemo } from 'react'
import { useAgentMetrics } from '../hooks/useAgentMetrics'
import { useAgentRealtime } from '../hooks/useAgentRealtime'
import type { Metric } from '../types/domain'

function toNumber(value: number | string): number {
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function sortByCreatedAt(metrics: Metric[]): Metric[] {
  return [...metrics].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return aTime - bTime
  })
}

export function AgentMetricsPage() {
  const { agentId = '' } = useParams<{ agentId: string }>()
  const { data, isPending, isError, error } = useAgentMetrics(agentId, true, true)

  useAgentRealtime()

  const grouped = useMemo(() => Object.entries(data ?? {}), [data])

  if (!agentId) {
    return <Alert severity="warning">Missing agent id in route.</Alert>
  }

  if (isPending) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (isError) {
    return (
      <Alert severity="error">
        {error instanceof Error ? error.message : 'Failed to load metrics'}
      </Alert>
    )
  }

  return (
    <Box>
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box>
          <Typography variant="h5">Agent metrics</Typography>
          <Typography color="text.secondary" variant="body2">
            Agent ID: {agentId}
          </Typography>
        </Box>

        <Button component={RouterLink} to="/" variant="outlined">
          Back to dashboard
        </Button>
      </Box>

      {grouped.length === 0 ? (
        <Alert severity="info">No metric samples received yet.</Alert>
      ) : (
        grouped.map(([type, metrics]) => {
          const points = sortByCreatedAt(metrics)
          const labels = points.map((metric) =>
            metric.createdAt ? new Date(metric.createdAt).toLocaleTimeString() : '-',
          )
          const values = points.map((metric) => toNumber(metric.value))
          const latest = points.at(-1)

          return (
            <Card key={type} variant="outlined">
              <CardContent>
                <Typography variant="h6">{type}</Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }} variant="body2">
                  Latest value: {latest ? String(latest.value) : '-'}
                </Typography>

                <LineChart
                  height={260}
                  xAxis={[
                    {
                      id: `${type}-time`,
                      scaleType: 'point',
                      data: labels,
                    },
                  ]}
                  series={[
                    {
                      id: `${type}-series`,
                      label: type,
                      data: values,
                      showMark: false,
                    },
                  ]}
                />
              </CardContent>
            </Card>
          )
        })
      )}
    </Box>
  )
}
