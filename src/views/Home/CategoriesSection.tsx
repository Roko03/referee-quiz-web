'use client';

import React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Container, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import { PlayCircle, EmojiEvents, Settings } from '@mui/icons-material';

interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
}

interface CategoriesSectionProps {
  categories: Category[];
}

const CategoriesSection = ({ categories }: CategoriesSectionProps) => {
  const router = useRouter();

  return (
    <Box id="categories" sx={{ py: 8 }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            Quiz Categories
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Choose a category to start testing your knowledge of football rules
          </Typography>
        </Box>

        {/* Special Quiz Options */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, hsl(142, 76%, 36%), hsl(142, 76%, 56%))',
                borderColor: 'transparent',
                boxShadow: '0 0 40px hsla(142, 76%, 45%, 0.15)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 0 60px hsla(142, 76%, 45%, 0.25)',
                },
              }}
              onClick={() => router.push('/quizzes/all-categories')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    transition: 'transform 0.3s',
                    '.MuiCard-root:hover &': {
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <EmojiEvents sx={{ fontSize: 32, color: 'hsl(220, 26%, 6%)' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: 'hsl(220, 26%, 6%)' }}>
                  All Categories Quiz
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(11, 15, 25, 0.8)' }}>
                  24 random questions from all categories combined
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                background: 'linear-gradient(180deg, hsl(220, 24%, 9%), hsl(220, 24%, 7%))',
                borderColor: 'primary.main',
                borderWidth: 1,
                borderStyle: 'solid',
                boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 0 60px hsla(142, 76%, 45%, 0.25)',
                },
              }}
              onClick={() => router.push('/quizzes/custom')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, hsl(142, 76%, 36%), hsl(142, 76%, 56%))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    transition: 'transform 0.3s',
                    '.MuiCard-root:hover &': {
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <Settings sx={{ fontSize: 32, color: 'hsl(220, 26%, 6%)' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  Custom Quiz
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose your category and number of questions (not counted in leaderboard)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Category Quizzes */}
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid key={category.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <Link href={`/quizzes/${encodeURIComponent(category.name)}`} style={{ textDecoration: 'none' }}>
                <Card
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(180deg, hsl(220, 24%, 9%), hsl(220, 24%, 7%))',
                    borderColor: 'rgba(142, 76%, 45%, 0.5)',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 0 40px hsla(142, 76%, 45%, 0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, hsl(142, 76%, 36%), hsl(142, 76%, 56%))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      <PlayCircle sx={{ fontSize: 24, color: 'hsl(220, 26%, 6%)' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {category.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        mb: 2,
                      }}
                    >
                      {category.description}
                    </Typography>
                    <Button fullWidth variant="outlined">
                      View Quizzes
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default CategoriesSection;
