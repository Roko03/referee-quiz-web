import React from 'react';

import Link from 'next/link';
import { Box, Container, Typography, Button } from '@mui/material';
import { PlayCircle, Award } from '@mui/icons-material';

const HeroSection = () => (
  <Box
    sx={{
      position: 'relative',
      pt: 2,
      overflow: 'hidden',
    }}
  >
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/assets/hero-stadium.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(11, 15, 25, 0.5), rgba(11, 15, 25, 0.8), rgb(11, 15, 25))',
        },
      }}
    />

    <Container
      maxWidth="xl"
      sx={{
        position: 'relative',
        zIndex: 10,
        py: { xs: 10, md: 16 },
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '2.5rem', md: '4rem' },
          fontWeight: 700,
          mb: 3,
          background: 'linear-gradient(135deg, hsl(142, 76%, 36%), hsl(142, 76%, 56%))',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Master the Laws of Football
      </Typography>
      <Typography
        variant="h5"
        sx={{
          fontSize: { xs: '1.25rem', md: '1.5rem' },
          color: 'text.secondary',
          mb: 4,
          maxWidth: 800,
          mx: 'auto',
        }}
      >
        Test your knowledge of official football rules with our comprehensive quiz platform
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
        <Button
          size="large"
          variant="contained"
          startIcon={<PlayCircle />}
          href="#categories"
          sx={{
            boxShadow: '0 0 40px hsla(142, 76%, 45%, 0.15)',
          }}
        >
          Start Quiz
        </Button>
        <Button size="large" variant="outlined" component={Link} href="/leaderboard" startIcon={<Award />}>
          View Leaderboard
        </Button>
      </Box>
    </Container>
  </Box>
);

export default HeroSection;
