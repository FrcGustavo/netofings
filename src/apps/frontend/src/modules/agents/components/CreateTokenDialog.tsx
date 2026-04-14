import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAgentToken } from '../../../lib/api';

interface CreateTokenDialogProps {
  open: boolean;
  onClose: () => void;
  agentId: string;
}

export const CreateTokenDialog: React.FC<CreateTokenDialogProps> = ({ open, onClose, agentId }) => {
  const queryClient = useQueryClient();
  const [descripcion, setDescripcion] = useState('');

  const mutation = useMutation({
    mutationFn: () => createAgentToken(agentId, descripcion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents', agentId] });
      onClose();
      setDescripcion('');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Generate New Token</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers>
          <TextField
            label="Token Description"
            fullWidth
            required
            variant="outlined"
            placeholder="e.g. Production server, Raspberry Pi..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            autoFocus
            disabled={mutation.isPending}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={mutation.isPending}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={mutation.isPending || !descripcion.trim()}
          >
            {mutation.isPending ? 'Generating...' : 'Generate'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
