'use client';

import React, { useEffect, useState } from 'react';

import { Box, Container, Typography, Card, CardContent, Avatar, Divider } from '@mui/material';
import { Trophy, EmojiEvents, WorkspacePremium } from '@mui/icons-material';

import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase/client';

interface LeaderboardEntry {
  username: string;
  totalQuizzes: number;
  averageScore: number;
  passRate: number;
}

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data: sessions } = await supabase
        .from('quiz_sessions')
        .select(
          `
          user_id,
          correct_count,
          total_questions,
          passed
        `,
        )
        .eq('total_questions', 24)
        .not('user_id', 'is', null);

      if (sessions) {
        const userStats = new Map<
          string,
          {
            totalQuizzes: number;
            totalScore: number;
            passedQuizzes: number;
          }
        >();

        sessions.forEach((session) => {
          if (!session.user_id) return;

          const stats = userStats.get(session.user_id) || {
            totalQuizzes: 0,
            totalScore: 0,
            passedQuizzes: 0,
          };

          stats.totalQuizzes += 1;
          stats.totalScore += (session.correct_count / session.total_questions) * 100;
          if (session.passed) stats.passedQuizzes += 1;

          userStats.set(session.user_id, stats);
        });

        const leaderboardData = await Promise.all(
          Array.from(userStats.entries()).map(async ([userId, stats]) => {
            const { data: profile } = await supabase.from('profiles').select('username').eq('id', userId).single();

            return {
              username: profile?.username || 'Anonymous',
              totalQuizzes: stats.totalQuizzes,
              averageScore: Math.round(stats.totalScore / stats.totalQuizzes),
              passRate: Math.round((stats.passedQuizzes / stats.totalQuizzes) * 100),
            };
          }),
        );

        leaderboardData.sort((a, b) => b.averageScore - a.averageScore);
        setLeaderboard(leaderboardData.slice(0, 20));
      }
    };

    fetchLeaderboard();
  }, []);

  const getMedalIcon = (index: number) => {
    if (index === 0) {
      return <Trophy sx={{ fontSize: 24, color: 'hsl(38, 92%, 50%)' }} />;
    }

    if (index === 1) {
      return <EmojiEvents sx={{ fontSize: 24, color: 'text.secondary' }} />;
    }

    if (index === 2) {
      return <WorkspacePremium sx={{ fontSize: 24, color: 'hsl(38, 92%, 50%)', opacity: 0.7 }} />;
    }

    return (
      <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.secondary' }}>
        {index + 1}
      </Typography>
    );
  };

  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, hsl(142, 76%, 36%), hsl(142, 76%, 56%))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <Trophy sx={{ fontSize: 32, color: 'hsl(220, 26%, 6%)' }} />
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            Global Leaderboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Top performers ranked by average quiz scores
          </Typography>
        </Box>

        <Card
          sx={{
            boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.5)',
            background: 'linear-gradient(180deg, hsl(220, 24%, 9%), hsl(220, 24%, 7%))',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Top 20 Players
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {leaderboard.map((entry, index) => (
                <Box key={entry.username}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: index < 3 ? 'rgba(142, 76%, 45%, 0.1)' : 'rgba(220, 20%, 14%, 0.3)',
                      border: index < 3 ? '1px solid rgba(142, 76%, 45%, 0.2)' : 'none',
                    }}
                  >
                    <Box sx={{ width: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {getMedalIcon(index)}
                    </Box>

                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        background: 'linear-gradient(135deg, hsl(142, 76%, 36%), hsl(142, 76%, 56%))',
                        color: 'hsl(220, 26%, 6%)',
                        fontWeight: 600,
                      }}
                    >
                      {entry.username.substring(0, 2).toUpperCase()}
                    </Avatar>

                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {entry.username}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {entry.totalQuizzes} {entry.totalQuizzes === 1 ? 'quiz' : 'quizzes'}
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
                        {entry.averageScore}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {entry.passRate}% pass rate
                      </Typography>
                    </Box>
                  </Box>
                  {index < leaderboard.length - 1 && <Divider sx={{ my: 1 }} />}
                </Box>
              ))}

              {leaderboard.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="body1" color="text.secondary">
                    No quiz attempts yet. Be the first to take a quiz!
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
};

export default LeaderboardPage;
