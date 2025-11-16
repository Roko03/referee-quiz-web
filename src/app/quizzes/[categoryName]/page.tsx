import React from 'react';

import ComingSoon from '@/components/ComingSoon';

interface QuizListingPageProps {
  params: Promise<{
    categoryName: string;
  }>;
}

const QuizListingPage = async ({ params }: QuizListingPageProps) => {
  const { categoryName } = await params;
  const decodedName = decodeURIComponent(categoryName);

  return (
    <ComingSoon
      title={`${decodedName} Quizzes`}
      description="Browse and start quizzes from this category. This page is currently under construction."
    />
  );
};

export default QuizListingPage;
