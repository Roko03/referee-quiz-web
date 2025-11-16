'use client';

import React from 'react';
import {
  SwipeableDrawer,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import styles from './SwipeableModal.module.scss';

interface SwipeableModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const SwipeableModal: React.FC<SwipeableModalProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
}) => (
  <SwipeableDrawer
    anchor="bottom"
    open={open}
    onClose={onClose}
    onOpen={() => {}}
    disableSwipeToOpen
    ModalProps={{
      keepMounted: true,
    }}
    PaperProps={{
      className: styles.paper,
    }}
  >
    <Box className={styles.puller} />

    <Box className={styles.container}>
      {title && (
        <Box className={styles.header}>
          <Typography variant="h6" className={styles.title}>
            {title}
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            className={styles.closeButton}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      )}

      <Box className={styles.content}>
        {children}
      </Box>

      {actions && (
        <Box className={styles.actions}>
          {actions}
        </Box>
      )}
    </Box>
  </SwipeableDrawer>
);

export default SwipeableModal;
