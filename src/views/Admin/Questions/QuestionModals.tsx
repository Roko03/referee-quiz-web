'use client';

import React, { useState, useEffect } from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Chip,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

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

interface QuestionModalProps {
  open: boolean;
  question: Question | null;
  categories: Category[];
  mode: 'view' | 'edit' | 'add';
  onClose: () => void;
  onSave?: (questionData: {
    text: string;
    category_id: string;
    answers: Answer[];
  }) => Promise<void>;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  open,
  question,
  categories,
  mode,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    text: question?.text || '',
    category_id: question?.category_id || '',
    answers: question?.answers || [
      { text: '', is_correct: true },
      { text: '', is_correct: false },
      { text: '', is_correct: false },
      { text: '', is_correct: false },
    ],
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (question) {
      setFormData({
        text: question.text,
        category_id: question.category_id,
        answers: question.answers.length > 0 ? question.answers : [
          { text: '', is_correct: true },
          { text: '', is_correct: false },
          { text: '', is_correct: false },
          { text: '', is_correct: false },
        ],
      });
    } else if (mode === 'add') {
      // Reset form for add mode
      setFormData({
        text: '',
        category_id: '',
        answers: [
          { text: '', is_correct: true },
          { text: '', is_correct: false },
          { text: '', is_correct: false },
          { text: '', is_correct: false },
        ],
      });
    }
  }, [question, mode, open]);

  const handleSave = async () => {
    if (onSave && formData.text && formData.category_id) {
      setSaving(true);

      try {
        await onSave(formData);
        onClose();
      } catch (error) {
        // Error handling - could be replaced with toast/snackbar notification
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
      answers: [...formData.answers, { text: '', is_correct: false }],
    });
  };

  const removeAnswer = (index: number) => {
    if (formData.answers.length > 2) {
      const newAnswers = formData.answers.filter((_, idx) => idx !== index);

      setFormData({ ...formData, answers: newAnswers });
    }
  };

  const isViewMode = mode === 'view';
  const correctAnswerIndex = formData.answers.findIndex((a) => a.is_correct);

  const getDialogTitle = () => {
    if (mode === 'add') return 'Add New Question';

    if (mode === 'edit') return 'Edit Question';

    return 'Question Details';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{getDialogTitle()}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Question Text"
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            disabled={isViewMode}
            fullWidth
            multiline
            rows={3}
            required
          />

          <FormControl fullWidth required disabled={isViewMode}>
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
              {!isViewMode && (
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={addAnswer}
                >
                  Add Answer
                </Button>
              )}
            </Box>

            <RadioGroup value={correctAnswerIndex} onChange={(e) => handleCorrectAnswerChange(Number(e.target.value))}>
              {formData.answers.map((answer, index) => (
                <Box key={answer.id || `answer-${index}-${answer.text.substring(0, 10)}`} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <FormControlLabel
                    value={index}
                    control={<Radio disabled={isViewMode} />}
                    label=""
                    sx={{ mr: 0 }}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    value={answer.text}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    disabled={isViewMode}
                    placeholder={`Answer ${index + 1}`}
                  />
                  {answer.is_correct && (
                    <Chip label="Correct" color="success" size="small" />
                  )}
                  {!isViewMode && formData.answers.length > 2 && (
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

          {isViewMode && question && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Question ID: {question.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Created: {new Date(question.created_at).toLocaleString()}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {isViewMode ? 'Close' : 'Cancel'}
        </Button>
        {!isViewMode && (
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
        )}
      </DialogActions>
    </Dialog>
  );
};

interface DeleteQuestionDialogProps {
  open: boolean;
  question: Question | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const DeleteQuestionDialog: React.FC<DeleteQuestionDialogProps> = ({
  open,
  question,
  onClose,
  onConfirm,
}) => {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);

    try {
      await onConfirm();
      onClose();
    } catch (error) {
      // Error handling - could be replaced with toast/snackbar notification
      if (error instanceof Error) {
        // Handle error silently or show user feedback
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Question</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete this question?
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
          &quot;{question?.text}&quot;
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, color: 'error.main' }}>
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} color="error" variant="contained" disabled={deleting}>
          {deleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
