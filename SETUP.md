# Setup Instructions

## ⚠️ Important: Install Dependencies First

The Vercel build is currently failing because the required dependencies are not installed. You must run:

```bash
yarn install
```

Or if you prefer npm:

```bash
npm install
```

## Required Dependencies Added

The following packages have been added to `package.json`:

### Material-UI
- `@mui/material` - Core Material-UI components
- `@mui/icons-material` - Material Design icons
- `@mui/material-nextjs` - Next.js integration for MUI

### Emotion (MUI styling engine)
- `@emotion/react`
- `@emotion/styled`

### Supabase
- `@supabase/ssr` - Server-side rendering support
- `@supabase/supabase-js` - Supabase client

### State Management
- `valtio` - Reactive state management

### MDX Support
- `gray-matter` - Parse frontmatter from MDX files
- `next-mdx-remote` - Render MDX in Next.js

## After Installing Dependencies

1. **Create `.env.local`** file:
   ```bash
   cp .env.local.example .env.local
   ```

2. **Add your Supabase credentials** to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. **Run the development server**:
   ```bash
   yarn dev
   ```

4. **Test the build**:
   ```bash
   yarn build
   ```

5. **Fix any linting errors**:
   ```bash
   yarn lint
   ```

## What's Been Completed

✅ Infrastructure migration (40%)
- Theme system with MUI dark mode
- Supabase client configuration
- Authentication with Valtio
- Layout components (Navigation, Footer)
- Privacy and Terms pages (MDX)

## What's Next

📋 Remaining pages to migrate (60%):
- Home page (Index)
- Auth page (Sign in/Sign up)
- Quiz pages (listing, custom, active, review)
- Profile pages
- Admin pages
- Leaderboard

See `MIGRATION_GUIDE.md` for detailed migration instructions.

## Vercel Deployment

Once dependencies are installed and the build succeeds locally:

1. Push to your repository
2. Vercel will automatically redeploy
3. Ensure environment variables are set in Vercel dashboard

## Getting Help

If you encounter issues:
1. Check `MIGRATION_GUIDE.md` for component mappings
2. Review the infrastructure components in `src/components/`, `src/valtio/`, and `src/lib/`
3. All components follow the patterns specified in `CLAUDE.md`
