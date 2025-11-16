'use client';

import React from 'react';
import { useMediaQuery, useTheme } from '@mui/material';

import Modal from './Modal';
import SwipeableModal from './SwipeableModal';

export interface ModalRootProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  actions?: React.ReactNode;
}

const ModalRoot: React.FC<ModalRootProps> = ({
  open,
  onClose,
  title,
  children,
  maxWidth = 'sm',
  fullWidth = true,
  actions,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isMobile) {
    return (
      <SwipeableModal
        open={open}
        onClose={onClose}
        title={title}
        actions={actions}
      >
        {children}
      </SwipeableModal>
    );
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      actions={actions}
    >
      {children}
    </Modal>
  );
};

export default ModalRoot;
