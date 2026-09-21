'use client';

import type { ReactNode } from 'react';
import { AUTH_REQUIRED } from '@/lib/auth';
import { AuthProvider, useAuth } from './AuthProvider';
import { LandingPage } from './LandingPage';

const centered: React.CSSProperties = {
  minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: 'var(--color-muted)', fontSize: 'var(--text-base)',
};

function Gate({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  if (status === 'loading') return <div style={centered} role="status">Loading…</div>;
  if (status === 'signedOut') return <LandingPage />;
  return <>{children}</>;
}

/**
 * The planner's front door. When sign-in is required, a signed-out visitor sees the landing page and a signed-in one
 * goes straight to the planner. When it is not, the planner opens as before. This decides what to show; the data
 * itself is protected by row-level security in the database.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  if (!AUTH_REQUIRED) return <>{children}</>;
  return (
    <AuthProvider>
      <Gate>{children}</Gate>
    </AuthProvider>
  );
}
