'use client';

import React from 'react';

import { Container, Typography, Box } from '@mui/material';
import { MDXRemote } from 'next-mdx-remote/rsc';

import Layout from '@/components/Layout';
import { getStaticContent } from '@/lib/mdx';

const TermsPage = () => {
  const { frontmatter, content } = getStaticContent('legal', 'terms-of-service');

  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            mb: 1,
            fontWeight: 700,
          }}
        >
          {frontmatter.title}
        </Typography>

        {frontmatter.lastUpdated && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Last Updated: {frontmatter.lastUpdated}
          </Typography>
        )}

        <Box
          sx={{
            '& h1': {
              fontSize: '2.5rem',
              fontWeight: 700,
              mb: 3,
              mt: 4,
            },
            '& h2': {
              fontSize: '1.75rem',
              fontWeight: 600,
              mb: 2,
              mt: 4,
            },
            '& h3': {
              fontSize: '1.25rem',
              fontWeight: 600,
              mb: 2,
              mt: 3,
            },
            '& p': {
              mb: 2,
              lineHeight: 1.7,
              color: 'text.secondary',
            },
            '& ul, & ol': {
              mb: 2,
              pl: 4,
              color: 'text.secondary',
            },
            '& li': {
              mb: 1,
            },
            '& a': {
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            '& code': {
              bgcolor: 'action.hover',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.875em',
            },
            '& pre': {
              bgcolor: 'action.hover',
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
              mb: 2,
            },
          }}
        >
          <MDXRemote source={content} />
        </Box>
      </Container>
    </Layout>
  );
};

export default TermsPage;
