# Migration Guide: Lovable (Vite + Tailwind) → Next.js + Material-UI

## Overview

This document tracks the migration of the Football Rules Quiz application from:
- **Source**: Vite + React + Tailwind CSS + shadcn/ui + React Router
- **Target**: Next.js 15 + React 19 + Material-UI + SCSS Modules + App Router

---

## ✅ Completed Infrastructure

### 1. Color System & Theming
- ✅ Migrated Tailwind HSL color variables to SCSS (`src/styles/settings/_variables.scss`)
- ✅ Created Material-UI dark theme configuration (`src/styles/themes/index.ts`)
- ✅ Colors preserved:
  - Primary: Green (`hsl(142, 76%, 45%)`)
  - Background: Dark blue-gray (`hsl(220, 26%, 6%)`)
  - Success, warning, error semantic colors

### 2. Supabase Configuration
- ✅ Created Next.js-compatible Supabase clients:
  - `src/lib/supabase/client.ts` - Client-side (@supabase/ssr)
  - `src/lib/supabase/server.ts` - Server-side (Server Components/Actions)
  - `src/lib/supabase/types.ts` - Database types
- ✅ Created `.env.local.example` with required variables
- ⚠️  **Action Required**: User must create `.env.local` and add:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your-url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
  ```

### 3. Authentication System
- ✅ Migrated from React Context to Valtio state management:
  - `src/valtio/auth/auth.store.ts` - Auth state
  - `src/valtio/auth/auth.actions.ts` - Auth actions (signUp, signIn, signOut, etc.)
- ✅ Created `AuthProvider` component (`src/utils/context/AuthProvider.tsx`)
- ✅ Integrated into app providers

### 4. Hooks
- ✅ `useUserRole` hook (`src/utils/hooks/useUserRole.tsx`) - Admin/Manager/User role detection

### 5. Layout Components (Material-UI)
- ✅ **Navigation** (`src/components/Navigation/`)
  - MUI AppBar with responsive Drawer
  - User account menu with admin/manager sections
  - Mobile-friendly hamburger menu
- ✅ **Footer** (`src/components/Footer/`)
  - 4-column grid layout (brand, quick links, resources)
  - Social media icons
  - Responsive design
- ✅ **Layout** (`src/components/Layout/`)
  - Wrapper with Navigation + Footer
  - Sticky header, flex layout

### 6. Providers Setup
- ✅ Updated `src/app/providers.tsx`:
  - Material-UI ThemeProvider
  - CssBaseline (MUI global reset)
  - AuthProvider (Valtio auth initialization)
- ✅ Updated `src/app/layout.tsx` to use Providers

---

## 📋 Remaining Pages to Migrate

All pages from `src/pages/` in Lovable project need migration to Next.js App Router structure.

### Page Migration Checklist

| Page | Route | Status | Notes |
|------|-------|--------|-------|
| Index.tsx | `/` | ✅ Complete | Home page with categories |
| Leaderboard.tsx | `/leaderboard` | ✅ Complete | Global leaderboard |
| Privacy.tsx | `/privacy` | ✅ Complete | MDX page |
| Terms.tsx | `/terms` | ✅ Complete | MDX page |
| NotFound.tsx | `/not-found` | ✅ Complete | Enhanced 404 page |
| Auth.tsx | `/auth` | ⏳ Pending | Sign up / Sign in page |
| QuizListing.tsx | `/quizzes/[categoryName]` | ⏳ Pending | Dynamic route |
| CustomQuiz.tsx | `/quizzes/custom` | ⏳ Pending | Custom quiz builder |
| ActiveQuiz.tsx | `/quiz/[id]` | ⏳ Pending | Active quiz session |
| QuizReview.tsx | `/review/[id]` | ⏳ Pending | Quiz results review |
| QuizHistory.tsx | `/profile/history` | ⏳ Pending | User quiz history |
| ProfileEdit.tsx | `/profile/edit` | ⏳ Pending | Edit user profile |
| AdminUsers.tsx | `/admin/users` | ⏳ Pending | Admin: User management |
| AdminQuestions.tsx | `/admin/questions` | ⏳ Pending | Admin: Question management |

---

## 📝 Migration Strategy for Each Page

### Template for Page Migration

1. **Create App Router directory**:
   ```bash
   mkdir -p src/app/[route-name]
   ```

2. **Convert Tailwind classes to MUI components**:
   - shadcn/ui components → Material-UI equivalents
     - `<Button>` → `<Button>` (MUI)
     - `<Card>` → `<Card>` (MUI)
     - `<Input>` → `<TextField>` (MUI)
     - `<Select>` → `<Select>` or `<Autocomplete>` (MUI)
     - `<Dialog>` → `<Dialog>` (MUI)
     - etc.
   - Tailwind utility classes → MUI `sx` prop or SCSS modules

3. **Update imports**:
   - React Router `Link`, `useNavigate` → Next.js `Link`, `useRouter`
   - Supabase client: `@/integrations/supabase/client` → `@/lib/supabase/client`
   - Auth: `useAuth()` → `useAuthStore()` from Valtio

4. **Handle server/client components**:
   - Add `'use client'` if using hooks, event handlers, or browser APIs
   - Use server components for data fetching where possible

5. **Create SCSS module if needed**:
   ```bash
   touch src/app/[route-name]/page.module.scss
   ```

---

## 🔄 Component Mapping: shadcn/ui → Material-UI

| shadcn/ui | Material-UI | Notes |
|-----------|-------------|-------|
| Button | Button | Similar API |
| Card | Card | Use CardContent, CardHeader |
| Input | TextField | `variant="outlined"` |
| Label | FormLabel | Use with FormControl |
| Select | Select or Autocomplete | MUI Select for simple, Autocomplete for complex |
| Dialog | Dialog | Use DialogTitle, DialogContent, DialogActions |
| Sheet | Drawer | Side panel |
| Tabs | Tabs | Use Tabs + Tab |
| Checkbox | Checkbox | Use with FormControlLabel |
| Switch | Switch | Toggle switch |
| Slider | Slider | Range input |
| Progress | LinearProgress or CircularProgress | |
| Separator | Divider | Horizontal/vertical line |
| Tooltip | Tooltip | Hover info |
| Accordion | Accordion | Expandable sections |
| Skeleton | Skeleton | Loading placeholder |

---

## 🎨 Styling Approach

### Tailwind → SCSS + MUI

**Before (Tailwind)**:
```tsx
<div className="min-h-screen bg-background">
  <div className="container mx-auto px-4 py-20">
    <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-hero">
      Title
    </h1>
  </div>
