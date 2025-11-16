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
  Chip,
  SelectChangeEvent,
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

interface QuizResponse {
  id: string;
}

const CustomQuizPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('question_categories').select('id, name').order('name');

      const categoriesData = data as Category[] | null;

      if (categoriesData) {
        setCategories(categoriesData);
      }

      setLoading(false);
    };

    fetchCategories();
  }, []);

  const handleCreateQuiz = async () => {
    if (selectedCategories.length === 0) return;

    setCreating(true);

    const quizData: QuizInsert = {
      name: 'Custom Quiz',
      category_id: selectedCategories[0], // Use first category for backward compatibility
      question_count: questionCount,
      is_custom: true,
    };

    // Type assertion needed due to overly strict Supabase generated types
    const { data } = await supabase
      .from('quizzes')
      .insert(quizData as unknown as never)
      .select('id')
      .single();

    const quiz = data as QuizResponse | null;

    if (quiz) {
      router.push(`/quiz/${quiz.id}`);
    }

    setCreating(false);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;

    setSelectedCategories(typeof value === 'string' ? value.split(',') : value);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
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
                <InputLabel>Select Categories</InputLabel>
                <Select
                  multiple
                  value={selectedCategories}
                  label="Select Categories"
                  onChange={handleCategoryChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const category = categories.find((c) => c.id === value);

                        return (
                          <Chip
                            key={value}
                            label={category?.name || value}
                            size="small"
                            onDelete={() => handleDeleteCategory(value)}
                            onMouseDown={(event) => {
                              event.stopPropagation();
                            }}
                          />
                        );
                      })}
                    </Box>
                  )}
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
                  • Categories: <strong>
                    {selectedCategories.length > 0
                      ? selectedCategories.map((id) => categories.find((c) => c.id === id)?.name).join(', ')
                      : 'None'}
                  </strong>
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
                disabled={selectedCategories.length === 0 || creating}
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
