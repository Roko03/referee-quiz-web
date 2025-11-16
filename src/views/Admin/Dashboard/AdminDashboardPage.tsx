'use client';

import React, { useEffect } from 'react';

import { useRouter } from 'next/navigation';
import {
  Container, Box, Typography, Card, CardContent, Button, Grid,
} from '@mui/material';
import { People, Quiz, Assessment } from '@mui/icons-material';

import Layout from '@/components/Layout';
import { useAuthStore } from '@/valtio/auth';

const AdminDashboardPage = () => {
  const { user, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="lg">
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography>Loading...</Typography>
          </Box>
        </Container>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ py: 8 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
            Manage users, questions, and view statistics
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <People sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                    <Typography variant="h5" component="h2">
                      User Management
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Manage user accounts, roles, and permissions
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => router.push('/admin/users')}
                  >
                    Manage Users
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Quiz sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                    <Typography variant="h5" component="h2">
                      Question Management
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Add, edit, and delete quiz questions
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => router.push('/admin/questions')}
                  >
                    Manage Questions
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Assessment sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                    <Typography variant="h5" component="h2">
                      Statistics & Reports
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    View quiz statistics, user performance, and generate reports (Coming Soon)
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
};

export default AdminDashboardPage;
