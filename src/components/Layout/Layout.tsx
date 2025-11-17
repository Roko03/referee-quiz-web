'use client';

import React from 'react';

import { Box } from '@mui/material';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navigation />
    <Box component="main" sx={{ flexGrow: 1, pt: 8 }}>
      {children}
    </Box>
    <Footer />
  </Box>
);

export default Layout;
