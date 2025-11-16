# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js boilerplate project using TypeScript, React 19, Next.js 15 (App Router), Material-UI, and Sass for styling. Built with strict TypeScript configuration and comprehensive linting/formatting setup following Airbnb style guide.

## Material-UI MCP Server

**IMPORTANT**: This project uses Material-UI's MCP (Model Context Protocol) server for enhanced component documentation and assistance.

### MCP Setup

- MCP Server URL: https://mui.com/material-ui/getting-started/mcp/
- Use Material-UI MCP for:
  - Component API references
  - Usage examples and best practices
  - Theme customization guidance
  - Accessibility patterns
  - Migration guides

### When to Use MUI MCP

- When creating new Material-UI components
- When debugging MUI component issues
- When customizing MUI theme
- When looking for component prop documentation
- When implementing complex MUI patterns

**Always consult MUI MCP before:**

- Adding custom MUI component overrides
- Implementing complex Material-UI layouts
- Working with MUI theme configuration
- Using advanced MUI features (slots, sx prop, etc.)

## Folder Structure

```
src/
├── app/                          # Next.js App Router - pages and routes
│   ├── (home)/                   # Route group (doesn't affect URL)
│   │   └── page.tsx              # Home page at /
│   ├── api/                      # API routes
│   │   └── route.ts              # API endpoint
│   ├── layout.tsx                # Root layout with metadata
│   ├── error.tsx                 # Error boundary
│   ├── not-found.tsx             # 404 page
│   ├── robots.ts                 # Robots.txt generation
│   └── sitemap.ts                # Sitemap generation
├── components/                   # Reusable components
│   └── {ComponentName}/          # Component directory
│       ├── {ComponentName}.tsx   # Component implementation
│       ├── {ComponentName}.module.scss  # Component styles
│       └── index.ts              # Barrel export (export default ComponentName)
├── config/                       # Configuration files
│   └── meta.ts                   # SEO and metadata config
├── static/                       # Static MDX content
│   ├── legal/                    # Legal documents (MDX)
│   │   ├── privacy-policy.mdx
│   │   ├── terms-of-service.mdx
│   │   └── cookie-policy.mdx
│   └── faq/                      # FAQ content (MDX)
│       └── general.mdx
├── styles/                       # Global styles
│   ├── globals/                  # Reset and base styles
│   ├── mixins/                   # Sass mixins (breakpoints, etc.)
│   ├── settings/                 # Variables (colors, breakpoints, fonts)
│   ├── themes/                   # Material-UI theme configuration
│   ├── utils/                    # Utility functions (rem-calc, etc.)
│   └── index.scss                # Style entry point
├── types/                        # TypeScript type definitions (create as needed)
├── utils/                        # Utility functions (create as needed)
│   ├── context/                  # React Context providers
│   ├── hooks/                    # Custom React hooks
│   └── static/                   # Pure utility functions
├── lib/                          # Third-party integrations
│   └── mdx.ts                    # MDX utilities (fs, gray-matter)
├── valtio/                       # Valtio state management
│   └── {storeName}/              # Store directory
│       ├── {storeName}.store.ts  # State definition
│       ├── {storeName}.actions.ts # Action functions
│       └── index.ts              # Barrel export
├── views/                        # Page-specific view components
│   └── {pageName}/               # View matching route
│       └── {SectionName}/        # Page sections
│           ├── {SectionName}.tsx
│           ├── {SectionName}.module.scss
│           └── index.ts
├── actions/                      # Server actions
├── models/                       # Data models
└── files/                        # Static content (blogs, etc.)
```

## Static Content Management (MDX)

### Overview

All static pages (legal documents, FAQ, etc.) are stored as **MDX files** in the `src/static/` directory. These files are read server-side using Node.js `fs` module and parsed with `gray-matter`.

### Required Packages

```bash
yarn add gray-matter next-mdx-remote
```

### MDX File Format

```mdx
---
title: Privacy Policy
description: Our privacy policy
lastUpdated: 2025-01-15
---

# Privacy Policy

Content here...
```

### MDX Utility (`src/lib/mdx.ts`)

```typescript
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

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

export function getStaticContent(category: string, slug: string): StaticContent {
  const fullPath = path.join(staticDirectory, category, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    frontmatter: data as StaticContent['frontmatter'],
    content,
  };
}

export function getAllStaticContent(category: string): StaticContent[] {
  const categoryPath = path.join(staticDirectory, category);

  if (!fs.existsSync(categoryPath)) return [];

  const files = fs.readdirSync(categoryPath);

  return files.filter(file => file.endsWith('.mdx')).map(file => getStaticContent(category, file.replace('.mdx', '')));
}
```

### Page Implementation Example

```typescript
// src/app/privacy-policy/page.tsx
import { Container, Typography } from '@mui/material';
import { MDXRemote } from 'next-mdx-remote/rsc';

import { getStaticContent } from '@/lib/mdx';

export default function PrivacyPolicyPage() {
  const { frontmatter, content } = getStaticContent('legal', 'privacy-policy');

  return (
    <Container maxWidth="md">
      <Typography variant="h3">{frontmatter.title}</Typography>
      <MDXRemote source={content} />
    </Container>
  );
}
```

