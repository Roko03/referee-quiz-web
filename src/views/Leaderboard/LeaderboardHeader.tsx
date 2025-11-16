import React from 'react';

import { Box, Typography } from '@mui/material';
import { Trophy } from '@mui/icons-material';

const LeaderboardHeader = () => (
  <Box sx={{ textAlign: 'center', mb: 6 }}>
    <Box
      sx={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, hsl(142, 76%, 36%), hsl(142, 76%, 56%))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mx: 'auto',
        mb: 2,
      }}
    >
      <Trophy sx={{ fontSize: 32, color: 'hsl(220, 26%, 6%)' }} />
    </Box>
    <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
      Global Leaderboard
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Top performers ranked by average quiz scores
    </Typography>
  </Box>
);

export default LeaderboardHeader;
