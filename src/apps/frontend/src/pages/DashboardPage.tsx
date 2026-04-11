import { Alert, Box, CircularProgress, Grid, Typography } from '@mui/material'
import { AgentCard } from '../components/AgentCard'
import { useAgents } from '../hooks/useAgents'
import { useAgentRealtime } from '../hooks/useAgentRealtime'

export function DashboardPage() {
  const { data, isPending, isError, error } = useAgents()

  useAgentRealtime()

  if (isPending) {
    return (
      <Box
        sx={{
          minHeight: '50vh',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (isError) {
    return (
      <Alert severity="error">
        {error instanceof Error ? error.message : 'Failed to load agents'}
      </Alert>
    )
  }

  return (
    <Box>
      <Typography variant="h5">Agents</Typography>

      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        {data?.map((agent) => (
          <Grid key={agent.id ?? agent.uuid} size={{ xs: 12, md: 6, lg: 4 }}>
            <AgentCard agent={agent} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
