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

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (userData: {
    username: string;
    first_name: string;
    last_name: string;
    phone: string;
    role: string;
  }) => Promise<void>;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'user',
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      // Reset form when modal opens
      setFormData({
        username: '',
        first_name: '',
        last_name: '',
        phone: '',
        role: 'user',
      });
    }
  }, [open]);

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

  return (
    <ModalRoot
      open={open}
      onClose={onClose}
      title="Add New User"
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

export default CreateUserModal;
