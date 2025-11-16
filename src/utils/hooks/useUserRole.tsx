'use client';

import { useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/valtio/auth';

export type UserRole = 'admin' | 'manager' | 'user';

export const useUserRole = () => {
  const { user } = useAuthStore();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setRole(null);
        setLoading(false);

        return;
      }

      const { data, error } = await supabase.from('user_roles').select('role').eq('user_id', user.id).single();

      if (!error && data) {
        setRole(data.role as UserRole);
      } else {
        setRole('user');
      }

      setLoading(false);
    };

    fetchRole();
  }, [user]);

  const isAdmin = role === 'admin';
  const isManager = role === 'manager';
  const isUser = role === 'user';

  return { role, isAdmin, isManager, isUser, loading };
};
