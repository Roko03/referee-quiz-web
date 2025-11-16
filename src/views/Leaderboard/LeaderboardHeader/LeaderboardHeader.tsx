import React from 'react';

import { Box, Typography } from '@mui/material';
import { EmojiEvents } from '@mui/icons-material';

import styles from './LeaderboardHeader.module.scss';

const LeaderboardHeader = () => (
  <Box className={styles.header}>
    <Box className={styles.icon}>
      <EmojiEvents sx={{ fontSize: 32, color: 'hsl(220, 26%, 6%)' }} />
    </Box>
    <Typography variant="h3" className={styles.title}>
      Global Leaderboard
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Top performers ranked by average quiz scores
    </Typography>
  </Box>
);

export default LeaderboardHeader;
