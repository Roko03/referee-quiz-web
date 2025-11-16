'use client';

import React, { useState } from 'react';
import { Box, Button, InputAdornment, IconButton, Divider, Typography, Grid } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Form from '@/components/Forms/Form';
import FormInput from '@/components/Forms/FormInput';

interface SignUpFormProps {
  onSubmit: (email: string, password: string, firstName: string, lastName: string, username: string) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  loading: boolean;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  username: string;
}

const SignUpForm = ({ onSubmit, onGoogleSignIn, loading }: SignUpFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (data: FormData) => {
    await onSubmit(data.email, data.password, data.firstName, data.lastName, data.username);
  };

  return (
    <Form<FormData>
      onSubmit={handleSubmit}
      defaultValues={{
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        username: '',
      }}
    >
      {({ watch }) => {
        const password = watch('password');

        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormInput
                  name="firstName"
                  label="First Name"
                  fullWidth
                  validate={{
                    required: 'First name is required',
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormInput
                  name="lastName"
                  label="Last Name"
                  fullWidth
                  validate={{
                    required: 'Last name is required',
                  }}
                />
              </Grid>
            </Grid>

            <FormInput
              name="username"
              label="Username"
              fullWidth
              validate={{
                required: 'Username is required',
              }}
            />

            <FormInput
              name="email"
              label="Email"
              type="email"
              placeholder="your@email.com"
              fullWidth
              validate={{
                required: 'Email is required',
              }}
            />

            <FormInput
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              validate={{
                required: 'Password is required',
                minLength: (value: string) => value.length >= 6 || 'Password must be at least 6 characters',
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormInput
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              validate={{
                required: 'Please confirm your password',
                matchPassword: (value: string) => value === password || 'Passwords do not match',
              }}
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
              onClick={onGoogleSignIn}
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
        );
      }}
    </Form>
  );
};

export default SignUpForm;