### Static Content Rules

**ALWAYS:**

- Store static pages as MDX files in `src/static/`
- Use `gray-matter` for frontmatter parsing
- Use `fs` for server-side file reading
- Use `MDXRemote` for rendering
- Include metadata in frontmatter

**NEVER:**

- Hardcode static content in components
- Use client-side file reading for MDX
- Skip frontmatter metadata

## Development Commands

### Start Development Server

```bash
yarn dev
```

Opens at http://localhost:3000

### Build

```bash
yarn build              # Standard production build
yarn build:static       # Static export build
yarn analyze            # Build with bundle analyzer
```

### Linting

```bash
yarn lint               # Run all linting (ESLint + Stylelint with auto-fix)
yarn lint:base          # ESLint only with pretty-quick for staged files
yarn lint:styles        # Stylelint only for SCSS files
```

### Other

```bash
yarn upgrade            # Upgrade packages to latest versions in specified range
```

## Architecture

### App Router Structure

- Uses Next.js 15 App Router (`src/app/`)
- Route groups with parentheses: `(home)` for organization without affecting URL structure
- Root layout (`src/app/layout.tsx`) defines metadata, OpenGraph, and Twitter cards from `@/config/meta.ts`
- Global metadata configuration centralized in `src/config/meta.ts`
- Static content pages read from `src/static/` using `fs` and `gray-matter`

### Component Architecture

- **Layout pattern**: Main Layout component wraps Header, main content, and Footer
- **Views**: Page-specific components in `src/views/` matching routes (e.g., `views/home/FirstSection`)
- **Components**: Reusable components in `src/components/` with co-located styles
- **Static Content**: MDX files in `src/static/` read server-side
- Each component follows pattern: `{ComponentName}/{ComponentName}.tsx` + `{ComponentName}.module.scss` + `index.ts`

### Component Definition Pattern

**CRITICAL: All components MUST follow this exact pattern:**

```typescript
// src/components/Autocomplete/Autocomplete.tsx
import React from 'react';

import { ExpandMoreRounded } from '@mui/icons-material';
import {
  FormControl,
  FormLabel,
  MenuItem,
  Autocomplete as MuiAutocomplete,
  TextField,
  TextFieldProps as TextFieldPropsType,
  Typography,
} from '@mui/material';

export interface AutocompleteOption {
  id: string;
  label: string;
}

export interface AutocompleteProps {
  value: string;
  options: AutocompleteOption[];
  onChange: (value: string) => void;
  onInputChange?: (value: string) => void;
  label?: string;
  disabled?: boolean;
  renderOption?: (option: AutocompleteOption) => React.ReactNode;
  filteredOptions?: AutocompleteOption[];
  TextFieldProps?: TextFieldPropsType;
}

const Autocomplete = ({
  value,
  options,
  onChange,
  onInputChange,
  label,
  disabled,
  renderOption,
  filteredOptions,
  TextFieldProps,
}: AutocompleteProps) => {
  const selectedValue = value ? options.find((option) => option.id === value) : undefined;

  const handleIsOptionEqualToValue = (option: AutocompleteOption, inputValue: AutocompleteOption) =>
    option.id === inputValue.id && option.label === inputValue.label;

  const getOptionDisabled = (option: AutocompleteOption) =>
    filteredOptions?.every((filteredOption) => filteredOption.id !== option.id) || false;

  const handleChange = (_: React.SyntheticEvent, newValue: AutocompleteOption | null) => {
    onChange(newValue?.id || '');
  };

  const handleInputChange = (_: React.SyntheticEvent, newInputValue: string) => {
    if (onInputChange) {
      onInputChange(newInputValue);
    }
  };

  return (
    <FormControl fullWidth>
      {label && <FormLabel>{label}</FormLabel>}
      <MuiAutocomplete
        value={selectedValue || null}
        options={options}
        onChange={handleChange}
        noOptionsText="No matches"
        popupIcon={<ExpandMoreRounded />}
        onInputChange={handleInputChange}
        isOptionEqualToValue={handleIsOptionEqualToValue}
        getOptionDisabled={getOptionDisabled}
        disabled={disabled}
        renderInput={(params) => <TextField {...params} {...TextFieldProps} />}
        renderOption={(props, option) => (
          <MenuItem {...props} key={option.id}>
            {renderOption ? renderOption(option) : <Typography variant="body2">{option.label}</Typography>}
          </MenuItem>
        )}
      />
    </FormControl>
  );
};

export default Autocomplete;
```

**Barrel Export (`index.ts`)**:

```typescript
// src/components/Autocomplete/index.ts
import Autocomplete from './Autocomplete';

export default Autocomplete;
```

**Component Definition Rules:**

1. **Define component as const**: `const ComponentName = () => { ... }`
2. **Export default at bottom**: `export default ComponentName;`
3. **Export interfaces/types**: Always export component props interface
4. **Barrel export pattern**: `index.ts` imports and re-exports default
5. **NO useMemo or useCallback**: Calculate values inline or use simple variables
6. **React import**: Import React at top when using JSX

