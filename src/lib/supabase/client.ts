// Supabase client for client-side usage in Next.js
import { createBrowserClient } from '@supabase/ssr';

import type { Database } from './types';

// Import the supabase client like this:
// import { supabase } from "@/lib/supabase/client";

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // During build time or if env vars are missing, return a placeholder
  // This prevents build failures when static pages are being generated
  if (!url || !key) {
    // Return a mock client that will be replaced at runtime
    return {} as ReturnType<typeof createBrowserClient<Database>>;
  }

  return createBrowserClient<Database>(url, key);
};

// Lazy client instance - only created when accessed
let clientInstance: ReturnType<typeof createClient> | null = null;

// Getter function that ensures client is only created when needed
export const getSupabaseClient = () => {
  if (!clientInstance) {
    clientInstance = createClient();
  }

  return clientInstance;
};

// Default client instance for client components (lazy initialization)
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    const client = getSupabaseClient();

    return client[prop as keyof typeof client];
  },
});