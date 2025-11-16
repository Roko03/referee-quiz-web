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
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { ArrowBack, Visibility, CheckCircle, Cancel } from '@mui/icons-material';

import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/valtio/auth';

interface QuizSession {
  id: string;
  completed_at: string;
  score: number;
  correct_count: number;
  total_questions: number;
  passed: boolean;
}

const QuizHistoryPage = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState<QuizSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth');

      return;
    }

    const fetchHistory = async () => {
      const { data } = await supabase
        .from('quiz_sessions')
        .select('id, completed_at, score, correct_count, total_questions, passed')
        .eq('user_id', user.id)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false });

      if (data) {
        setSessions(data);
      }

      setLoading(false);
    };

    fetchHistory();
  }, [user, router]);

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Typography>Loading history...</Typography>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/profile')}
          sx={{ mb: 3 }}
        >
          Back to Profile
        </Button>

        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
          Quiz History
        </Typography>

        {sessions.length === 0 ? (
          <Card>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                No Quiz History Yet
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                You haven't completed any quizzes yet. Start your first quiz to begin tracking your progress!
              </Typography>
              <Button variant="contained" component={Link} href="/">
                Start a Quiz
              </Button>
            </CardContent>
          </Card>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell align="center">Questions</TableCell>
                  <TableCell align="center">Correct</TableCell>
                  <TableCell align="center">Score</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id} hover>
                    <TableCell>
                      {new Date(session.completed_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell align="center">{session.total_questions}</TableCell>
                    <TableCell align="center">
                      {session.correct_count} / {session.total_questions}
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: session.score >= 90 ? 'success.main' : session.score >= 70 ? 'warning.main' : 'error.main',
                        }}
                      >
                        {session.score.toFixed(0)}%
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {session.passed ? (
                        <Chip icon={<CheckCircle />} label="Passed" color="success" size="small" />
                      ) : (
                        <Chip icon={<Cancel />} label="Failed" color="error" size="small" />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        component={Link}
                        href={`/review/${session.id}`}
                        startIcon={<Visibility />}
                        size="small"
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Layout>
  );
};

export default QuizHistoryPage;
