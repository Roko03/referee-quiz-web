import React from 'react';

import { Box, Card, CardContent, Typography, Avatar, Divider } from '@mui/material';
import { EmojiEvents, WorkspacePremium, Stars } from '@mui/icons-material';

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
  <Card
    sx={{
      boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.5)',
      background: 'linear-gradient(180deg, hsl(220, 24%, 9%), hsl(220, 24%, 7%))',
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
        Top 20 Players
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {entries.map((entry, index) => (
          <Box key={entry.username}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: index < 3 ? 'rgba(142, 76%, 45%, 0.1)' : 'rgba(220, 20%, 14%, 0.3)',
                border: index < 3 ? '1px solid rgba(142, 76%, 45%, 0.2)' : 'none',
              }}
            >
              <Box sx={{ width: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {getMedalIcon(index)}
              </Box>

              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, hsl(142, 76%, 36%), hsl(142, 76%, 56%))',
                  color: 'hsl(220, 26%, 6%)',
                  fontWeight: 600,
                }}
              >
                {entry.username.substring(0, 2).toUpperCase()}
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {entry.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {entry.totalQuizzes} {entry.totalQuizzes === 1 ? 'quiz' : 'quizzes'}
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
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
          <Box sx={{ textAlign: 'center', py: 6 }}>
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
