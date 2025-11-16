'use client';

import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Alert,
  Snackbar,
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';

import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/valtio/auth';

interface ProfileData {
  username: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

interface ProfileUpdate {
  username: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
}

interface ProfileFormData {
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
}

const ProfileEditPage = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState<ProfileFormData>({
    username: '',
    firstName: '',
    lastName: '',
    avatarUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/auth');

      return;
    }

    const fetchProfile = async () => {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username, first_name, last_name, avatar_url')
        .eq('id', user.id)
        .single();

      const data = profileData as ProfileData | null;

      if (data) {
        setFormData({
          username: data.username || '',
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          avatarUrl: data.avatar_url || '',
        });
      }

      setLoading(false);
    };

    fetchProfile();
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const updateData: ProfileUpdate = {
      username: formData.username,
      first_name: formData.firstName,
      last_name: formData.lastName,
      avatar_url: formData.avatarUrl || null,
    };

    const { error: updateError } = await supabase
      .from('profiles')
      .update(updateData as never)
      .eq('id', user?.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push('/profile'), 1500);
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="sm" sx={{ py: 6 }}>
          <Typography>Loading...</Typography>
        </Container>
      </Layout>
    );
  }

  const initials = formData.firstName && formData.lastName
    ? `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase()
    : formData.username.substring(0, 2).toUpperCase();

  return (
    <Layout>
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/profile')}
          sx={{ mb: 3 }}
        >
          Back to Profile
        </Button>

        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
          Edit Profile
        </Typography>

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
              <Avatar
                src={formData.avatarUrl || undefined}
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: '2.5rem',
                  background: 'linear-gradient(135deg, hsl(142, 76%, 36%), hsl(142, 76%, 56%))',
                  color: 'hsl(220, 26%, 6%)',
                  mb: 2,
                }}
              >
                {initials}
              </Avatar>
              <Typography variant="caption" color="text.secondary">
                Avatar URL updated below
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                helperText="Your unique username"
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </Box>

              <TextField
                fullWidth
                label="Avatar URL"
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                helperText="URL to your profile picture"
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={saving}
                startIcon={<Save />}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </CardContent>
        </Card>

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

        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={() => setSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
            Profile updated successfully!
          </Alert>
        </Snackbar>
      </Container>
    </Layout>
  );
};

export default ProfileEditPage;
