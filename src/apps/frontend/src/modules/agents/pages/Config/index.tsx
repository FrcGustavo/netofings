import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Button,
  Chip
} from '@mui/material';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAgent } from '../../../../lib/api';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { CreateTokenDialog } from '../../components/CreateTokenDialog';
import { DeleteAgentDialog } from '../../components/DeleteAgentDialog';
import DeleteIcon from '@mui/icons-material/Delete';

export const AgentConfig: React.FC = () => {
  const { agentId = '' } = useParams<{ agentId: string }>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: agent, isPending, isError, error } = useQuery({
    queryKey: ['agents', agentId],
    queryFn: () => getAgent(agentId),
    enabled: Boolean(agentId)
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const activeToken = agent?.tokens?.find((token) => !token.revoked) ?? null;
  const envSnippet = activeToken
    ? `export NETOFINGS_AGENT_TOKEN=${activeToken.token}`
    : 'Generate an active token to see the setup snippet.';
  const codeSnippet = activeToken
    ? [
        "import NetofingsAgent from '@netofings/agent';",
        '',
        'const agent = new NetofingsAgent({',
        `  username: '${agent?.username ?? 'agent-user'}',`,
        "  name: 'My Agent',",
        '  token: process.env.NETOFINGS_AGENT_TOKEN!,',
        '  interval: 5000,',
        "  host: 'mqtt://localhost:1883',",
        '});',
        '',
        "agent.addMetric('cpu', () => 12.3);",
        'agent.connect();',
      ].join('\n')
    : 'Generate an active token to see the setup snippet.';

  if (isPending) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        {error instanceof Error ? error.message : 'Failed to load agent configuration'}
      </Alert>
    );
  }

  if (!agent) return null;

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button 
          component={RouterLink} 
          to="/" 
          variant="text" 
          startIcon={<ArrowBackIcon />}
          sx={{ color: 'text.secondary' }}
        >
          Back
        </Button>
      </Box>

      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <SettingsIcon color="primary" sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {agent.username} Configuration
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage tokens and settings for this agent
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Agent Tokens
          </Typography>
          <Button 
            variant="contained" 
            size="small" 
            startIcon={<AddIcon />}
            onClick={() => setIsDialogOpen(true)}
          >
            Generate Token
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Use these tokens to authenticate your agent when sending metrics. 
          Keep them secure as they provide access to your account.
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Token</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agent.tokens?.map((token) => (
                <TableRow key={token.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {token.descripcion || 'No description'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: 'monospace', 
                        background: '#f5f5f5', 
                        p: 0.5, 
                        borderRadius: 1,
                        display: 'inline-block'
                      }}
                    >
                      {token.token.substring(0, 8)}****************{token.token.substring(token.token.length - 4)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(token.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={token.revoked ? 'Revoked' : 'Active'} 
                      color={token.revoked ? 'error' : 'success'} 
                      size="small" 
                      variant="outlined" 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Copy Token">
                      <IconButton 
                        onClick={() => copyToClipboard(token.token)}
                        disabled={token.revoked}
                        color="primary"
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {!agent.tokens?.length && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No tokens found for this agent.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper sx={{ mt: 4, p: 4, borderRadius: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Usage Snippet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This is the exact setup for the agent package using only the token. The backend resolves the agent identity from that token.
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2">Environment Variable</Typography>
            <Button
              size="small"
              startIcon={<ContentCopyIcon fontSize="small" />}
              onClick={() => copyToClipboard(envSnippet)}
              disabled={!activeToken}
            >
              Copy
            </Button>
          </Box>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: '#111827',
              color: '#f9fafb',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            {envSnippet}
          </Box>
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2">TypeScript Example</Typography>
            <Button
              size="small"
              startIcon={<ContentCopyIcon fontSize="small" />}
              onClick={() => copyToClipboard(codeSnippet)}
              disabled={!activeToken}
            >
              Copy
            </Button>
          </Box>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: '#111827',
              color: '#f9fafb',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              overflowX: 'auto',
            }}
          >
            {codeSnippet}
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ mt: 4, p: 4, borderRadius: 2, border: '1px solid', borderColor: 'error.light' }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'error.main' }}>
          Danger Zone
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Once you delete an agent, there is no going back. Please be certain.
        </Typography>
        <Button 
          variant="outlined" 
          color="error" 
          startIcon={<DeleteIcon />}
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          Delete Agent
        </Button>
      </Paper>

      <CreateTokenDialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        agentId={agentId} 
      />

      <DeleteAgentDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        agentId={agentId}
        agentName={agent.username}
      />
    </Box>
  );
};