### Path Aliases

- `@/*` maps to `src/*` (configured in tsconfig.json)
- Always use absolute imports via `@/` prefix instead of relative paths
- ESLint warns on `../` patterns to enforce this

## Material-UI Layout & Styling Best Practices

### Preferred Layout Components

**ALWAYS prefer Material-UI layout components over custom div wrappers:**

**Use MUI Layout Components:**

- `Stack` - For single-direction layouts (column/row)
- `Grid` - For complex responsive layouts
- `Box` - For simple wrappers with spacing/styling
- `Container` - For page-level max-width containers

**Example - Use Stack instead of divs:**

❌ **BAD (Don't do this):**

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
  <Button>First</Button>
  <Button>Second</Button>
  <Button>Third</Button>
</div>
```

✅ **GOOD (Do this):**

```tsx
<Stack direction="column" spacing={2}>
  <Button>First</Button>
  <Button>Second</Button>
  <Button>Third</Button>
</Stack>
```

**Example - Use Grid for layouts:**

❌ **BAD:**

```tsx
<div className={styles.wrapper}>
  <div className={styles.sidebar}>...</div>
  <div className={styles.content}>...</div>
</div>
```

✅ **GOOD:**

```tsx
<Grid container spacing={2}>
  <Grid size={{ xs: 12, md: 4 }}>
    <Sidebar />
  </Grid>
  <Grid size={{ xs: 12, md: 8 }}>
    <Content />
  </Grid>
</Grid>
```

### Grid API - CRITICAL UPDATE

**⚠️ Grid `item` prop is DEPRECATED. NEVER use it!**

❌ **DEPRECATED (Will cause warnings):**

```tsx
<Grid container spacing={2}>
  <Grid item xs={12} md={6}>
    <Content />
  </Grid>
</Grid>
```

✅ **CORRECT (Use size prop):**

```tsx
<Grid container spacing={2}>
  <Grid size={{ xs: 12, md: 6 }}>
    <Content />
  </Grid>
</Grid>
```

**Grid size prop examples:**

```tsx
// Full width
<Grid size={12}>

// Responsive breakpoints
<Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>

// Complex layout
<Grid container spacing={2.5} alignItems="flex-start">
  <Grid size={{ xs: 12, md: 8 }}>
    <MainContent />
  </Grid>
  <Grid size={{ xs: 12, md: 4 }}>
    <Sidebar />
  </Grid>
</Grid>

// Auto-sizing
<Grid size="auto">

// Grow to fill space
<Grid size="grow">
```

### MUI sx Prop vs SCSS Modules - NEVER MIX

**CRITICAL RULE: Choose ONE styling approach per component - NEVER combine both!**

#### Option 1: SCSS Modules (Preferred)

✅ **Use SCSS modules for:**

- Complex styling with nested selectors
- Hover states, pseudo-elements
- Media queries with custom breakpoints
- Component-specific custom styles
- When you need full SCSS features (mixins, variables, etc.)

```tsx
// Component.tsx
import { Box } from '@mui/material';

import styles from './Component.module.scss';

const Component = () => {
  return (
    <Box className={styles.container}>
      <div className={styles.header}>...</div>
    </Box>
  );
};
```

```scss
// Component.module.scss
@use '@/styles/utils/rem-calc' as *;
@use '@/styles/mixins/breakpoints' as *;

.container {
  padding: rem-calc(24);
  background-color: var(--mui-palette-background-paper);

  @include media(md) {
    padding: rem-calc(32);
  }
}

.header {
  margin-bottom: rem-calc(16);

  &:hover {
    opacity: 0.8;
  }
}
```

#### Option 2: MUI sx Prop

✅ **Use sx prop for:**

- Simple one-off styles
- Dynamic styles based on props/state
- Using MUI theme values directly
- Quick prototyping

```tsx
import { Box, Stack } from '@mui/material';

const Component = ({ isActive }: { isActive: boolean }) => {
  return (
    <Box
      sx={{
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        ...(isActive && {
          borderColor: 'primary.main',
          borderWidth: 2,
        }),
      }}
    >
      <Stack spacing={2}>
        <div>Content</div>
      </Stack>
    </Box>
  );
};
```

#### NEVER Mix Both

❌ **WRONG (Don't do this):**

```tsx
// DON'T mix sx and SCSS className on same element!
<Box
  className={styles.container} // SCSS
  sx={{ p: 2, bgcolor: 'primary.main' }} // sx prop
>
  ...
</Box>
```

✅ **CORRECT (Choose one):**

```tsx
// Either use SCSS only:
<Box className={styles.container}>
  ...
</Box>

// OR use sx only:
<Box sx={{ p: 3, bgcolor: 'background.paper' }}>
  ...
</Box>
```

**Decision Guide:**

```
Does component need complex custom styles?
├─ YES → Use SCSS modules
│   └─ Use className={styles.something}
│
└─ NO → Use sx prop
    └─ Use sx={{ ... }}

Is styling based on theme values only?
├─ YES → sx prop is fine
└─ NO → Use SCSS modules

Do you need hover states / pseudo-elements?
├─ YES → Use SCSS modules
└─ NO → sx prop is fine

Do you need custom media queries?
├─ YES → Use SCSS modules
└─ NO (just MUI breakpoints) → Either works, prefer SCSS
```

### Common MUI Layout Patterns

**Vertical Stack:**

```tsx
<Stack direction="column" spacing={2}>
  <Item1 />
  <Item2 />
  <Item3 />
</Stack>
```

**Horizontal Stack:**

```tsx
<Stack direction="row" spacing={2} alignItems="center">
  <Icon />
  <Typography>Text</Typography>
</Stack>
```

**Responsive Stack:**

```tsx
<Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
  <LeftContent />
  <RightContent />
</Stack>
```

**Grid with different sizes:**

```tsx
<Grid container spacing={3}>
  <Grid size={{ xs: 12 }}>
    <Header />
  </Grid>
  <Grid size={{ xs: 12, md: 8 }}>
    <MainContent />
  </Grid>
  <Grid size={{ xs: 12, md: 4 }}>
    <Sidebar />
  </Grid>
  <Grid size={{ xs: 12 }}>
    <Footer />
  </Grid>
</Grid>
```

**Container for page layout:**

```tsx
<Container maxWidth="lg">
  <Stack spacing={4}>
    <Header />
    <Content />
  </Stack>
</Container>
```

### MUI Layout Component Quick Reference

| Component   | Use Case                   | Example                                         |
| ----------- | -------------------------- | ----------------------------------------------- |
| `Stack`     | Linear layouts (flex)      | `<Stack direction="row" spacing={2}>`           |
| `Grid`      | Complex responsive layouts | `<Grid size={{ xs: 12, md: 6 }}>`               |
| `Box`       | Simple wrapper/spacing     | `<Box p={2}>` or `<Box className={styles.box}>` |
| `Container` | Page-level max-width       | `<Container maxWidth="lg">`                     |
| `Divider`   | Visual separator           | `<Divider />`                                   |
| `Paper`     | Elevated surface           | `<Paper elevation={2}>`                         |

**REMEMBER:**

1. ✅ Use MUI layout components (Stack, Grid, Box) instead of divs
2. ✅ Grid `size` prop, NEVER `item` prop
3. ✅ Choose SCSS modules OR sx prop - NEVER both on same element
4. ✅ Prefer SCSS modules for complex styling
5. ✅ Use sx prop for simple/dynamic styles

## State Management (Valtio)

Valtio provides proxy-based reactive state. All stores in [`src/valtio/`](src/valtio/):

### Store Pattern

**Store Definition** (`*.store.ts`):

```typescript
import { proxy, useSnapshot } from 'valtio';

interface MyStore {
  someValue: string;
}

export const myStore = proxy<MyStore>({
  someValue: 'initial',
});

export const useMyStore = () => useSnapshot(myStore);
```

**Actions** (`*.actions.ts`):

```typescript
import { myStore } from './my.store';

export const updateValue = (newValue: string) => {
  myStore.someValue = newValue;
};
```

**Client Component Usage**:

```typescript
'use client';

import { useMyStore } from '@/valtio/my/my.store';
import { updateValue } from '@/valtio/my/my.actions';

const Component = () => {
  const { someValue } = useMyStore();

  const handleClick = () => updateValue('new');

  return <div>{someValue}</div>;
};
```

## Material-UI Integration

### Theme Configuration

**Theme**: [`src/styles/themes/index.ts`](src/styles/themes/index.ts)

```typescript
const theme = createTheme({
  breakpoints,
  components, // Component style overrides
  palette, // Color system
  typography, // Typography scale
  colorSchemes: {
    dark: true, // Auto dark mode support
  },
});
```

**Provider**: [`src/app/[locale]/providers.tsx`](src/app/[locale]/providers.tsx)

```typescript
<AppRouterCacheProvider>
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
</AppRouterCacheProvider>
```

### MUI Component Usage Guidelines

**ALWAYS use Material-UI MCP** when working with MUI components. Consult MCP for:

- Component props and API
- Styling approaches (sx prop vs styled components vs theme overrides)
- Accessibility best practices
- Performance optimization

**Preferred MUI Styling Approach**:

1. **Theme overrides** (in `src/styles/themes/`) for global component styles
2. **SCSS modules** for component-specific custom styles
3. **sx prop** only for one-off, dynamic styles
4. **styled()** API sparingly, only for heavily customized components

**Example - Using MUI with SCSS Modules**:

```typescript
import { Button } from '@mui/material';

import styles from './MyComponent.module.scss';

export default function MyComponent() {
  return (
    <div className={styles.container}>
      <Button variant="contained" className={styles.customButton}>
        Click Me
      </Button>
    </div>
  );
}
```

## Component Patterns

### Server vs Client Components

**Server Components** (default):

```typescript
// No 'use client' directive
import { getLoggedInUser } from '@/actions/auth.actions';

export default async function MyPage() {
  const user = await getLoggedInUser();

  return <div>{user?.nickname}</div>;
}
```

**Client Components** (when needed):

```typescript
'use client';

import { useState } from 'react';

import { useMyStore } from '@/valtio/my/my.store';

export default function MyComponent() {
  const [count, setCount] = useState(0);
  const { someValue } = useMyStore();

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**When to use 'use client'**:

- Event handlers (`onClick`, `onChange`, etc.)
- React hooks (`useState`, `useEffect`, `useContext`, etc.)
- Browser APIs (`window`, `localStorage`, `document`)
- Valtio `useSnapshot()` hook
- MUI hooks (`useColorScheme`, `useMediaQuery`, etc.)

### Styling

- SCSS modules for component-specific styles
- Material-UI theme system for global component overrides
- Global styles in `src/styles/`:
  - `globals/` - Reset and base styles
  - `settings/` - Fonts, colors, breakpoints
  - `mixins/` - Reusable SCSS mixins
  - `themes/` - Material-UI theme configuration
  - `utils/` - Utility functions for styling
- Import global styles via `@/styles/index.scss` (already imported in root layout)

#### SCSS Imports in Component/View Modules

When creating or modifying `.module.scss` files, import required utilities at the top:

```scss
@use '@/styles/settings/variables' as *; // For colors, fonts, breakpoints
@use '@/styles/utils/rem-calc' as *; // For rem-calc() function
@use '@/styles/mixins/breakpoints' as *; // For media() mixin
```

#### Available SCSS Utilities

**rem-calc Function** (`@/styles/utils/rem-calc`):

- Converts pixel values to rem units (base: 16px)
- Usage: `rem-calc(32)` → `2rem`, `rem-calc(16 24)` → `1rem 1.5rem`
- Use for all size properties: width, height, padding, margin, font-size, etc.
- Handles `auto` values and multiple values

**media Mixin** (`@/styles/mixins/breakpoints`):

- Responsive breakpoint mixin with min-width and/or max-width
- Usage:

```scss
@include media(md) {
  ...;
} // min-width: 768px
@include media(0, lg) {
  ...;
} // max-width: 1024px
@include media(sm, md) {
  ...;
} // min-width: 640px and max-width: 768px
@include media(1200px) {
  ...;
} // Custom pixel value: min-width: 1200px
```

## Claude Coding Preferences

### What Claude Should NEVER Do

- **NO** `useCallback`, `useMemo`, or `React.memo` - ABSOLUTELY FORBIDDEN
- **NO** Grid `item` prop - use `size={{ xs: 12 }}` instead
- **NO** mixing sx prop and SCSS className on same element
- **NO** using plain divs when MUI layout components exist (Stack, Grid, Box)
- **NO** unnecessary abstractions or over-engineering
- **NO** adding new dependencies without asking first
- **NO** refactoring existing working code without permission
- **NO** changing folder structure without explicit approval
- **NO** inline styles or Tailwind utility classes (use SCSS modules or sx prop)
- **NO** ignoring Material-UI MCP - always consult it for MUI work
- **NO** custom implementations of components that exist in Material-UI
- **NO** function declarations - use const arrow functions only

### What Claude Should ALWAYS Do

- **Consult Material-UI MCP** before working with any MUI component
- **Use MUI layout components**: Stack, Grid, Box instead of plain divs
- **Grid size prop**: `<Grid size={{ xs: 12 }}>` NEVER `<Grid item xs={12}>`
- **Choose one**: Either SCSS modules OR sx prop - never mix on same element
- **Prefer SCSS modules** for complex/custom styling
- **Use sx prop** for simple/dynamic/theme-based styling
- **Define components as const**: `const Component = () => { ... }`
- **Export default at bottom** of component file
- **Calculate inline** instead of using useMemo/useCallback
- Clean, readable code over "clever" solutions
- Server Components by default (only add 'use client' when truly necessary)
- Absolute imports (`@/`) over relative paths
- Single responsibility principle for components
- Descriptive variable names over abbreviated ones
- Follow existing patterns in the codebase
- Ask for clarification when requirements are ambiguous

### Code Style Preferences

- Keep components simple and focused
- Avoid deep nesting (max 3 levels)
- Extract complex logic into custom hooks or utilities (but NO useMemo/useCallback inside)
- Co-locate related files (component + styles + types)
- Use TypeScript strictly - no `any` types
- Prefer composition over inheritance
- Write self-documenting code with clear naming

### Material-UI Specific Preferences

- Use MUI components instead of custom HTML elements when available
- Customize MUI components via theme overrides, not inline styles
- Use MUI's built-in responsive features (breakpoints, sx prop conditionals)
- Leverage MUI's accessibility features (proper ARIA attributes, keyboard navigation)
- Follow MUI's naming conventions for custom components
- **Always use new Grid API** with `size` prop

## Common Tasks & Workflows

### Adding a New Page

1. Create route in `src/app/[route]/page.tsx`
2. Create view component in `src/views/[pageName]/`
3. Add sections as separate components within view folder
4. Update `src/config/meta.ts` for SEO metadata
5. Add to sitemap.ts if needed

**Example**:

```typescript
// src/app/about/page.tsx
import AboutView from '@/views/about';

export default function AboutPage() {
  return <AboutView />;
}
```

```typescript
// src/views/about/index.tsx
import ContentSection from './ContentSection';
import HeroSection from './HeroSection';

export default function AboutView() {
  return (
    <>
      <HeroSection />
      <ContentSection />
    </>
  );
}
```

### Adding a New Component

1. **Consult Material-UI MCP** if the component could use MUI elements
2. Create folder: `src/components/{ComponentName}/`
3. Create files:
   - `{ComponentName}.tsx` - Component logic
   - `{ComponentName}.module.scss` - Styles
   - `index.ts` - Barrel export
4. Import required SCSS utilities at the top of `.module.scss`
5. Use absolute imports for all dependencies

**Example**:

```typescript
// src/components/CustomCard/CustomCard.tsx
import { Card, CardContent, Typography } from '@mui/material';

import styles from './CustomCard.module.scss';

interface CustomCardProps {
  title: string;
  description: string;
}

const CustomCard = ({ title, description }: CustomCardProps) => {
  return (
    <Card className={styles.card}>
      <CardContent>
        <Typography variant="h5" className={styles.title}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CustomCard;
```

```scss
// src/components/CustomCard/CustomCard.module.scss
@use '@/styles/utils/rem-calc' as *;
@use '@/styles/mixins/breakpoints' as *;

.card {
  padding: rem-calc(24);

  @include media(md) {
    padding: rem-calc(32);
  }
}

.title {
  margin-bottom: rem-calc(16);
}
```

```typescript
// src/components/CustomCard/index.ts
import CustomCard from './CustomCard';

export default CustomCard;
```

### Adding a New Valtio Store

1. Create folder: `src/valtio/{storeName}/`
2. Create files:
   - `{storeName}.store.ts` - State definition
   - `{storeName}.actions.ts` - Action functions
   - `index.ts` - Barrel export
3. Use in client components via `useSnapshot()`

**Example**:

```typescript
// src/valtio/user/user.store.ts
import { proxy, useSnapshot } from 'valtio';

interface UserStore {
  name: string;
  email: string;
  isLoggedIn: boolean;
}

export const userStore = proxy<UserStore>({
  name: '',
  email: '',
  isLoggedIn: false,
});

export const useUserStore = () => useSnapshot(userStore);
```

```typescript
// src/valtio/user/user.actions.ts
import { userStore } from './user.store';

export const loginUser = (name: string, email: string) => {
  userStore.name = name;
  userStore.email = email;
  userStore.isLoggedIn = true;
};

export const logoutUser = () => {
  userStore.name = '';
  userStore.email = '';
  userStore.isLoggedIn = false;
};
```

```typescript
// src/valtio/user/index.ts
export * from './user.actions';
export * from './user.store';
```

### Working with Material-UI

**ALWAYS consult Material-UI MCP before implementing MUI components.**

- Import components from `@mui/material`
- Use theme from `@/styles/themes`
- Override component styles in theme config, not in component files (unless component-specific)
- Use MUI breakpoints via theme, not custom media queries
- Leverage MUI's sx prop for one-off dynamic styles only

**Theme Overrides Example**:

```typescript
// src/styles/themes/index.ts
components: {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        borderRadius: '8px',
      },
    },
    defaultProps: {
      disableElevation: true,
    },
  },
}
```

### API Routes

- Create in `src/app/api/[endpoint]/route.ts`
- Export named functions: `GET`, `POST`, `PUT`, `DELETE`, etc.
- Use `NextRequest` and `NextResponse` types
- Handle errors consistently with proper status codes

**Example**:

```typescript
// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const users = await fetchUsers();

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newUser = await createUser(body);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
```

## Migrating Code from V0.dev

When importing code from V0.dev projects, **follow this conversion process**:

### 1. Component Conversion

**Separate V0 single-file components** into proper structure:

- Component logic → `{ComponentName}.tsx`
- Styles → `{ComponentName}.module.scss`
- Types → inline or in `@/types/` if reusable

### 2. Convert Tailwind Classes to SCSS

- Extract Tailwind utility classes
- Convert to semantic SCSS classes using project's design tokens
- Use variables from `@/styles/settings/variables`

### 3. Replace shadcn/ui with Material-UI

**IMPORTANT**: Consult Material-UI MCP for equivalent components.

Common conversions:

- `Button` → `@mui/material/Button`
- `Card` → `@mui/material/Card`
- `Input` → `@mui/material/TextField`
- `Dialog` → `@mui/material/Dialog`
- `Select` → `@mui/material/Select`
- `Tabs` → `@mui/material/Tabs`

### 4. Adapt to Project Structure

- Place page components in `src/views/[pageName]/`
- Place reusable components in `src/components/`
- Use project's established utilities and hooks
- Follow existing naming conventions

### 5. Update Imports

- Change to absolute imports with `@/` prefix
- Import MUI components from `@mui/material`
- Use project's utilities from `@/utils/`

### 6. Add TypeScript Types

- Ensure strict typing for all props
- Add interfaces for data structures
- No `any` types allowed
- Use proper type imports

### Example Conversion

**V0 Code (with Tailwind + shadcn/ui)**:

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Component() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-gray-600">Get started with our platform</p>
        <Button className="w-full">Get Started</Button>
      </CardContent>
    </Card>
  );
}
```

**Converted to Project Structure**:

`src/components/WelcomeCard/WelcomeCard.tsx`:

```tsx
import { Button, Card, CardContent, Typography } from '@mui/material';

