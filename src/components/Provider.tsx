'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { ReactNode } from 'react';

interface ProviderProps {
  children: ReactNode;
}

const Provider = ({ children }: ProviderProps) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default Provider;
