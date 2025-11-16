'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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

interface EditUserModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (userData: Partial<User>) => Promise<void>;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  open,
  user,
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

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        role: user.user_roles[0]?.role || 'user',
      });
    }
  }, [user, open]);

  const handleSave = async () => {
    setSaving(true);

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        // Handle error silently or show user feedback
      }
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <ModalRoot
      open={open}
      onClose={onClose}
      title="Edit User"
      maxWidth="sm"
      fullWidth
      actions={
        <>
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" disabled={saving || !formData.username}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </>
      }
    >
      <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          disabled
          fullWidth
          required
        />
        <TextField
          label="First Name"
          value={formData.first_name}
          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          fullWidth
        />
        <TextField
          label="Last Name"
          value={formData.last_name}
          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          fullWidth
        />
        <TextField
          label="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          fullWidth
        />
        <FormControl fullWidth>
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
      </Box>
    </ModalRoot>
  );
};

export default EditUserModal;
