'use client';

import { useEffect, useState } from 'react';

import { Container } from '@mui/material';

import LeaderboardHeader from '@/views/Leaderboard/LeaderboardHeader';
import LeaderboardList from '@/views/Leaderboard/LeaderboardList';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase/client';

interface LeaderboardEntry {
  username: string;
  totalQuizzes: number;
  averageScore: number;
  passRate: number;
}

interface QuizSessionData {
  user_id: string | null;
  correct_count: number;
  total_questions: number;
  passed: boolean;
}

interface ProfileData {
  username: string;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data: sessions } = await supabase
        .from('quiz_sessions')
        .select('user_id, correct_count, total_questions, passed')
        .eq('total_questions', 24)
        .not('user_id', 'is', null)
        .returns<QuizSessionData[]>();

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
            const { data: profile } = await supabase
              .from('profiles')
              .select('username')
              .eq('id', userId)
              .single<ProfileData>();

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

  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <LeaderboardHeader />
        <LeaderboardList entries={leaderboard} />
      </Container>
    </Layout>
  );
}
