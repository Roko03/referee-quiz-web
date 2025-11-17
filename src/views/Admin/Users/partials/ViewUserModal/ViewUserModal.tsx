'use client';

import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Button,
} from '@mui/material';
import ModalRoot from '@/components/ModalRoot';

interface UserRole {
  role: string;
}

interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  user_roles: UserRole[];
}

interface ViewUserModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({
  open,
  user,
  onClose,
}) => {
  if (!user) return null;

  return (
    <ModalRoot
      open={open}
      onClose={onClose}
      title="User Details"
      maxWidth="sm"
      fullWidth
      actions={
        <Button onClick={onClose}>
          Close
        </Button>
      }
    >
      <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Username"
          value={user.username}
          disabled
          fullWidth
        />
        <TextField
          label="First Name"
          value={user.first_name || ''}
          disabled
          fullWidth
        />
        <TextField
          label="Last Name"
          value={user.last_name || ''}
          disabled
          fullWidth
        />
        <TextField
          label="Phone"
          value={user.phone || ''}
          disabled
          fullWidth
        />
        <FormControl fullWidth disabled>
          <InputLabel>Role</InputLabel>
          <Select
            value={user.user_roles[0]?.role || 'user'}
            label="Role"
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            User ID: {user.id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Created: {new Date(user.created_at).toLocaleString()}
          </Typography>
        </Box>
      </Box>
    </ModalRoot>
  );
};

export default ViewUserModal;
