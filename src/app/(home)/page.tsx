'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Container, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import { PlayCircle, Award, Trophy, Settings } from '@mui/icons-material';

import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase/client';

interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
}

const HomePage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('question_categories').select('*').order('name');

      if (data) setCategories(data);
    };

    fetchCategories();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          pt: 2,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(/assets/hero-stadium.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.3,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(11, 15, 25, 0.5), rgba(11, 15, 25, 0.8), rgb(11, 15, 25))',
            },
          }}
        />

        <Container
          maxWidth="xl"
          sx={{
            position: 'relative',
            zIndex: 10,
            py: { xs: 10, md: 16 },
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 700,
              mb: 3,
              background: 'linear-gradient(135deg, hsl(142, 76%, 36%), hsl(142, 76%, 56%))',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Master the Laws of Football
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              color: 'text.secondary',
              mb: 4,
              maxWidth: 800,
              mx: 'auto',
            }}
          >
            Test your knowledge of official football rules with our comprehensive quiz platform
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            <Button
              size="large"
              variant="contained"
              startIcon={<PlayCircle />}
              href="#categories"
              sx={{
                boxShadow: '0 0 40px hsla(142, 76%, 45%, 0.15)',
              }}
            >
              Start Quiz
            </Button>
            <Button size="large" variant="outlined" component={Link} href="/leaderboard" startIcon={<Award />}>
              View Leaderboard
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box
        sx={{
          py: 6,
          borderTop: '1px solid',
          borderBottom: '1px solid',
          borderColor: 'divider',
          background: 'linear-gradient(180deg, hsl(220, 24%, 9%), hsl(220, 24%, 7%))',
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4} sx={{ textAlign: 'center' }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                24
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Questions per Quiz
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                45s
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Time per Question
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                90%
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Pass Threshold
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Categories Section */}
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
                    <Trophy sx={{ fontSize: 32, color: 'hsl(220, 26%, 6%)' }} />
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
    </Layout>
  );
};

export default HomePage;
