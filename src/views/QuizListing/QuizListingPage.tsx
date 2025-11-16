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
} from '@mui/material';
import { PlayCircle, ArrowBack, Quiz } from '@mui/icons-material';

import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase/client';

interface CategoryData {
  id: string;
}

interface QuizListingPageProps {
  categoryName: string;
}

const QuizListingPage = ({ categoryName }: QuizListingPageProps) => {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      if (categoryName === 'all-categories') {
        router.push('/');

        return;
      }

      const { data: categoryData } = await supabase
        .from('question_categories')
        .select('id')
        .eq('name', categoryName)
        .single();

      const category = categoryData as CategoryData | null;

      if (!category) {
        router.push('/');

        return;
      }

      // Count questions in this category
      const { count } = await supabase
        .from('questions')
        .select('id', { count: 'exact', head: true })
        .eq('category_id', category.id);

      setCategoryId(category.id);
      setQuestionCount(count || 0);
      setLoading(false);
    };

    fetchCategory();
  }, [categoryName, router]);

  const handleStartQuiz = () => {
    if (categoryId) {
      router.push(`/quiz/custom?categories=${categoryId}&count=24`);
    }
  };

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
          {categoryName}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Test your knowledge with {questionCount} questions from this category
        </Typography>

        {questionCount === 0 ? (
          <Card>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Quiz sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>
                No Questions Available
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                There are no questions available in this category yet. Check back later!
              </Typography>
              <Button variant="contained" component={Link} href="/">
                Browse Other Categories
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card
            sx={{
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 0 40px hsla(142, 76%, 45%, 0.15)',
              },
            }}
            onClick={handleStartQuiz}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, hsl(142, 76%, 36%), hsl(142, 76%, 56%))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 3,
                  }}
                >
                  <Quiz sx={{ fontSize: 32, color: 'hsl(220, 26%, 6%)' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                    {categoryName} Quiz
                  </Typography>
                  <Typography color="text.secondary">
                    24 questions • 45 seconds per question
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Chip label={`${questionCount} questions available`} color="primary" sx={{ mr: 1 }} />
                <Chip label="Standard" />
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<PlayCircle />}
                onClick={handleStartQuiz}
              >
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        )}
      </Container>
    </Layout>
  );
};

export default QuizListingPage;
