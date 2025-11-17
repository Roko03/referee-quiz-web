'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Alert,
  Snackbar,
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/valtio/auth';
import Form from '@/components/Forms/Form';
import FormInput from '@/components/Forms/FormInput';

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
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);
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
      const { data } = await supabase
        .from('profiles')
        .select('username, first_name, last_name, avatar_url')
        .eq('id', user.id)
        .single();

      const profile = data as ProfileData | null;

      if (profile) {
        setProfileData({
          username: profile.username || '',
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          avatarUrl: profile.avatar_url || '',
        });
      }

      setLoading(false);
    };

    fetchProfile();
  }, [user, router]);

  const handleSubmit = async (formData: ProfileFormData) => {
    if (!user) return;

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
      .eq('id', user.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push('/profile'), 1500);
    }

    setSaving(false);
  };

  if (loading || !profileData) {
    return (
      <Layout>
        <Container maxWidth="sm" sx={{ py: 6 }}>
          <Typography>Loading...</Typography>
        </Container>
      </Layout>
    );
  }

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
            <Form<ProfileFormData>
              onSubmit={handleSubmit}
              defaultValues={profileData}
            >
              {({ watch }) => {
                const avatarUrl = watch('avatarUrl');
                const firstName = watch('firstName');
                const lastName = watch('lastName');
                const username = watch('username');

                const currentInitials = firstName && lastName
                  ? `${firstName[0]}${lastName[0]}`.toUpperCase()
                  : username.substring(0, 2).toUpperCase();

                return (
                  <>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                      <Avatar
                        src={avatarUrl || undefined}
                        sx={{
                          width: 120,
                          height: 120,
                          fontSize: '2.5rem',
                          background: 'linear-gradient(135deg, hsl(142, 76%, 36%), hsl(142, 76%, 56%))',
                          color: 'hsl(220, 26%, 6%)',
                          mb: 2,
                        }}
                      >
                        {currentInitials}
                      </Avatar>
                      <Typography variant="caption" color="text.secondary">
                        Avatar URL updated below
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <FormInput
                        name="username"
                        label="Username"
                        fullWidth
                        helperText="Your unique username"
                        validate={{
                          required: (value: string) => !!value.trim() || 'Username is required',
                        }}
                      />

                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormInput
                          name="firstName"
                          label="First Name"
                          fullWidth
                        />
                        <FormInput
                          name="lastName"
                          label="Last Name"
                          fullWidth
                        />
                      </Box>

                      <FormInput
                        name="avatarUrl"
                        label="Avatar URL"
                        fullWidth
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
                  </>
                );
              }}
            </Form>
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
