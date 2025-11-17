import React from 'react';

import { getStaticContent } from '@/lib/mdx';
import PrivacyContent from '@/views/Privacy/PrivacyContent';

export const metadata = {
  title: 'Privacy Policy - Football Rules Quiz',
  description: 'Our privacy policy explains how we collect, use, and protect your personal information',
};

const PrivacyPage = () => {
  const { frontmatter, content } = getStaticContent('legal', 'privacy-policy');

  return <PrivacyContent frontmatter={frontmatter} content={content} />;
};

export default PrivacyPage;
