import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box
} from '@mui/material';
import { createAgent } from '../../../lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateAgentDialogProps {
  open: boolean;
  onClose: () => void;
}

export const CreateAgentDialog: React.FC<CreateAgentDialogProps> = ({ open, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    username: '',
    uuid: crypto.randomUUID()
  });

  const mutation = useMutation({
    mutationFn: (data: any) => createAgent({
      ...data,
      name: data.username, // Using username as name
      hostname: 'manual-entry',
      pid: 0
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      onClose();
      setFormData({
        username: '',
        uuid: crypto.randomUUID()
      });
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Create New Agent</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                name="username"
                label="Username"
                fullWidth
                required
                value={formData.username}
                onChange={handleChange}
                autoFocus
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Creating...' : 'Create Agent'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
