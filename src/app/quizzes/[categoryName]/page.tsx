import QuizListingPage from '@/views/QuizListing';

interface QuizListingRouteProps {
  params: Promise<{
    categoryName: string;
  }>;
}

const QuizListingRoute = async ({ params }: QuizListingRouteProps) => {
  const { categoryName } = await params;
  const decodedName = decodeURIComponent(categoryName);

  return <QuizListingPage categoryName={decodedName} />;
};

export default QuizListingRoute;
