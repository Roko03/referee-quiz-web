import HeroSection from '@/views/Home/HeroSection';
import StatsSection from '@/views/Home/StatsSection';
import CategoriesSection from '@/views/Home/CategoriesSection';
import Layout from '@/components/Layout';
import { createClient } from '@/lib/supabase/server';

interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
}

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase.from('question_categories').select('*').order('name');

  const categories = (data as Category[] | null) || [];

  return (
    <Layout>
      <HeroSection />
      <StatsSection />
      <CategoriesSection categories={categories} />
    </Layout>
  );
}
