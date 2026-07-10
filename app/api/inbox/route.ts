import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '../../lib/supabaseServer';
import { checkRateLimit, recordFailedAttempt, clearAttempts, getClientKey } from '../../lib/rateLimiter';

// This route only ever runs on the server. It's the sole place in the app
// that can read messages back out — the browser-side Supabase key can only
// insert, never select (enforced by Row Level Security), so even a fully
// inspected client bundle gives no way to read anyone's messages. Reading
// requires knowing the passcode, checked here against a server-only env var.
//
// The passcode check is also rate-limited per client (see lib/rateLimiter.ts)
// so a script can't just hammer this endpoint until it guesses right.
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const clientKey = getClientKey(req);

  const lockedForMs = checkRateLimit(clientKey);
  if (lockedForMs !== null) {
    const retryAfterSeconds = Math.ceil(lockedForMs / 1000);
    return NextResponse.json(
      { error: 'too many attempts — try again later' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
    );
  }

  let body: { passcode?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid request' }, { status: 400 });
  }

  const expected = process.env.INBOX_PASSCODE;
  if (!expected) {
    return NextResponse.json(
      { error: 'inbox is not configured yet — missing INBOX_PASSCODE' },
      { status: 500 }
    );
  }

  if (!body.passcode || body.passcode !== expected) {
    recordFailedAttempt(clientKey);
    // Deliberately generic — don't hint whether the passcode was close.
    return NextResponse.json({ error: 'incorrect passcode' }, { status: 401 });
  }

  clearAttempts(clientKey);

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('messages')
      .select('id, created_at, source, tag, message')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ messages: data ?? [] });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
