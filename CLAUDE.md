# Claude Code - Project Architecture Guide

## Overview

This document outlines the architectural patterns and conventions for the Referee Quiz Web Application. All developers and AI assistants working on this project must follow these guidelines.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **React**: React 19
- **Styling**: Material-UI v7 + SCSS Modules
- **Database**: Supabase (PostgreSQL)
- **Language**: TypeScript

## Component Architecture

### Layout Pattern

- **Main Layout**: The `Layout` component wraps all pages and includes:
  - `Header` component (navigation, user menu)
  - Main content area (page-specific content)
  - `Footer` component (links, copyright)

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (home)/
│   │   └── page.tsx       # Directly imports and composes sections
│   ├── admin/
│   ├── auth/
│   └── ...
├── views/                 # Page-specific components and sections
│   ├── Home/             # Home page sections
│   │   ├── HeroSection/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HeroSection.module.scss
│   │   │   └── index.ts
│   │   ├── StatsSection/
│   │   │   ├── StatsSection.tsx
│   │   │   ├── StatsSection.module.scss
│   │   │   └── index.ts
│   │   └── CategoriesSection/
│   │       ├── CategoriesSection.tsx
│   │       ├── CategoriesSection.module.scss
│   │       └── index.ts
│   ├── Quiz/
│   └── ...
├── components/           # Reusable components
│   ├── Header/
│   │   ├── Header.tsx
│   │   ├── Header.module.scss
│   │   └── index.ts
│   ├── Footer/
│   │   ├── Footer.tsx
│   │   ├── Footer.module.scss
│   │   └── index.ts
│   └── Layout/
│       ├── Layout.tsx
│       ├── Layout.module.scss
│       └── index.ts
└── static/              # Static content (MDX files)
    ├── privacy.mdx
    └── terms.mdx
```

### Component Pattern

**Every component MUST follow this structure:**

```
ComponentName/
├── ComponentName.tsx          # Component logic and JSX
├── ComponentName.module.scss  # Component-specific styles
└── index.ts                   # Re-export for clean imports
```

**Example `index.ts`:**
```typescript
import ComponentName from './ComponentName';

export default ComponentName;
```

### Views vs Components

**Views** (`src/views/`):
- Page-specific components that are NOT reusable
- Organized by page/route name (e.g., `views/Home/`, `views/Quiz/`)
- Each page folder contains its sections as subfolders
- Sections are composed in `app/*/page.tsx` files

**Components** (`src/components/`):
- Reusable components used across multiple pages
- Generic, not tied to specific pages
- Examples: Header, Footer, Layout, Modals, Forms

## Page Composition Pattern

### Server/Client Component Architecture

**CRITICAL: All `page.tsx` files MUST be server components for SSR**

**CORRECT** - app/(home)/page.tsx (Server Component):
```typescript
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
  // Server-side data fetching
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
```

**View sections (client components)** - src/views/Home/HeroSection/HeroSection.tsx:
```typescript
'use client';

import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import styles from './HeroSection.module.scss';

const HeroSection = () => (
  <Box className={styles.hero}>
    {/* ... */}
  </Box>
);

export default HeroSection;
```

### Rules:

1. **`page.tsx` = Server Component**
   - NO `'use client'` directive
   - Async function: `export default async function`
   - Server-side data fetching: `await createClient()`
   - NO `useEffect`, `useState`, or other React hooks
   - Pass data to child components as props

2. **View Sections = Client Components**
   - Add `'use client'` directive if using:
     - MUI components
     - React hooks (`useState`, `useEffect`, `useRouter`, etc.)
     - Browser APIs
   - Receive data as props from page.tsx

3. **Layout = Client Component**
   - Already has `'use client'`
   - Uses MUI components internally

**INCORRECT** - Do NOT create wrapper components:
```typescript
// ❌ WRONG - Don't do this
import HomePage from '@/views/Home';

export default HomePage;
```

**INCORRECT** - Do NOT use client hooks in page.tsx:
```typescript
// ❌ WRONG - Don't do this
'use client';

