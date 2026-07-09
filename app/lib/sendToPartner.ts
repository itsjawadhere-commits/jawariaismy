/**
 * Reliable "send" helper — saves messages directly into the `messages`
 * table in Supabase, rather than relaying them through an email service.
 *
 * History: this used to POST to FormSubmit.co, then to Web3Forms, hoping an
 * email-relay service would reliably forward the message. Both approaches
 * put a third-party mail relay in the critical path — if that service has a
 * bad day, the message is at risk. Writing straight to a database this app
 * owns removes that dependency entirely: there's no email step that can
 * fail, so nothing is ever lost because of a third-party outage.
 *
 * Reliability layer kept from before, since any network call can still have
 * a bad moment (a dropped mobile connection, etc.):
 *  - A hard timeout so a request never hangs forever.
 *  - A couple of automatic retries with a short backoff before giving up.
 *  - Fails soft: callers should save the message locally (or leave it in the
 *    input) BEFORE calling this, so nothing is ever lost even if every
 *    attempt fails — the person can always retry later.
 */

import { getSupabaseBrowserClient } from './supabaseClient';

type SendFields = {
  source: 'unsaid' | 'journal';
  type?: string;
  message: string;
};

async function attemptSend(fields: SendFields, timeoutMs: number): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const supabase = getSupabaseBrowserClient();

    const { error } = await supabase
      .from('messages')
      .insert(
        {
          source: fields.source,
          tag: fields.type ?? null,
          message: fields.message,
        },
        { count: 'exact' }
      )
      .abortSignal(controller.signal);

    return !error;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Saves a message to the shared inbox. Retries a couple of times on failure
 * (e.g. a dropped mobile connection) before reporting failure to the caller.
 */
export async function sendToPartner(
  fields: SendFields,
  options?: { timeoutMs?: number; retries?: number }
): Promise<boolean> {
  const timeoutMs = options?.timeoutMs ?? 12000;
  const retries = options?.retries ?? 2;

  // If the browser already knows it's offline, don't bother trying —
  // fail fast so the UI can tell the user right away instead of spinning.
  if (typeof navigator !== 'undefined' && 'onLine' in navigator && !navigator.onLine) {
    return false;
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    const ok = await attemptSend(fields, timeoutMs);
    if (ok) return true;
    if (attempt < retries) await delay(800 * (attempt + 1));
  }

  return false;
}
