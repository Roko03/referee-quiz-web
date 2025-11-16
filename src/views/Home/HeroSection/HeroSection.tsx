import React from 'react';

import Link from 'next/link';
import { Box, Container, Typography, Button } from '@mui/material';
import { PlayCircle, EmojiEvents } from '@mui/icons-material';

import styles from './HeroSection.module.scss';

const HeroSection = () => (
  <Box className={styles.hero}>
    <Box className={styles.background} />

    <Container maxWidth="xl" className={styles.container}>
      <Typography variant="h1" className={styles.title}>
        Master the Laws of Football
      </Typography>
      <Typography variant="h5" className={styles.subtitle}>
        Test your knowledge of official football rules with our comprehensive quiz platform
      </Typography>
      <Box className={styles.actions}>
        <Button
          size="large"
          variant="contained"
          startIcon={<PlayCircle />}
          href="#categories"
          className={styles.primaryButton}
        >
          Start Quiz
        </Button>
        <Button size="large" variant="outlined" component={Link} href="/leaderboard" startIcon={<EmojiEvents />}>
          View Leaderboard
        </Button>
      </Box>
    </Container>
  </Box>
);

export default HeroSection;
