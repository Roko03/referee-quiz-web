'use client';

import React, { useState, useEffect } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Grid,
} from '@mui/material';
import { Edit, EmojiEvents, CheckCircle, Cancel, History } from '@mui/icons-material';

import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/valtio/auth';

interface ProfileData {
  username: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

interface QuizStats {
  totalQuizzes: number;
  averageScore: number;
  passRate: number;
  bestScore: number;
}

const ProfilePage = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState<QuizStats>({
    totalQuizzes: 0,
    averageScore: 0,
    passRate: 0,
    bestScore: 0,
  });
  const [loading, setLoading] = useState(true);

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
        .single<ProfileData>();

      if (profileData) {
        setProfile(profileData);
      }

      const { data: sessions } = await supabase
        .from('quiz_sessions')
        .select('score, passed')
        .eq('user_id', user.id)
        .eq('total_questions', 24)
        .not('completed_at', 'is', null);

      if (sessions && sessions.length > 0) {
        const totalQuizzes = sessions.length;
        const averageScore = sessions.reduce((sum, s) => sum + s.score, 0) / totalQuizzes;
        const passedQuizzes = sessions.filter((s) => s.passed).length;
        const passRate = (passedQuizzes / totalQuizzes) * 100;
        const bestScore = Math.max(...sessions.map((s) => s.score));

        setStats({
          totalQuizzes,
          averageScore: Math.round(averageScore),
          passRate: Math.round(passRate),
          bestScore: Math.round(bestScore),
        });
      }

      setLoading(false);
    };

    fetchProfile();
  }, [user, router]);

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Typography>Loading profile...</Typography>
        </Container>
      </Layout>
    );
  }

  const displayName =
    profile?.first_name && profile?.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : profile?.username || 'User';

  const initials =
    profile?.first_name && profile?.last_name
      ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
      : profile?.username?.substring(0, 2).toUpperCase() || 'U';

  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 6 }}>
        {/* Profile Header */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
              <Avatar
                src={profile?.avatar_url || undefined}
                sx={{
                  width: 100,
                  height: 100,
                  fontSize: '2rem',
                  background: 'linear-gradient(135deg, hsl(142, 76%, 36%), hsl(142, 76%, 56%))',
                  color: 'hsl(220, 26%, 6%)',
                }}
              >
                {initials}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {displayName}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  @{profile?.username}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="contained" component={Link} href="/profile/edit" startIcon={<Edit />}>
                    Edit Profile
                  </Button>
                  <Button variant="outlined" component={Link} href="/profile/history" startIcon={<History />}>
                    Quiz History
                  </Button>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Your Statistics
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <EmojiEvents sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                  {stats.totalQuizzes}
                </Typography>
                <Typography color="text.secondary">Total Quizzes</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                  {stats.averageScore}%
                </Typography>
                <Typography color="text.secondary">Average Score</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <EmojiEvents sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700 }}>
                  {stats.bestScore}%
                </Typography>
                <Typography color="text.secondary">Best Score</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <CheckCircle sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h4" color="info.main" sx={{ fontWeight: 700 }}>
                  {stats.passRate}%
                </Typography>
                <Typography color="text.secondary">Pass Rate</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {stats.totalQuizzes === 0 && (
          <Card>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Cancel sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                No Quiz History Yet
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Take your first quiz to start tracking your progress!
              </Typography>
              <Button variant="contained" component={Link} href="/">
                Start a Quiz
              </Button>
            </CardContent>
          </Card>
        )}
      </Container>
    </Layout>
  );
};

export default ProfilePage;
