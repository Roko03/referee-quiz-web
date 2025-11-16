'use client';

import { useEffect, useState } from 'react';

import HeroSection from '@/views/Home/HeroSection';
import StatsSection from '@/views/Home/StatsSection';
import CategoriesSection from '@/views/Home/CategoriesSection';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase/client';

interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('question_categories').select('*').order('name');

      const categoriesData = data as Category[] | null;

      if (categoriesData) setCategories(categoriesData);
    };

    fetchCategories();
  }, []);

  return (
    <Layout>
      <HeroSection />
      <StatsSection />
      <CategoriesSection categories={categories} />
    </Layout>
  );
}
