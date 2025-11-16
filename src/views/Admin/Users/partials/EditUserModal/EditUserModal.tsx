'use client';

import React, { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import ModalRoot from '@/components/ModalRoot';
import Form from '@/components/Forms/Form';
import FormInput from '@/components/Forms/FormInput';

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

interface FormData {
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  open,
  user,
  onClose,
  onSave,
}) => {
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (data: FormData) => {
    setSaving(true);

    try {
      await onSave(data);
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
    >
      <Form<FormData>
        onSubmit={handleSubmit}
        defaultValues={{
          username: user.username || '',
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          phone: user.phone || '',
          role: user.user_roles[0]?.role || 'user',
        }}
      >
        {({ formState: { isValid } }) => (
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormInput
              name="username"
              label="Username"
              fullWidth
              disabled
              validate={{
                required: 'Username is required',
              }}
            />
            <FormInput
              name="first_name"
              label="First Name"
              fullWidth
            />
            <FormInput
              name="last_name"
              label="Last Name"
              fullWidth
            />
            <FormInput
              name="phone"
              label="Phone"
              fullWidth
            />
            <FormInput
              name="role"
              label="Role"
              renderInput={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select {...field} label="Role">
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              )}
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={saving || !isValid}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          </Box>
        )}
      </Form>
    </ModalRoot>
  );
};

export default EditUserModal;
