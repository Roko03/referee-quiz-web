'use client';

import React from 'react';

import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  actions?: React.ReactNode;
}

const Modal = ({ open, onClose, title, children, maxWidth = 'sm', fullWidth = true, actions }: ModalProps) => (
  <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth={fullWidth}>
    {title && <DialogTitle>{title}</DialogTitle>}
    <DialogContent>{children}</DialogContent>
    {actions && <DialogActions>{actions}</DialogActions>}
  </Dialog>
);

export default Modal;
