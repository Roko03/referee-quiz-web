'use client';

import React, { useState, useEffect, useCallback } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Chip,
} from '@mui/material';
import { Timer, CheckCircle } from '@mui/icons-material';

import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/valtio/auth';

interface Answer {
  id: string;
  text: string;
  is_correct: boolean;
}

interface Question {
  id: string;
  text: string;
  answers: Answer[];
}

interface QuizSessionInsert {
  user_id: string | undefined;
  category_ids: string[];
  total_questions: number;
  duration_ms: number;
  correct_count: number;
  incorrect_count: number;
}

interface SessionResponse {
  id: string;
}

interface QuizSessionUpdate {
  duration_ms: number;
  correct_count: number;
  incorrect_count: number;
  passed: boolean;
}

interface UserAnswerInsert {
  quiz_session_id: string | null;
  question_id: string;
  selected_answer_id: string | null;
  is_correct: boolean;
  time_taken_ms: number;
}

const QUESTION_TIME_LIMIT = 45; // seconds

const CustomQuizSessionPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const fetchQuestions = async () => {
      const categoriesParam = searchParams.get('categories');
      const countParam = searchParams.get('count');

      if (!categoriesParam) {
        router.push('/custom-quiz');

        return;
      }

      const categoryIds = categoriesParam.split(',');
      const questionCount = countParam ? parseInt(countParam, 10) : 10;

      // Fetch questions from selected categories
      const { data: questionsData } = await supabase
        .from('questions')
        .select(
          `
          id,
          text,
          answers(id, text, is_correct)
        `,
        )
        .in('category_id', categoryIds)
        .limit(questionCount);

      if (questionsData && questionsData.length > 0) {
        // Shuffle questions for variety
        const shuffled = [...questionsData].sort(() => Math.random() - 0.5);

        setQuestions(shuffled as Question[]);

        // Create quiz session
        const sessionData: QuizSessionInsert = {
          user_id: user?.id,
          category_ids: categoryIds,
          total_questions: shuffled.length,
          duration_ms: 0,
          correct_count: 0,
          incorrect_count: 0,
        };

        const { data: sessionResponse } = await supabase
          .from('quiz_sessions')
          .insert(sessionData as unknown as never)
          .select('id')
          .single();

        const session = sessionResponse as SessionResponse | null;

        if (session) {
          setSessionId(session.id);
        }
      } else {
        // No questions found
        setQuestions([]);
      }

      setLoading(false);
    };

    fetchQuestions();
  }, [searchParams, router, user]);

  const finishQuiz = useCallback(async () => {
    if (!sessionId) return;

    let correctCount = 0;
    let incorrectCount = 0;

    questions.forEach((question) => {
      const userAnswerId = userAnswers[question.id];
      const correctAnswer = question.answers.find((a) => a.is_correct);

      if (userAnswerId === correctAnswer?.id) {
        correctCount += 1;
      } else {
        incorrectCount += 1;
      }
    });

    const durationMs = Date.now() - startTime;
    const score = (correctCount / questions.length) * 100;
    const passed = score >= 90;

    const updateData: QuizSessionUpdate = {
      duration_ms: durationMs,
      correct_count: correctCount,
      incorrect_count: incorrectCount,
      passed,
    };

    await supabase
      .from('quiz_sessions')
      .update(updateData as unknown as never)
      .eq('id', sessionId);

    router.push(`/review/${sessionId}`);
  }, [questions, userAnswers, sessionId, router, startTime]);

  const handleNextQuestion = useCallback(async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.answers.find((a) => a.is_correct);
    const isCorrect = selectedAnswerId === correctAnswer?.id;

    if (selectedAnswerId) {
      setUserAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: selectedAnswerId,
      }));

      const answerData: UserAnswerInsert = {
        quiz_session_id: sessionId,
        question_id: currentQuestion.id,
        selected_answer_id: selectedAnswerId,
        is_correct: isCorrect,
        time_taken_ms: (QUESTION_TIME_LIMIT - timeLeft) * 1000,
      };

      await supabase.from('user_answers').insert(answerData as unknown as never);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswerId(null);
      setTimeLeft(QUESTION_TIME_LIMIT);
    } else {
      await finishQuiz();
    }
  }, [questions, currentQuestionIndex, selectedAnswerId, sessionId, timeLeft, finishQuiz]);

  useEffect(() => {
    if (loading || timeLeft === 0) {
      return undefined;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion();

          return QUESTION_TIME_LIMIT;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, currentQuestionIndex, handleNextQuestion]);

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Typography>Loading quiz...</Typography>
        </Container>
      </Layout>
    );
  }

  if (questions.length === 0) {
    return (
      <Layout>
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Card>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                No Questions Available
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                There are no questions available for the selected categories.
                Please try selecting different categories.
              </Typography>
              <Button variant="contained" onClick={() => router.push('/custom-quiz')}>
                Back to Quiz Builder
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Layout>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Typography>
            <Chip icon={<Timer />} label={`${timeLeft}s`} color={timeLeft <= 10 ? 'error' : 'primary'} />
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />
        </Box>

        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
              {currentQuestion.text}
            </Typography>

            <FormControl component="fieldset" fullWidth>
              <RadioGroup value={selectedAnswerId || ''} onChange={(e) => setSelectedAnswerId(e.target.value)}>
                {currentQuestion.answers.map((answer) => (
                  <Card
                    key={answer.id}
                    sx={{
                      mb: 2,
                      cursor: 'pointer',
                      border: '2px solid',
                      borderColor: selectedAnswerId === answer.id ? 'primary.main' : 'divider',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'action.hover',
                      },
                    }}
                    onClick={() => setSelectedAnswerId(answer.id)}
                  >
                    <CardContent>
                      <FormControlLabel
                        value={answer.id}
                        control={<Radio />}
                        label={answer.text}
                        sx={{ width: '100%', m: 0 }}
                      />
                    </CardContent>
                  </Card>
                ))}
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleNextQuestion}
            disabled={!selectedAnswerId}
            endIcon={currentQuestionIndex === questions.length - 1 ? <CheckCircle /> : null}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </Button>
        </Box>
      </Container>
    </Layout>
  );
};

export default CustomQuizSessionPage;
