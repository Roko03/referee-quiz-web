// Supabase client for client-side usage in Next.js
import { createBrowserClient } from '@supabase/ssr';

import type { Database } from './types';

// Import the supabase client like this:
// import { supabase } from "@/lib/supabase/client";

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

// Default client instance for client components
export const supabase = createClient();