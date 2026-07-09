import { createClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client. Uses the SERVICE ROLE key, which bypasses
 * Row Level Security entirely — this is intentional and safe *only* because
 * this file is never imported by client components, only by server-side
 * Route Handlers (see app/api/inbox/route.ts). The service role key must
 * NEVER be prefixed with NEXT_PUBLIC_ and must never be sent to the browser.
 */
export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.'
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
