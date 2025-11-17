'use client';

import React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Container, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import { PlayCircle, EmojiEvents, Settings } from '@mui/icons-material';

import styles from './CategoriesSection.module.scss';

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
    <Box id="categories" className={styles.categories}>
      <Container maxWidth="xl">
        <Box className={styles.header}>
          <Typography variant="h3" className={styles.title}>
            Quiz Categories
          </Typography>
          <Typography variant="body1" color="text.secondary" className={styles.subtitle}>
            Choose a category to start testing your knowledge of football rules
          </Typography>
        </Box>

        {/* Special Quiz Options */}
        <Grid container spacing={3} className={styles.specialQuizzes}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card className={styles.allCategoriesCard} onClick={() => router.push('/quizzes/all-categories')}>
              <CardContent sx={{ p: 3 }}>
                <Box className={styles.cardIcon}>
                  <EmojiEvents sx={{ fontSize: 32, color: 'hsl(220, 26%, 6%)' }} />
                </Box>
                <Typography variant="h5" className={styles.cardTitle}>
                  All Categories Quiz
                </Typography>
                <Typography variant="body2" className={styles.cardDescription}>
                  24 random questions from all categories combined
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card className={styles.customQuizCard} onClick={() => router.push('/quizzes/custom')}>
              <CardContent sx={{ p: 3 }}>
                <Box className={styles.customCardIcon}>
                  <Settings sx={{ fontSize: 32, color: 'hsl(220, 26%, 6%)' }} />
                </Box>
                <Typography variant="h5" className={styles.customCardTitle}>
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
                <Card className={styles.categoryCard}>
                  <CardContent sx={{ p: 3 }}>
                    <Box className={styles.categoryIcon}>
                      <PlayCircle sx={{ fontSize: 24, color: 'hsl(220, 26%, 6%)' }} />
                    </Box>
                    <Typography variant="h6" className={styles.categoryName}>
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" className={styles.categoryDescription}>
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
