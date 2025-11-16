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
  Grid,
} from '@mui/material';
import { PlayCircle, ArrowBack, Quiz } from '@mui/icons-material';

import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase/client';

interface QuizData {
  id: string;
  name: string;
  description: string | null;
  question_count: number;
  difficulty: string | null;
}

interface QuizListingPageProps {
  categoryName: string;
}

const QuizListingPage = ({ categoryName }: QuizListingPageProps) => {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (categoryName === 'all-categories') {
        router.push('/');

        return;
      }

      const { data: category } = await supabase
        .from('question_categories')
        .select('id')
        .eq('name', categoryName)
        .single();

      if (!category) {
        router.push('/');

        return;
      }

      const { data: quizzesData } = await supabase
        .from('quizzes')
        .select('id, name, description, question_count, difficulty')
        .eq('category_id', category.id)
        .order('name');

      if (quizzesData) {
        setQuizzes(quizzesData);
      }

      setLoading(false);
    };

    fetchQuizzes();
  }, [categoryName, router]);

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Typography>Loading quizzes...</Typography>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/')}
          sx={{ mb: 3 }}
        >
          Back to Categories
        </Button>

        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          {categoryName} Quizzes
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Select a quiz to test your knowledge
        </Typography>

        {quizzes.length === 0 ? (
          <Card>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Quiz sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>
                No Quizzes Available
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                There are no quizzes available in this category yet. Check back later!
              </Typography>
              <Button variant="contained" component={Link} href="/">
                Browse Other Categories
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {quizzes.map((quiz) => (
              <Grid key={quiz.id} size={{ xs: 12, md: 6 }}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: '0 0 40px hsla(142, 76%, 45%, 0.15)',
                    },
                  }}
                  onClick={() => router.push(`/quiz/${quiz.id}`)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, hsl(142, 76%, 36%), hsl(142, 76%, 56%))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                        }}
                      >
                        <PlayCircle sx={{ fontSize: 24, color: 'hsl(220, 26%, 6%)' }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          {quiz.name}
                        </Typography>
                        {quiz.difficulty && (
                          <Chip
                            label={quiz.difficulty}
                            size="small"
                            color={(() => {
                              if (quiz.difficulty === 'Easy') return 'success';
                              if (quiz.difficulty === 'Medium') return 'warning';

                              return 'error';
                            })()}
                          />
                        )}
                      </Box>
                    </Box>

                    {quiz.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {quiz.description}
                      </Typography>
                    )}

                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Chip label={`${quiz.question_count} Questions`} size="small" variant="outlined" />
                      <Chip label="45s per question" size="small" variant="outlined" />
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<PlayCircle />}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/quiz/${quiz.id}`);
                      }}
                    >
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Layout>
  );
};

export default QuizListingPage;
