'use client';

import React, { useState } from 'react';
import { Typography, Button } from '@mui/material';
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

interface DeleteQuestionModalProps {
  open: boolean;
  question: Question | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const DeleteQuestionModal: React.FC<DeleteQuestionModalProps> = ({
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
      if (error instanceof Error) {
        // Handle error silently or show user feedback
      }
    } finally {
      setDeleting(false);
    }
  };

  if (!question) return null;

  return (
    <ModalRoot
      open={open}
      onClose={onClose}
      title="Delete Question"
      maxWidth="sm"
      fullWidth
      actions={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm} color="error" variant="contained" disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </>
      }
    >
      <Typography>
        Are you sure you want to delete this question?
      </Typography>
      <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
        &quot;{question.text}&quot;
      </Typography>
      <Typography variant="body2" sx={{ mt: 2, color: 'error.main' }}>
        This action cannot be undone.
      </Typography>
    </ModalRoot>
  );
};

export default DeleteQuestionModal;