export default function HomePage() {
  const [data, setData] = useState([]);
  useEffect(() => { /* ... */ }, []);
  // ...
}
```

## Styling Guidelines

### SCSS Modules

- **Use `.module.scss` only when necessary** - when custom styling cannot be achieved with MUI components
- Prefer Material-UI `sx` prop and component styling over SCSS modules
- If all styling can be done via MUI components, `.module.scss` is **optional**
- When needed: Use CSS Modules for component-scoped styles
- Import styles: `import styles from './ComponentName.module.scss'`
- Apply styles: `className={styles.elementName}`

### Material-UI Integration (PREFERRED)

- **Prefer Material-UI components** for all UI primitives
- Use `sx` prop for component-specific styling
- Use `styled()` API for reusable styled components
- Custom SCSS modules only when MUI cannot achieve the desired styling
- Follow Material-UI v7 patterns

## Folder Organization Rules

### 1. Sections Must Be in Separate Folders

**WRONG:**
```
views/Home/
├── HeroSection.tsx
├── StatsSection.tsx
└── CategoriesSection.tsx
```

**CORRECT:**
```
views/Home/
├── HeroSection/
│   ├── HeroSection.tsx
│   ├── HeroSection.module.scss
│   └── index.ts
├── StatsSection/
│   ├── StatsSection.tsx
│   ├── StatsSection.module.scss
│   └── index.ts
└── CategoriesSection/
    ├── CategoriesSection.tsx
    ├── CategoriesSection.module.scss
    └── index.ts
```

### 2. No Wrapper Page Components

Page logic and data fetching should happen in `app/*/page.tsx` files, NOT in wrapper components in `views/`.

### 3. Co-located Styles

Every component MUST have its own SCSS module file, even if currently empty. This maintains consistency and makes it easy to add styles later.

## Data Fetching

### Server Components (Preferred)

- Fetch data in `app/*/page.tsx` server components when possible
- Pass data as props to client components

### Client Components

- Use `'use client'` directive
- Fetch data with `useEffect` + Supabase client
- Handle loading and error states

## TypeScript Patterns

### Supabase Type Casting

Due to Supabase type inference issues, use this pattern:

```typescript
const { data } = await supabase
  .from('table_name')
  .select('*');

// Cast to your type
const typedData = data as YourType[] | null;

// For inserts/updates, use double-cast pattern
await supabase
  .from('table_name')
  .insert(data as unknown as never);
```

## Component Example

**HeroSection/HeroSection.tsx:**
```typescript
'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import styles from './HeroSection.module.scss';

const HeroSection = () => {
  return (
    <Box className={styles.hero}>
      <Typography variant="h1">Welcome</Typography>
      <Button variant="contained">Get Started</Button>
    </Box>
  );
};

export default HeroSection;
```

**HeroSection/HeroSection.module.scss:**
```scss
.hero {
  padding: 4rem 0;
  text-align: center;

  h1 {
    margin-bottom: 2rem;
  }
}
```

**HeroSection/index.ts:**
```typescript
import HeroSection from './HeroSection';

export default HeroSection;
```

## Migration Checklist

When refactoring existing components to this structure:

- [ ] Create component folder
- [ ] Move component file into folder
- [ ] Create `.module.scss` file (extract inline styles if any)
- [ ] Create `index.ts` re-export file
- [ ] Update all import paths
- [ ] Test that component still works
- [ ] Remove old files

## Important Rules

1. **Never** create all-in-one component files - always use the folder structure
2. **Always** include `.module.scss` file, even if empty
3. **Always** create `index.ts` for re-exports
4. **Never** create wrapper page components in `views/` - compose directly in `app/`
5. **Always** follow the naming convention: folder name = file names = component name

## Questions?

If you're unsure about where a component should live, ask:
- Is it reusable across multiple pages? → `components/`
- Is it specific to one page/route? → `views/PageName/`
- Is it a section of a page? → `views/PageName/SectionName/`
