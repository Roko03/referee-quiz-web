'use client';

import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { Box, Container, Card, CardContent, Typography, Tabs, Tab, Alert, Snackbar } from '@mui/material';

import { useAuthStore, signIn, signUp, signInWithGoogle } from '@/valtio/auth';

import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

const AuthPage = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message);
    }

    setLoading(false);
  };

  const handleSignUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    username: string,
  ) => {
    setError(null);
    setLoading(true);

    const { error: signUpError } = await signUp(email, password, firstName, lastName, username);

    if (signUpError) {
      setError(signUpError.message);
    } else {
      setSuccess('Account created! You can now sign in with your credentials.');
      setTabValue(0);
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signInWithGoogle();
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        background: 'linear-gradient(135deg, hsl(220, 26%, 6%), hsl(220, 24%, 9%), hsl(220, 20%, 14%))',
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.5)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, hsl(142, 76%, 36%), hsl(142, 76%, 56%))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  color: 'hsl(220, 26%, 6%)',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                FR
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                Football Rules Quiz
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Test your knowledge of football rules
              </Typography>
            </Box>

            <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} variant="fullWidth" sx={{ mb: 2 }}>
              <Tab label="Sign In" />
              <Tab label="Sign Up" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <SignInForm onSubmit={handleSignIn} onGoogleSignIn={handleGoogleSignIn} loading={loading} />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <SignUpForm onSubmit={handleSignUp} onGoogleSignIn={handleGoogleSignIn} loading={loading} />
            </TabPanel>
          </CardContent>
        </Card>

        {/* Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        {/* Success Snackbar */}
        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AuthPage;