import styles from './WelcomeCard.module.scss';

interface WelcomeCardProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const WelcomeCard = ({
  title = 'Welcome',
  description = 'Get started with our platform',
  buttonText = 'Get Started',
  onButtonClick,
}: WelcomeCardProps) => {
  return (
    <Card className={styles.card}>
      <CardContent className={styles.content}>
        <Typography variant="h4" className={styles.title}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" className={styles.description}>
          {description}
        </Typography>
        <Button variant="contained" fullWidth onClick={onButtonClick} className={styles.button}>
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
```

`src/components/WelcomeCard/WelcomeCard.module.scss`:

```scss
@use '@/styles/settings/variables' as *;
@use '@/styles/utils/rem-calc' as *;

.card {
  width: 100%;
  max-width: rem-calc(448); // 28rem = 448px
}

.content {
  display: flex;
  flex-direction: column;
  gap: rem-calc(16);
}

.title {
  font-weight: 700;
}

.description {
  color: $color-text-secondary;
}

.button {
  margin-top: rem-calc(8);
}
```

`src/components/WelcomeCard/index.ts`:

```tsx
import WelcomeCard from './WelcomeCard';

export default WelcomeCard;
```

## Environment & Deployment

### Environment Variables

Create `.env.local` for local development:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Add other environment variables as needed
# NEXT_PUBLIC_* variables are exposed to the browser
# Regular variables are server-side only
```

### Build Modes

- **Development**: `yarn dev` - Hot reload, not optimized, includes source maps
- **Production**: `yarn build` → `yarn start` - Optimized, minified, production-ready
- **Static Export**: `yarn build:static` - For static hosting (no server-side features)
- **Bundle Analysis**: `yarn analyze` - Visualize bundle size and composition

### Deployment Checklist

- [ ] Update `src/config/meta.ts` with production URLs and metadata
- [ ] Set all required environment variables in deployment platform
- [ ] Run `yarn build` locally to check for build errors
- [ ] Test production build locally with `yarn start`
- [ ] Verify all API routes work correctly
- [ ] Update `robots.ts` for production (allow/disallow crawling)
- [ ] Update `sitemap.ts` with all production URLs
- [ ] Test responsive design on multiple devices
- [ ] Verify Material-UI theme works in production
- [ ] Check bundle size with `yarn analyze` (optimize if needed)

## Troubleshooting

### Common Issues

**"use client" errors:**

- **Symptom**: Hooks or event handlers not working, hydration errors
- **Solution**: Add `'use client';` directive at top of file
- **Check if component uses**:
  - React hooks (`useState`, `useEffect`, etc.)
  - Event handlers (`onClick`, `onChange`, etc.)
  - Browser APIs (`window`, `localStorage`, `document`)
  - Valtio hooks (`useSnapshot`)
  - MUI hooks (`useMediaQuery`, `useColorScheme`, etc.)

**Import path errors:**

- **Symptom**: Module not found errors, incorrect imports
- **Solution**:
  - Use `@/` prefix for all imports from `src/`
  - Never use `../` to go up directories (ESLint will warn)
  - Check `tsconfig.json` paths configuration
  - Verify file exists at specified path

**SCSS not applied:**

- **Symptom**: Styles not rendering, broken layout
- **Solution**:
  - Verify `.module.scss` import: `import styles from './Component.module.scss';`
  - Check class name usage: `className={styles.myClass}` (not `className="myClass"`)
  - Import utilities at top of SCSS file if using variables/mixins/functions
  - Check for typos in class names
  - Verify SCSS is compiled (check terminal for errors)

**Valtio state not updating:**

- **Symptom**: UI not reflecting state changes
- **Solution**:
  - Ensure component has `'use client';` directive
  - Use `useSnapshot()` hook, not direct store access in components
  - Mutations must happen in action functions, not in components
  - Check that action is actually being called
  - Verify store is properly initialized

**Material-UI styles not working:**

- **Symptom**: MUI components look unstyled or broken
- **Solution**:
  - Check that `ThemeProvider` wraps your app (in `providers.tsx`)
  - Verify MUI imports: `import { Button } from '@mui/material';`
  - **Consult Material-UI MCP** for proper component usage
  - Check for CSS specificity conflicts with global styles
  - Verify emotion cache is properly set up (`AppRouterCacheProvider`)

**TypeScript errors:**

- **Symptom**: Red squiggly lines, build failures
- **Solution**:
  - Check if types are properly imported
  - Verify interface/type matches actual usage
  - Look for `any` types that should be properly typed
  - Check for missing or incorrect prop types
  - Use TypeScript's quick fix suggestions (Cmd/Ctrl + .)

**Build errors:**

- **Symptom**: `yarn build` fails
- **Solution**:
  - Check terminal output for specific error
  - Verify all environment variables are set
  - Look for TypeScript errors (must fix all before build)
  - Check for circular dependencies
  - Clear `.next` folder and rebuild: `rm -rf .next && yarn build`

**MUI component not working as expected:**

- **Symptom**: Component behavior differs from documentation
- **Solution**:
  - **Always consult Material-UI MCP first**
  - Check MUI version compatibility (`package.json`)
  - Verify all required props are provided
  - Check browser console for MUI warnings
  - Review MUI documentation for the specific component

## Quick Reference

### File Naming Conventions

- Components: `PascalCase.tsx` + `PascalCase.module.scss`
- Utils: `camelCase.ts`
- Config: `kebab-case.config.ts`
- Models: `kebab-case.model.ts`
- Types: `kebab-case.type.ts`
- Actions: `kebab-case.actions.ts`
- Stores: `kebab-case.store.ts`

### Import Order (enforced by Prettier)

1. React imports
2. Third-party libraries (including Material-UI)
3. Absolute imports (`@/...`)
4. Relative imports
5. Type imports
6. Style imports (`.module.scss`)

**Example**:

```typescript
import { useState } from 'react';

import { Button, Typography } from '@mui/material';

import CustomCard from '@/components/CustomCard';
import type { User } from '@/types/user.type';
import { useUserStore } from '@/valtio/user';

import styles from './Component.module.scss';
import { formatDate } from './utils';
```

### Common Paths

- **Components**: `@/components/`
- **Views**: `@/views/`
- **Utils**: `@/utils/`
- **Config**: `@/config/`
- **Models**: `@/models/`
- **Types**: `@/types/`
- **Lib**: `@/lib/`
- **Actions**: `@/actions/`
- **Valtio**: `@/valtio/`
- **Styles**: `@/styles/`
- **Static**: `@/static/` (MDX content)
- **Files**: `@/files/` (other static content)
- **Mock**: `@/_mock/` (mock data for development/static generation)

### Material-UI Quick Reference

**Consult MUI MCP for detailed documentation on all components.**

**Common Components**:

- Layout: `Box`, `Container`, `Grid`, `Stack`
- Inputs: `Button`, `TextField`, `Select`, `Checkbox`, `Radio`, `Switch`
- Data Display: `Typography`, `Card`, `List`, `Table`, `Chip`, `Avatar`
- Feedback: `Alert`, `Snackbar`, `Dialog`, `CircularProgress`, `Skeleton`
- Navigation: `AppBar`, `Tabs`, `Drawer`, `Menu`, `Breadcrumbs`

**Theme Access**:

```typescript
import { useTheme } from '@mui/material/styles';

const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
```

**Responsive Props**:

```typescript
<Box
  sx={{
    width: { xs: '100%', md: '50%' },
    padding: { xs: 2, md: 4 },
  }}
/>
```

## Code Standards

### TypeScript

- Strict mode enabled
- Target: ES2017
- No explicit return types required (explicit-function-return-type: off)
- Unused vars: warning only
- No `any` types - use `unknown` or proper typing

### ESLint Rules (Key Deviations from Airbnb)

- **Single quotes** for strings
- **Blank line spacing** enforced between declarations, statements, and control flow
- **No relative imports** beyond current directory (`../` patterns warned)
- **Function component definitions** - any style allowed
- **Props spreading** allowed in JSX
- **Default props** not required
- Import order handled by Prettier plugin (not ESLint)

### Prettier Configuration

- 120 character line width
- Single quotes
- Semicolons required
- ES5 trailing commas
- Arrow functions: avoid parens when possible
- **Import order** (via @trivago/prettier-plugin-sort-imports):
  1. React imports
  2. Third-party modules
  3. `@/` alias imports
  4. Relative imports
  - Separated by blank lines

### Stylelint

- Standard SCSS config with Prettier compatibility
- Configured to check all `**/*.scss` files
- Enforces consistent property order
- Warns on deprecated features

## Pre-commit Hooks

Husky configured but hooks directory is empty. If hooks are added, they will run via `yarn prepare` command.

## Development Notes

- React Strict Mode enabled (catches potential issues early)
- Bundle analyzer available via `ANALYZE=true` environment variable
- No test framework currently configured (can add Jest/Vitest if needed)
- Uses Yarn for package management
- Material-UI MCP server provides enhanced component documentation

## Resources

- **Material-UI Documentation**: https://mui.com/material-ui/
- **Material-UI MCP**: https://mui.com/material-ui/getting-started/mcp/
- **Next.js Documentation**: https://nextjs.org/docs
- **Valtio Documentation**: https://valtio.pmnd.rs/
- **TypeScript Documentation**: https://www.typescriptlang.org/docs/
- **SCSS Documentation**: https://sass-lang.com/documentation/

## Notes for Claude

- **ALWAYS consult Material-UI MCP** before working with MUI components
- Follow established patterns - don't reinvent the wheel
- Ask questions if requirements are unclear
- Prioritize code readability over cleverness
- Keep components focused and reusable
- Write self-documenting code with clear naming
- Use TypeScript to its full potential
- Respect the "What Claude Should NEVER Do" list above
