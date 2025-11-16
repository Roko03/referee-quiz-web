import React from 'react';

import { Box, Card, CardContent, Typography, Avatar, Divider } from '@mui/material';
import { EmojiEvents, WorkspacePremium, Stars } from '@mui/icons-material';

import styles from './LeaderboardList.module.scss';

interface LeaderboardEntry {
  username: string;
  totalQuizzes: number;
  averageScore: number;
  passRate: number;
}

interface LeaderboardListProps {
  entries: LeaderboardEntry[];
}

const getMedalIcon = (index: number) => {
  if (index === 0) {
    return <EmojiEvents sx={{ fontSize: 24, color: 'hsl(45, 100%, 51%)' }} />;
  }

  if (index === 1) {
    return <WorkspacePremium sx={{ fontSize: 24, color: 'hsl(0, 0%, 75%)' }} />;
  }

  if (index === 2) {
    return <Stars sx={{ fontSize: 24, color: 'hsl(30, 80%, 55%)' }} />;
  }

  return (
    <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.secondary' }}>
      {index + 1}
    </Typography>
  );
};

const LeaderboardList = ({ entries }: LeaderboardListProps) => (
  <Card className={styles.card}>
    <CardContent sx={{ p: 3 }}>
      <Typography variant="h6" className={styles.cardTitle}>
        Top 20 Players
      </Typography>

      <Box className={styles.list}>
        {entries.map((entry, index) => (
          <Box key={entry.username}>
            <Box className={`${styles.entry} ${index < 3 ? styles.topThree : ''}`}>
              <Box className={styles.rank}>{getMedalIcon(index)}</Box>

              <Avatar className={styles.avatar}>{entry.username.substring(0, 2).toUpperCase()}</Avatar>

              <Box className={styles.userInfo}>
                <Typography variant="body1" className={styles.username}>
                  {entry.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {entry.totalQuizzes} {entry.totalQuizzes === 1 ? 'quiz' : 'quizzes'}
                </Typography>
              </Box>

              <Box className={styles.stats}>
                <Typography variant="h5" color="primary" className={styles.score}>
                  {entry.averageScore}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {entry.passRate}% pass rate
                </Typography>
              </Box>
            </Box>
            {index < entries.length - 1 && <Divider sx={{ my: 1 }} />}
          </Box>
        ))}

        {entries.length === 0 && (
          <Box className={styles.emptyState}>
            <Typography variant="body1" color="text.secondary">
              No quiz attempts yet. Be the first to take a quiz!
            </Typography>
          </Box>
        )}
      </Box>
    </CardContent>
  </Card>
);

export default LeaderboardList;
