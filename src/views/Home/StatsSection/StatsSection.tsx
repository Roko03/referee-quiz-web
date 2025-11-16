'use client';

import React from 'react';

import { Box, Container, Typography, Grid } from '@mui/material';

import styles from './StatsSection.module.scss';

const StatsSection = () => (
  <Box className={styles.stats}>
    <Container maxWidth="xl">
      <Grid container spacing={4} className={styles.grid}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h3" color="primary" className={styles.number}>
            24
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Questions per Quiz
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h3" color="primary" className={styles.number}>
            45s
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Time per Question
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h3" color="primary" className={styles.number}>
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
