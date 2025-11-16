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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Alert,
} from '@mui/material';
import { PlayCircle, Settings } from '@mui/icons-material';

import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase/client';

interface Category {
  id: string;
  name: string;
}

interface QuizInsert {
  name: string;
  category_id: string;
  question_count: number;
  is_custom: boolean;
}

const CustomQuizPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('question_categories').select('id, name').order('name');

      if (data) {
        setCategories(data);
      }

      setLoading(false);
    };

    fetchCategories();
  }, []);

  const handleCreateQuiz = async () => {
    if (!selectedCategory) return;

    setCreating(true);

    const quizData: QuizInsert = {
      name: 'Custom Quiz',
      category_id: selectedCategory,
      question_count: questionCount,
      is_custom: true,
    };

    const { data: quiz } = await supabase.from('quizzes').insert(quizData).select('id').single();

    if (quiz) {
      router.push(`/quiz/${quiz.id}`);
    }

    setCreating(false);
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

  return (
    <Layout>
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, hsl(142, 76%, 36%), hsl(142, 76%, 56%))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <Settings sx={{ fontSize: 40, color: 'hsl(220, 26%, 6%)' }} />
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            Custom Quiz Builder
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create your own personalized quiz
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 4 }}>
          Custom quizzes are for practice only and won&apos;t be counted in the leaderboard.
        </Alert>

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Select Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Select Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box>
                <Typography gutterBottom sx={{ mb: 2 }}>
                  Number of Questions: <strong>{questionCount}</strong>
                </Typography>
                <Slider
                  value={questionCount}
                  onChange={(_, newValue) => setQuestionCount(newValue as number)}
                  min={5}
                  max={50}
                  step={5}
                  marks={[
                    { value: 5, label: '5' },
                    { value: 10, label: '10' },
                    { value: 24, label: '24' },
                    { value: 50, label: '50' },
                  ]}
                  valueLabelDisplay="auto"
                />
                <Typography variant="caption" color="text.secondary">
                  Standard quizzes have 24 questions
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor: 'action.hover',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Quiz Settings:
                </Typography>
                <Typography variant="body2">
                  • Time per question: <strong>45 seconds</strong>
                </Typography>
                <Typography variant="body2">
                  • Questions: <strong>{questionCount}</strong>
                </Typography>
                <Typography variant="body2">
                  • Category: <strong>{categories.find((c) => c.id === selectedCategory)?.name || 'None'}</strong>
                </Typography>
                <Typography variant="body2">
                  • Leaderboard: <strong>No</strong> (custom quiz)
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleCreateQuiz}
                disabled={!selectedCategory || creating}
                startIcon={<PlayCircle />}
              >
                {creating ? 'Creating Quiz...' : 'Start Custom Quiz'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
};

export default CustomQuizPage;
