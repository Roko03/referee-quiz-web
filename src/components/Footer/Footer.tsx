'use client';

import React from 'react';

import Link from 'next/link';
import { Box, Container, Grid, Typography, IconButton, Divider } from '@mui/material';
import { GitHub, Twitter, Email } from '@mui/icons-material';

const Footer = () => (
  <Box
    component="footer"
    sx={{
      borderTop: '1px solid',
      borderColor: 'divider',
      background: 'linear-gradient(180deg, hsl(220, 24%, 9%), hsl(220, 24%, 7%))',
      py: 6,
    }}
  >
    <Container maxWidth="xl">
      <Grid container spacing={4}>
        {/* Brand */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, hsl(142, 76%, 36%), hsl(142, 76%, 56%))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '1.125rem',
              color: 'hsl(220, 26%, 6%)',
              mb: 2,
            }}
          >
            FR
          </Box>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Football Rules Quiz
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 400 }}>
            Master the official laws of football with our comprehensive quiz platform. Test your knowledge and compete
            with players worldwide.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              href="#"
              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
              aria-label="GitHub"
            >
              <GitHub />
            </IconButton>
            <IconButton
              href="#"
              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
              aria-label="Twitter"
            >
              <Twitter />
            </IconButton>
            <IconButton
              href="#"
              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
              aria-label="Email"
            >
              <Email />
            </IconButton>
          </Box>
        </Grid>

        {/* Quick Links */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Quick Links
          </Typography>
          <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
            <Box component="li" sx={{ mb: 1 }}>
              <Link href="/" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' }, transition: 'color 0.2s' }}
                >
                  Home
                </Typography>
              </Link>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Link href="/leaderboard" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' }, transition: 'color 0.2s' }}
                >
                  Leaderboard
                </Typography>
              </Link>
            </Box>
          </Box>
        </Grid>

        {/* Resources */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Resources
          </Typography>
          <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
            <Box component="li" sx={{ mb: 1 }}>
              <Link href="/privacy" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' }, transition: 'color 0.2s' }}
                >
                  Privacy Policy
                </Typography>
              </Link>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Link href="/terms" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' }, transition: 'color 0.2s' }}
                >
                  Terms of Service
                </Typography>
              </Link>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="body2" color="text.secondary" align="center">
        &copy; {new Date().getFullYear()} Football Rules Quiz. All rights reserved.
      </Typography>
    </Container>
  </Box>
);

export default Footer;
