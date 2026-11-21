import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { AgentMetricsPanel } from './AgentMetricsPanel'
import SettingsIcon from '@mui/icons-material/Settings';
import type { Agent } from '../../../types/domain'

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
              {agent.username}
            </Typography>
            <Typography color="text.secondary" variant="caption">
              {agentId}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Chip
              color={agent.connected ? 'success' : 'default'}
              label={agent.connected ? 'Online' : 'Offline'}
              size="small"
              variant={agent.connected ? 'filled' : 'outlined'}
            />
            <Tooltip title="Agent Settings">
              <IconButton 
                size="small" 
                onClick={() => navigate(`/agents/${agentId}/config`)}
                sx={{ mt: -0.5, mr: -0.5 }}
              >
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
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
