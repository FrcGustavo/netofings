import { 
  Alert, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CircularProgress, 
  Typography,
  Slider,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material'
import { LineChart } from '@mui/x-charts/LineChart'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useAgentMetrics } from '../../hooks/useAgentMetrics'
import { useAgentRealtime } from '../../hooks/useAgentRealtime'
import type { Metric } from '../../../../types/domain'
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

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
  const [zoom, setZoom] = useState<number>(1);

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
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>Agent metrics</Typography>
          <Typography color="text.secondary" variant="body2">
            Monitoring data for: {agentId}
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <Card variant="outlined" sx={{ px: 2, py: 0.5, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Zoom Out">
              <IconButton size="small" onClick={() => setZoom(prev => Math.max(1, prev - 0.5))}>
                <ZoomOutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Box sx={{ width: 150 }}>
              <Typography variant="caption" color="text.secondary" align="center" display="block">
                Horizontal Zoom ({zoom}x)
              </Typography>
              <Slider
                value={zoom}
                min={1}
                max={5}
                step={0.5}
                onChange={(_, value) => setZoom(value as number)}
                size="small"
              />
            </Box>
            <Tooltip title="Zoom In">
              <IconButton size="small" onClick={() => setZoom(prev => Math.min(5, prev + 0.5))}>
                <ZoomInIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reset Zoom">
              <IconButton size="small" onClick={() => setZoom(1)}>
                <RestartAltIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Card>
          <Button component={RouterLink} to="/" variant="outlined">
            Back to dashboard
          </Button>
        </Stack>
      </Box>

      {grouped.length === 0 ? (
        <Alert severity="info" variant="outlined" sx={{ borderRadius: 2 }}>
          Waiting for metric data... If the agent is active, metrics should appear shortly.
        </Alert>
      ) : (
        <Stack spacing={4}>
          {grouped.map(([type, metrics]) => {
            const points = sortByCreatedAt(metrics)
            const labels = points.map((metric, idx) => {
              if (!metric.createdAt) return `-${idx}`
              return new Date(metric.createdAt).toLocaleTimeString()
            })
            const values = points.map((metric) => toNumber(metric.value))
            const latest = points.at(-1)

            return (
              <Card key={type} variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>{type}</Typography>
                      <Typography color="text.secondary" variant="body2">
                        Last measured: {latest ? String(latest.value) : '-'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box 
                    sx={{ 
                      width: '100%', 
                      overflowX: 'auto',
                      pb: 1,
                      bgcolor: '#fafafa',
                      borderRadius: 1,
                      p: 1,
                      '::-webkit-scrollbar': { height: 8 },
                      '::-webkit-scrollbar-thumb': { bgcolor: '#ccc', borderRadius: 4 },
                      '::-webkit-scrollbar-track': { bgcolor: 'transparent' }
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: `${Math.max(100, 100 * zoom)}%`, 
                        minWidth: '100%', 
                        height: 300,
                        transition: 'width 0.2s ease-in-out'
                      }}
                    >
                      <LineChart
                        key={`${type}-zoom-${zoom}`}
                        height={300}
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
                            showMark: true, // Always show marks to ensure 1-point cases are visible
                            area: false,
                          },
                        ]}
                        margin={{ left: 50, right: 30, top: 20, bottom: 40 }}
                        slotProps={{
                          legend: { hidden: true }
                        }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )
          })}
        </Stack>
      )}
    </Box>
  )
}
