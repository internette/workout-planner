'use client';

import { useEffect } from 'react';
import { applyLook, savedAccent, savedTheme } from '@/components/planner/theme';

// The design system site shows the light pink theme whatever the app is set to. Arriving from the app in dark, it
// switches the page back to light, and hands the saved theme back on the way out.
export function StayLight() {
  useEffect(() => {
    applyLook('light', 'pink');
    return () => applyLook(savedTheme(), savedAccent());
  }, []);
  return null;
}
