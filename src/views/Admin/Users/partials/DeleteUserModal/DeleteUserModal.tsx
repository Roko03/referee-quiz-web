'use client';

import React, { useState } from 'react';
import { Typography, Button } from '@mui/material';
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

interface DeleteUserModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
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
      if (error instanceof Error) {
        // Handle error silently or show user feedback
      }
    } finally {
      setDeleting(false);
    }
  };

  if (!user) return null;

  return (
    <ModalRoot
      open={open}
      onClose={onClose}
      title="Delete User"
      maxWidth="sm"
      fullWidth
      actions={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm} color="error" variant="contained" disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </>
      }
    >
      <Typography>
        Are you sure you want to delete user <strong>{user.username}</strong>?
        This action cannot be undone.
      </Typography>
    </ModalRoot>
  );
};

export default DeleteUserModal;
