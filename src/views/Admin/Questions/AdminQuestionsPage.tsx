'use client';

import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  CircularProgress,
  InputAdornment,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';

import Layout from '@/components/Layout';
import { useAuthStore } from '@/valtio/auth';
import { supabase } from '@/lib/supabase/client';

interface Answer {
  id: string;
  text: string;
  is_correct: boolean;
}

interface Question {
  id: string;
  text: string;
  category_id: string;
  created_at: string;
  question_categories: { name: string } | null;
  answers: Answer[];
}

interface Category {
  id: string;
  name: string;
}

const AdminQuestionsPage = () => {
  const { user, loading: authLoading } = useAuthStore();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  const fetchQuestions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('questions')
      .select(`
        *,
        question_categories(name),
        answers(*)
      `)
      .order('created_at', { ascending: false });

    const questionsData = data as Question[] | null;

    if (questionsData) {
      setQuestions(questionsData);
      setFilteredQuestions(questionsData);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('question_categories')
      .select('*')
      .order('name');

    const categoriesData = data as Category[] | null;

    if (categoriesData) {
      setCategories(categoriesData);
    }
  };

  useEffect(() => {
    if (user) {
      fetchQuestions();
      fetchCategories();
    }
  }, [user]);

  useEffect(() => {
    let filtered = questions;

    if (activeTab !== 'all') {
      filtered = filtered.filter((q) => q.category_id === activeTab);
    }

    if (search) {
      filtered = filtered.filter((q) => q.text.toLowerCase().includes(search.toLowerCase()));
    }

    setFilteredQuestions(filtered);
  }, [search, activeTab, questions]);

  if (authLoading || !user) {
    return (
      <Layout>
        <Container maxWidth="lg">
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ py: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1">
              Question Management
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />}>
              Add Question
            </Button>
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
              <Tab label="All" value="all" />
              {categories.map((cat) => (
                <Tab key={cat.id} label={cat.name} value={cat.id} />
              ))}
            </Tabs>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Question</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Answers</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredQuestions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="text.secondary">No questions found</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredQuestions.map((question) => (
                      <TableRow key={question.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 400 }}>
                            {question.text}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={question.question_categories?.name || 'Unknown'}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {question.answers?.length || 0} answers
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {new Date(question.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" title="View">
                            <ViewIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" title="Edit">
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" title="Delete" color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Total Questions: {filteredQuestions.length}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default AdminQuestionsPage;
