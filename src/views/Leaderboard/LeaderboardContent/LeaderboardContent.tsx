'use client';

import React from 'react';

import { Container } from '@mui/material';

import LeaderboardHeader from '@/views/Leaderboard/LeaderboardHeader';
import LeaderboardList from '@/views/Leaderboard/LeaderboardList';

interface LeaderboardEntry {
  username: string;
  totalQuizzes: number;
  averageScore: number;
  passRate: number;
}

interface LeaderboardContentProps {
  entries: LeaderboardEntry[];
}

const LeaderboardContent = ({ entries }: LeaderboardContentProps) => (
  <Container maxWidth="md" sx={{ py: 6 }}>
    <LeaderboardHeader />
    <LeaderboardList entries={entries} />
  </Container>
);

export default LeaderboardContent;
