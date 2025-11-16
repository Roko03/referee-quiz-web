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
  question_text: string;
  answers: Answer[];
}

interface QuizPageProps {
  quizId: string;
}

const QUESTION_TIME_LIMIT = 45; // seconds

const QuizPage = ({ quizId }: QuizPageProps) => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      const { data: quizData } = await supabase.from('quizzes').select('*').eq('id', quizId).single();

      if (!quizData) {
        router.push('/');

        return;
      }

      const { data: questionsData } = await supabase
        .from('questions')
        .select(
          `
          id,
          question_text,
          answers(id, text, is_correct)
        `,
        )
        .eq('category_id', quizData.category_id)
        .limit(quizData.question_count || 24);

      if (questionsData) {
        setQuestions(questionsData as Question[]);

        const { data: session } = await supabase
          .from('quiz_sessions')
          .insert({
            user_id: user?.id,
            quiz_id: quizId,
            total_questions: questionsData.length,
            started_at: new Date().toISOString(),
          })
          .select('id')
          .single();

        if (session) {
          setSessionId(session.id);
        }
      }

      setLoading(false);
    };

    fetchQuiz();
  }, [quizId, router, user]);

  const finishQuiz = async () => {
    let correctCount = 0;

    questions.forEach((question) => {
      const userAnswerId = userAnswers[question.id];
      const correctAnswer = question.answers.find((a) => a.is_correct);

      if (userAnswerId === correctAnswer?.id) {
        correctCount += 1;
      }
    });

    const score = (correctCount / questions.length) * 100;
    const passed = score >= 90;

    await supabase
      .from('quiz_sessions')
      .update({
        completed_at: new Date().toISOString(),
        correct_count: correctCount,
        score,
        passed,
      })
      .eq('id', sessionId);

    router.push(`/review/${sessionId}`);
  };

  const handleNextQuestion = async () => {
    const currentQuestion = questions[currentQuestionIndex];

    if (selectedAnswerId) {
      setUserAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: selectedAnswerId,
      }));

      await supabase.from('user_answers').insert({
        session_id: sessionId,
        question_id: currentQuestion.id,
        answer_id: selectedAnswerId,
        time_taken: QUESTION_TIME_LIMIT - timeLeft,
      });
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswerId(null);
      setTimeLeft(QUESTION_TIME_LIMIT);
    } else {
      await finishQuiz();
    }
  };

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
  }, [timeLeft, loading, currentQuestionIndex]);

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
          <Typography>No questions found for this quiz.</Typography>
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
              {currentQuestion.question_text}
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

export default QuizPage;
