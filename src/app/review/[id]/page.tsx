import QuizReviewPage from '@/views/QuizReview';

interface QuizReviewRouteProps {
  params: Promise<{
    id: string;
  }>;
}

const QuizReviewRoute = async ({ params }: QuizReviewRouteProps) => {
  const { id } = await params;

  return <QuizReviewPage sessionId={id} />;
};

export default QuizReviewRoute;
