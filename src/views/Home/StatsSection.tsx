import React from 'react';

import { Box, Container, Typography, Grid } from '@mui/material';

const StatsSection = () => (
  <Box
    sx={{
      py: 6,
      borderTop: '1px solid',
      borderBottom: '1px solid',
      borderColor: 'divider',
      background: 'linear-gradient(180deg, hsl(220, 24%, 9%), hsl(220, 24%, 7%))',
    }}
  >
    <Container maxWidth="xl">
      <Grid container spacing={4} sx={{ textAlign: 'center' }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h3" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
            24
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Questions per Quiz
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h3" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
            45s
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Time per Question
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h3" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
            90%
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Pass Threshold
          </Typography>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default StatsSection;
