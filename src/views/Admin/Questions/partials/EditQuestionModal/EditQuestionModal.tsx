'use client';

import React, { useState, useEffect } from 'react';
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
  IconButton,
  Button,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
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

interface EditQuestionModalProps {
  open: boolean;
  question: Question | null;
  categories: Category[];
  onClose: () => void;
  onSave: (questionData: {
    text: string;
    category_id: string;
    answers: Answer[];
  }) => Promise<void>;
}

const EditQuestionModal: React.FC<EditQuestionModalProps> = ({
  open,
  question,
  categories,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    text: question?.text || '',
    category_id: question?.category_id || '',
    answers: question?.answers || [
      { id: `temp-${Date.now()}-0`, text: '', is_correct: true },
      { id: `temp-${Date.now()}-1`, text: '', is_correct: false },
      { id: `temp-${Date.now()}-2`, text: '', is_correct: false },
      { id: `temp-${Date.now()}-3`, text: '', is_correct: false },
    ],
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (question) {
      const timestamp = Date.now();
      setFormData({
        text: question.text,
        category_id: question.category_id,
        answers: question.answers.length > 0 ? question.answers : [
          { id: `temp-${timestamp}-0`, text: '', is_correct: true },
          { id: `temp-${timestamp}-1`, text: '', is_correct: false },
          { id: `temp-${timestamp}-2`, text: '', is_correct: false },
          { id: `temp-${timestamp}-3`, text: '', is_correct: false },
        ],
      });
    }
  }, [question, open]);

  const handleSave = async () => {
    if (formData.text && formData.category_id) {
      setSaving(true);

      try {
        await onSave(formData);
        onClose();
      } catch (error) {
        if (error instanceof Error) {
          // Handle error silently or show user feedback
        }
      } finally {
        setSaving(false);
      }
    }
  };

  const handleAnswerChange = (index: number, text: string) => {
    const newAnswers = [...formData.answers];

    newAnswers[index] = { ...newAnswers[index], text };
    setFormData({ ...formData, answers: newAnswers });
  };

  const handleCorrectAnswerChange = (index: number) => {
    const newAnswers = formData.answers.map((ans, idx) => ({
      ...ans,
      is_correct: idx === index,
    }));

    setFormData({ ...formData, answers: newAnswers });
  };

  const addAnswer = () => {
    setFormData({
      ...formData,
      answers: [...formData.answers, { id: `temp-${Date.now()}-${Math.random()}`, text: '', is_correct: false }],
    });
  };

  const removeAnswer = (index: number) => {
    if (formData.answers.length > 2) {
      const newAnswers = formData.answers.filter((_, idx) => idx !== index);

      setFormData({ ...formData, answers: newAnswers });
    }
  };

  const correctAnswerIndex = formData.answers.findIndex((a) => a.is_correct);

  if (!question) return null;

  return (
    <ModalRoot
      open={open}
      onClose={onClose}
      title="Edit Question"
      maxWidth="md"
      fullWidth
      actions={
        <>
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={
              saving
              || !formData.text
              || !formData.category_id
              || formData.answers.filter((a) => a.text.trim()).length < 2
            }
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </>
      }
    >
      <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          label="Question Text"
          value={formData.text}
          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          fullWidth
          multiline
          rows={3}
          required
        />

        <FormControl fullWidth required>
          <InputLabel>Category</InputLabel>
          <Select
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">Answers</Typography>
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={addAnswer}
            >
              Add Answer
            </Button>
          </Box>

          <RadioGroup value={correctAnswerIndex} onChange={(e) => handleCorrectAnswerChange(Number(e.target.value))}>
            {formData.answers.map((answer, index) => (
              <Box key={answer.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <FormControlLabel
                  value={index}
                  control={<Radio />}
                  label=""
                  sx={{ mr: 0 }}
                />
                <TextField
                  fullWidth
                  size="small"
                  value={answer.text}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder={`Answer ${index + 1}`}
                />
                {answer.is_correct && (
                  <Chip label="Correct" color="success" size="small" />
                )}
                {formData.answers.length > 2 && (
                  <IconButton
                    size="small"
                    onClick={() => removeAnswer(index)}
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            ))}
          </RadioGroup>
        </Box>
      </Box>
    </ModalRoot>
  );
};

export default EditQuestionModal;
