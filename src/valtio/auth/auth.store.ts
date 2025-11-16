import { proxy, useSnapshot } from 'valtio';
import type { User, Session } from '@supabase/supabase-js';

interface AuthStore {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export const authStore = proxy<AuthStore>({
  user: null,
  session: null,
  loading: true,
});

export const useAuthStore = () => useSnapshot(authStore);
