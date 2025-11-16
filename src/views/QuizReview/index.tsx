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
  Button,
  Chip,
  Divider,
  Grid,
} from '@mui/material';
import { CheckCircle, Cancel, Home, Replay, EmojiEvents } from '@mui/icons-material';

import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase/client';

interface UserAnswer {
  question_id: string;
  answer_id: string;
  time_taken: number;
}

interface Answer {
  id: string;
  text: string;
  is_correct: boolean;
}

interface Question {
  id: string;
  question_text: string;
  answers: Answer[];
}

interface SessionData {
  id: string;
  correct_count: number;
  total_questions: number;
  score: number;
  passed: boolean;
  completed_at: string;
}

interface QuizReviewPageProps {
  sessionId: string;
}

const QuizReviewPage = ({ sessionId }: QuizReviewPageProps) => {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      const { data: sessionData } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('id', sessionId)
        .single<SessionData>();

      if (!sessionData) {
        router.push('/');

        return;
      }

      const { data: answersData } = await supabase
        .from('user_answers')
        .select('question_id, answer_id, time_taken')
        .eq('session_id', sessionId);

      const questionIds = answersData?.map((a) => a.question_id) || [];
      const { data: questionsData } = await supabase
        .from('questions')
        .select(
          `
          id,
          question_text,
          answers(id, text, is_correct)
        `,
        )
        .in('id', questionIds);

      setSession(sessionData);
      setUserAnswers(answersData || []);
      setQuestions((questionsData as Question[]) || []);
      setLoading(false);
    };

    fetchReview();
  }, [sessionId, router]);

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Typography>Loading results...</Typography>
        </Container>
      </Layout>
    );
  }

  if (!session) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Typography>Quiz session not found.</Typography>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 6 }}>
        {/* Results Summary */}
        <Card
          sx={{
            mb: 4,
            background: session.passed
              ? 'linear-gradient(135deg, hsl(142, 76%, 36%), hsl(142, 76%, 56%))'
              : 'linear-gradient(135deg, hsl(0, 72%, 41%), hsl(0, 72%, 61%))',
            color: 'white',
          }}
        >
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              {session.passed ? (
                <EmojiEvents sx={{ fontSize: 40, color: 'white' }} />
              ) : (
                <Replay sx={{ fontSize: 40, color: 'white' }} />
              )}
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {session.passed ? 'Congratulations!' : 'Keep Practicing!'}
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 700, my: 2 }}>
              {session.score.toFixed(0)}%
            </Typography>
            <Typography variant="h6">
              {session.correct_count} out of {session.total_questions} correct
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
              {session.passed ? 'You passed! Great job!' : 'You need 90% to pass. Try again!'}
            </Typography>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                  {session.score.toFixed(0)}%
                </Typography>
                <Typography color="text.secondary">Final Score</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                  {session.correct_count}
                </Typography>
                <Typography color="text.secondary">Correct Answers</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="error.main" sx={{ fontWeight: 700 }}>
                  {session.total_questions - session.correct_count}
                </Typography>
                <Typography color="text.secondary">Incorrect Answers</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Question Review */}
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Review Your Answers
        </Typography>

        {questions.map((question, index) => {
          const userAnswer = userAnswers.find((a) => a.question_id === question.id);
          const userAnswerObj = question.answers.find((a) => a.id === userAnswer?.answer_id);
          const correctAnswer = question.answers.find((a) => a.is_correct);
          const isCorrect = userAnswerObj?.is_correct || false;

          return (
            <Card key={question.id} sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Chip
                    label={`Q${index + 1}`}
                    size="small"
                    sx={{ mr: 2, mt: 0.5 }}
                    color={isCorrect ? 'success' : 'error'}
                  />
                  <Typography variant="h6" sx={{ flex: 1 }}>
                    {question.question_text}
                  </Typography>
                  {isCorrect ? (
                    <CheckCircle color="success" />
                  ) : (
                    <Cancel color="error" />
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                {question.answers.map((answer) => {
                  const isUserAnswer = answer.id === userAnswer?.answer_id;
                  const isCorrectAnswer = answer.is_correct;

                  return (
                    <Box
                      key={answer.id}
                      sx={{
                        p: 2,
                        mb: 1,
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: isCorrectAnswer
                          ? 'success.main'
                          : isUserAnswer
                            ? 'error.main'
                            : 'divider',
                        bgcolor: isCorrectAnswer
                          ? 'success.light'
                          : isUserAnswer
                            ? 'error.light'
                            : 'background.paper',
                      }}
                    >
                      <Typography
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        {answer.text}
                        {isCorrectAnswer && <Chip label="Correct" size="small" color="success" />}
                        {isUserAnswer && !isCorrectAnswer && <Chip label="Your Answer" size="small" color="error" />}
                      </Typography>
                    </Box>
                  );
                })}

                {userAnswer && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    Time taken: {userAnswer.time_taken}s
                  </Typography>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
          <Button variant="outlined" size="large" component={Link} href="/" startIcon={<Home />}>
            Back to Home
          </Button>
          <Button variant="contained" size="large" component={Link} href="/leaderboard" startIcon={<EmojiEvents />}>
            View Leaderboard
          </Button>
        </Box>
      </Container>
    </Layout>
  );
};

export default QuizReviewPage;
