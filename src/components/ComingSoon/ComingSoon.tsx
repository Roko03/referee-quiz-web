import React from 'react';

import Link from 'next/link';
import { Box, Container, Typography, Button } from '@mui/material';
import { Home, Construction } from '@mui/icons-material';

import Layout from '@/components/Layout';

interface ComingSoonProps {
  title: string;
  description?: string;
}

const ComingSoon = ({ title, description }: ComingSoonProps) => (
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
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, hsl(142, 76%, 36%), hsl(142, 76%, 56%))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <Construction sx={{ fontSize: 40, color: 'hsl(220, 26%, 6%)' }} />
        </Box>

        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          {title}
        </Typography>

        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          Coming Soon
        </Typography>

        {description && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
            {description}
          </Typography>
        )}

        <Button variant="contained" size="large" component={Link} href="/" startIcon={<Home />} sx={{ mt: 2 }}>
          Back to Home
        </Button>
      </Box>
    </Container>
  </Layout>
);

export default ComingSoon;
