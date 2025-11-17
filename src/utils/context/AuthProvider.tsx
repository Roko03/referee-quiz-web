'use client';

import React, { useEffect } from 'react';

import { initializeAuth } from '@/valtio/auth';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  useEffect(() => {
    const cleanup = initializeAuth();

    return cleanup;
  }, []);

  return children;
};

export default AuthProvider;
