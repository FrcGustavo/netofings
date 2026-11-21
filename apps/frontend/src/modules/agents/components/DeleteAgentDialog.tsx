import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField
} from '@mui/material';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAgent } from '../../../lib/api';
import { useNavigate } from 'react-router-dom';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface DeleteAgentDialogProps {
  open: boolean;
  onClose: () => void;
  agentId: string;
  agentName: string;
}

export const DeleteAgentDialog: React.FC<DeleteAgentDialogProps> = ({ 
  open, 
  onClose, 
  agentId, 
  agentName 
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [confirmName, setConfirmName] = useState('');

  const mutation = useMutation({
    mutationFn: () => deleteAgent(agentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      handleClose();
      navigate('/');
    }
  });

  const handleClose = () => {
    setConfirmName('');
    onClose();
  };

  const isConfirmed = confirmName === agentName;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
        <WarningAmberIcon />
        Delete Agent
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Are you sure you want to delete the agent <strong>{agentName}</strong>?
        </DialogContentText>
        <Box sx={{ p: 2, bgcolor: 'error.light', borderRadius: 1, border: '1px solid', borderColor: 'error.main', color: 'error.contrastText', mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
            Crucial Information:
          </Typography>
          <Typography variant="caption" component="ul" sx={{ pl: 2 }}>
            <li>All associated metrics will be permanently deleted.</li>
            <li>All tokens for this agent will become invalid immediately.</li>
            <li>This action cannot be undone.</li>
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 1 }}>
          To confirm, please type <strong>{agentName}</strong> below:
        </Typography>
        <TextField
          fullWidth
          size="small"
          value={confirmName}
          onChange={(e) => setConfirmName(e.target.value)}
          placeholder={agentName}
          autoComplete="off"
          disabled={mutation.isPending}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={mutation.isPending}>Cancel</Button>
        <Button 
          onClick={() => mutation.mutate()} 
          variant="contained" 
          color="error"
          disabled={mutation.isPending || !isConfirmed}
        >
          {mutation.isPending ? 'Deleting...' : 'Delete Permanently'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
