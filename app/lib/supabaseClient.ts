import { createClient } from '@supabase/supabase-js';

/**
 * Browser-side Supabase client, using the public "anon" key.
 *
 * This key is meant to be public and ships in the JS bundle — that's normal
 * Supabase design, not a leak. It's made safe by Row Level Security policies
 * on the `messages` table that only allow INSERT for this key, never SELECT/
 * UPDATE/DELETE. So even if someone reads this key out of the site's source,
 * the most they could do is write more messages — they could never read
 * existing ones back out. Reading only happens server-side via the separate
 * service role key (see app/lib/supabaseServer.ts), gated by the inbox
 * passcode.
 */
export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
    );
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}
