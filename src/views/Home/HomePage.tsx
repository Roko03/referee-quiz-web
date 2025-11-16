'use client';

import React, { useEffect, useState } from 'react';

import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase/client';

import CategoriesSection from './CategoriesSection';
import HeroSection from './HeroSection';
import StatsSection from './StatsSection';

interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
}

const HomePage = () => {
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
      <HeroSection />
      <StatsSection />
      <CategoriesSection categories={categories} />
    </Layout>
  );
};

export default HomePage;
