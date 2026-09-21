import { createClient } from '@supabase/supabase-js';
import { AUTH_REQUIRED, getIdToken } from './auth';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error('Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
}

// With sign-in on, every request carries the person's Auth0 ID token, which Supabase verifies (Third-Party Auth)
// and uses for row-level security. Without it, requests use the anon key as before.
export const supabase = createClient(url, key, AUTH_REQUIRED ? { accessToken: getIdToken } : undefined);
