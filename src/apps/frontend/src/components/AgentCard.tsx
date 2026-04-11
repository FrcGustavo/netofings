import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { AgentMetricsPanel } from './AgentMetricsPanel'
import type { Agent } from '../types/domain'

type AgentCardProps = {
  agent: Agent
}

export function AgentCard({ agent }: AgentCardProps) {
  const [showMetrics, setShowMetrics] = useState(false)
  const navigate = useNavigate()
  const agentId = agent.id ?? agent.uuid ?? ''

  return (
    <Card variant="outlined">
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h6">{agent.name}</Typography>
            <Typography color="text.secondary" variant="body2">
              {agent.hostname}
            </Typography>
            <Typography color="text.secondary" variant="caption">
              {agentId}
            </Typography>
          </Box>

          <Chip
            color={agent.connected ? 'success' : 'default'}
            label={agent.connected ? 'Online' : 'Offline'}
            size="small"
            variant={agent.connected ? 'filled' : 'outlined'}
          />
        </Box>

        <Button
          size="small"
          sx={{ mt: 1.5 }}
          variant="text"
          onClick={() => setShowMetrics((current) => !current)}
        >
          {showMetrics ? 'Hide metrics' : 'Show metrics'}
        </Button>

        <Button
          disabled={!agentId}
          size="small"
          sx={{ mt: 1.5, ml: 1 }}
          variant="outlined"
          onClick={() => navigate(`/agents/${agentId}/metrics`)}
        >
          Open charts
        </Button>

        <Collapse in={showMetrics} timeout="auto" unmountOnExit>
          <AgentMetricsPanel open={showMetrics} agentId={agentId} />
        </Collapse>
      </CardContent>
    </Card>
  )
}
