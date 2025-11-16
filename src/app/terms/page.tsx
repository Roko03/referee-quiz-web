import React from 'react';

import { getStaticContent } from '@/lib/mdx';
import TermsContent from '@/views/Terms/TermsContent';

export const metadata = {
  title: 'Terms of Service - Football Rules Quiz',
  description: 'Terms and conditions for using Football Rules Quiz platform',
};

const TermsPage = () => {
  const { frontmatter, content } = getStaticContent('legal', 'terms-of-service');

  return <TermsContent frontmatter={frontmatter} content={content} />;
};

export default TermsPage;
