import QuizPage from '@/views/Quiz';

interface ActiveQuizPageProps {
  params: Promise<{
    id: string;
  }>;
}

const ActiveQuizPage = async ({ params }: ActiveQuizPageProps) => {
  const { id } = await params;

  return <QuizPage quizId={id} />;
};

export default ActiveQuizPage;
