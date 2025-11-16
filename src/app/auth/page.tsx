'use client';

import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  IconButton,
  InputAdornment,
  Divider,
  Alert,
  Snackbar,
  Grid,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { useAuthStore, signIn, signUp, signInWithGoogle } from '@/valtio/auth';

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
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    username: '',
  });

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await signIn(signInData.email, signInData.password);

    if (signInError) {
      setError(signInError.message);
    }

    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match');

      return;
    }

    setLoading(true);

    const { error: signUpError } = await signUp(
      signUpData.email,
      signUpData.password,
      signUpData.firstName,
      signUpData.lastName,
      signUpData.username,
    );

    if (signUpError) {
      setError(signUpError.message);
    } else {
      setSuccess('Account created! You can now sign in with your credentials.');
      setTabValue(0);
      setSignUpData({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        username: '',
      });
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

            {/* Sign In Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box component="form" onSubmit={handleSignIn} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  value={signInData.email}
                  onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                  required
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showSignInPassword ? 'text' : 'password'}
                  value={signInData.password}
                  onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowSignInPassword(!showSignInPassword)} edge="end">
                          {showSignInPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
                  Sign In
                </Button>

                <Divider sx={{ my: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    OR CONTINUE WITH
                  </Typography>
                </Divider>

                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  startIcon={
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  }
                >
                  Google
                </Button>
              </Box>
            </TabPanel>

            {/* Sign Up Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box component="form" onSubmit={handleSignUp} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={signUpData.firstName}
                      onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={signUpData.lastName}
                      onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                      required
                    />
                  </Grid>
                </Grid>

                <TextField
                  fullWidth
                  label="Username"
                  value={signUpData.username}
                  onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value })}
                  required
                />

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                  required
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showSignUpPassword ? 'text' : 'password'}
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowSignUpPassword(!showSignUpPassword)} edge="end">
                          {showSignUpPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={signUpData.confirmPassword}
                  onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button type="submit" variant="contained" size="large" fullWidth disabled={loading}>
                  Create Account
                </Button>

                <Divider sx={{ my: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    OR CONTINUE WITH
                  </Typography>
                </Divider>

                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  startIcon={
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  }
                >
                  Google
                </Button>
              </Box>
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
