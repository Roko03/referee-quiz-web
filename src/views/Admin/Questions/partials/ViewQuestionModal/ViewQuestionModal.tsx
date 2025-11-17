'use client';

import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from '@mui/material';
import ModalRoot from '@/components/ModalRoot';

interface Answer {
  id?: string;
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

interface ViewQuestionModalProps {
  open: boolean;
  question: Question | null;
  categories: Category[];
  onClose: () => void;
}

const ViewQuestionModal: React.FC<ViewQuestionModalProps> = ({
  open,
  question,
  categories,
  onClose,
}) => {
  if (!question) return null;

  const correctAnswerIndex = question.answers.findIndex((a) => a.is_correct);

  return (
    <ModalRoot
      open={open}
      onClose={onClose}
      title="Question Details"
      maxWidth="md"
      fullWidth
      actions={
        <Button onClick={onClose}>
          Close
        </Button>
      }
    >
      <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          label="Question Text"
          value={question.text}
          disabled
          fullWidth
          multiline
          rows={3}
        />

        <FormControl fullWidth disabled>
          <InputLabel>Category</InputLabel>
          <Select
            value={question.category_id}
            label="Category"
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>Answers</Typography>

          <RadioGroup value={correctAnswerIndex}>
            {question.answers.map((answer, index) => (
              <Box key={answer.id || `answer-${index}-${answer.text.substring(0, 10)}`} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <FormControlLabel
                  value={index}
                  control={<Radio disabled />}
                  label=""
                  sx={{ mr: 0 }}
                />
                <TextField
                  fullWidth
                  size="small"
                  value={answer.text}
                  disabled
                  placeholder={`Answer ${index + 1}`}
                />
                {answer.is_correct && (
                  <Chip label="Correct" color="success" size="small" />
                )}
              </Box>
            ))}
          </RadioGroup>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Question ID: {question.id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Created: {new Date(question.created_at).toLocaleString()}
          </Typography>
        </Box>
      </Box>
    </ModalRoot>
  );
};

export default ViewQuestionModal;
