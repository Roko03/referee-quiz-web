'use client';

import React from 'react';

import Link from 'next/link';
import { Box, Container, Typography, Button } from '@mui/material';
import { Home, ArrowBack } from '@mui/icons-material';

import Layout from '@/components/Layout';

const Error404Page = () => (
  <Layout>
    <Container maxWidth="md">
      <Box
        sx={{
          py: 12,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '4rem', md: '6rem' },
            fontWeight: 700,
            mb: 2,
            background: 'linear-gradient(135deg, hsl(142, 76%, 36%), hsl(142, 76%, 56%))',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
          Oops! The page you are looking for does not exist. It might have been moved or deleted.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="contained" size="large" component={Link} href="/" startIcon={<Home />}>
            Go Home
          </Button>
          <Button variant="outlined" size="large" onClick={() => window.history.back()} startIcon={<ArrowBack />}>
            Go Back
          </Button>
        </Box>
      </Box>
    </Container>
  </Layout>
);

export default Error404Page;
