import { Alert, Box, Button, CircularProgress, Grid, Typography } from '@mui/material'
import { AgentCard } from '../../components/AgentCard'
import { useAgents } from '../../hooks/useAgents'
import { useAgentRealtime } from '../../hooks/useAgentRealtime'
import { useState } from 'react'
import { CreateAgentDialog } from '../../components/CreateAgentDialog'
import AddIcon from '@mui/icons-material/Add'

export function DashboardPage() {
  const { data, isPending, isError, error } = useAgents()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Agents</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsDialogOpen(true)}
        >
          Add Agent
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        {data?.map((agent) => (
          <Grid key={agent.id ?? agent.uuid} size={{ xs: 12, md: 6, lg: 4 }}>
            <AgentCard agent={agent} />
          </Grid>
        ))}
      </Grid>

      <CreateAgentDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </Box>
  )
}
