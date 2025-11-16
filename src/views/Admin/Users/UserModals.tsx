'use client';

import React, { useState } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';

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

interface UserModalProps {
  open: boolean;
  user: User | null;
  mode: 'view' | 'edit' | 'add';
  onClose: () => void;
  onSave?: (userData: Partial<User>) => Promise<void>;
}

export const UserModal: React.FC<UserModalProps> = ({
  open,
  user,
  mode,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    role: user?.user_roles[0]?.role || 'user',
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (onSave) {
      setSaving(true);

      try {
        await onSave(formData);
        onClose();
      } catch (error) {
        // Error handling - could be replaced with toast/snackbar notification
        if (error instanceof Error) {
          // Handle error silently or show user feedback
        }
      } finally {
        setSaving(false);
      }
    }
  };

  const isViewMode = mode === 'view';

  const getDialogTitle = () => {
    if (mode === 'add') return 'Add New User';

    if (mode === 'edit') return 'Edit User';

    return 'User Details';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{getDialogTitle()}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            disabled={isViewMode || mode === 'edit'}
            fullWidth
            required
          />
          <TextField
            label="First Name"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            disabled={isViewMode}
            fullWidth
          />
          <TextField
            label="Last Name"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            disabled={isViewMode}
            fullWidth
          />
          <TextField
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={isViewMode}
            fullWidth
          />
          <FormControl fullWidth disabled={isViewMode}>
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              label="Role"
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          {isViewMode && user && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                User ID: {user.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Created: {new Date(user.created_at).toLocaleString()}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {isViewMode ? 'Close' : 'Cancel'}
        </Button>
        {!isViewMode && (
          <Button onClick={handleSave} variant="contained" disabled={saving || !formData.username}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

interface DeleteUserDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  open,
  user,
  onClose,
  onConfirm,
}) => {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);

    try {
      await onConfirm();
      onClose();
    } catch (error) {
      // Error handling - could be replaced with toast/snackbar notification
      if (error instanceof Error) {
        // Handle error silently or show user feedback
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete User</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete user <strong>{user?.username}</strong>?
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} color="error" variant="contained" disabled={deleting}>
          {deleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
