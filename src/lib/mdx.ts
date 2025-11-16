import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';

const staticDirectory = path.join(process.cwd(), 'src/static');

export interface StaticContent {
  slug: string;
  frontmatter: {
    title: string;
    description?: string;
    lastUpdated?: string;
    [key: string]: any;
  };
  content: string;
}

export const getStaticContent = (category: string, slug: string): StaticContent => {
  const fullPath = path.join(staticDirectory, category, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    frontmatter: data as StaticContent['frontmatter'],
    content,
  };
};

export const getAllStaticContent = (category: string): StaticContent[] => {
  const categoryPath = path.join(staticDirectory, category);

  if (!fs.existsSync(categoryPath)) return [];

  const files = fs.readdirSync(categoryPath);

  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => getStaticContent(category, file.replace('.mdx', '')));
};
