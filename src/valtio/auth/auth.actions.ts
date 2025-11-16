'use client';

import { supabase } from '@/lib/supabase/client';
import { authStore } from './auth.store';

export const initializeAuth = () => {
  // Get initial session
  supabase.auth.getSession().then(({ data: { session } }) => {
    authStore.session = session;
    authStore.user = session?.user ?? null;
    authStore.loading = false;
  });

  // Listen to auth changes
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    authStore.session = session;
    authStore.user = session?.user ?? null;
    authStore.loading = false;
  });

  return () => subscription.unsubscribe();
};

export const signUp = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  username: string,
) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: {
        first_name: firstName,
        last_name: lastName,
        username,
        user_agent: 'credentials',
      },
    },
  });

  return { error };
};

export const signIn = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { error };
};

export const signInWithGoogle = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
      queryParams: {
        user_agent: 'google',
      },
    },
  });
};

export const signOut = async () => {
  await supabase.auth.signOut();
};