</div>
```

**After (MUI + SCSS/sx)**:
```tsx
<Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
  <Container maxWidth="xl" sx={{ py: 10 }}>
    <Typography
      variant="h1"
      sx={{
        fontSize: '2.5rem',
        fontWeight: 700,
        mb: 3,
        background: 'linear-gradient(135deg, hsl(142, 76%, 36%), hsl(142, 76%, 56%))',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      Title
    </Typography>
  </Container>
</Box>
```

---

## 🔧 Required Dependencies

Already installed in this project:
- ✅ `@mui/material`
- ✅ `@mui/icons-material`
- ✅ `@emotion/react`, `@emotion/styled`
- ✅ `@supabase/supabase-js`, `@supabase/ssr`
- ✅ `valtio`
- ✅ `next-mdx-remote` (for Privacy/Terms pages)

---

## 📦 Assets to Copy

From Lovable project (`/tmp/lovable-code/rules-referee-rhythm-main/`):

1. **Images**: Copy `src/assets/` → `public/assets/`
   ```bash
   cp -r /tmp/lovable-code/rules-referee-rhythm-main/src/assets/* /home/user/referee-quiz-web/public/assets/
   ```

2. **Admin Components**: Copy and adapt:
   - `src/components/admin/` → Convert to MUI

---

## ⚠️ Breaking Changes & Gotchas

### 1. React Router → Next.js Router
- `<Link to="/path">` → `<Link href="/path">`
- `useNavigate()` → `useRouter()` + `router.push('/path')`
- `useParams()` → Next.js `params` prop in page components

### 2. Auth Context → Valtio
- `const { user, signOut } = useAuth()` → `const { user } = useAuthStore()` + `import { signOut } from '@/valtio/auth'`

### 3. Supabase Client
- Client components: `import { supabase } from '@/lib/supabase/client'`
- Server components: `const supabase = await createClient()` from `@/lib/supabase/server'`

### 4. Form Libraries
- Lovable uses React Hook Form + Zod → Keep same approach in Next.js
- Forms need `'use client'` directive

---

## 🚀 Next Steps

1. **Copy assets**:
   ```bash
   cp -r /tmp/lovable-code/rules-referee-rhythm-main/src/assets/* /home/user/referee-quiz-web/public/assets/
   ```

2. **Migrate pages one by one** (recommended order):
   - Start with simplest: Privacy, Terms (MDX)
   - Then: Index (home page)
   - Auth page
   - Quiz pages (listing, custom, active, review)
   - Profile pages
   - Admin pages (last, as they're most complex)

3. **Test each page** after migration:
   ```bash
   yarn dev
   ```

4. **Create server actions** for data mutations (if needed):
   - Create `src/actions/quiz.actions.ts`, etc.

---

## 📚 Resources

- [Material-UI Components](https://mui.com/material-ui/all-components/)
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Valtio State Management](https://github.com/pmndrs/valtio)
- [Supabase Next.js Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)

---

## 🎯 Final Checklist Before Launch

- [ ] All pages migrated
- [ ] Environment variables configured
- [ ] Assets copied
- [ ] Build succeeds (`yarn build`)
- [ ] No TypeScript errors
- [ ] Auth flow works (signup, signin, signout)
- [ ] Quiz flow works (start quiz, answer questions, view results)
- [ ] Admin pages work (user management, question management)
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] Dark mode works correctly

---

**Last Updated**: 2025-11-16
**Migration Progress**: ~55% (Infrastructure + 5 pages complete, 9 complex pages pending)
