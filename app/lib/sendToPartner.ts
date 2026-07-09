/**
 * Reliable submit helper for FormSubmit.co.
 *
 * Why this exists:
 * The old code POSTed JSON with `Content-Type: application/json`. That content
 * type is NOT on the CORS "simple request" list, so the browser is forced to
 * send an extra OPTIONS preflight request before every submission. Some mobile
 * browsers / in-app webviews (WhatsApp, Instagram, etc.) and flaky mobile data
 * connections handle that preflight poorly, causing sends to silently hang or
 * fail — while the same request works fine on a laptop with a stable wifi
 * connection. There was also no timeout, so a stalled request would spin
 * forever with no feedback to the user.
 *
 * This version:
 *  - Sends `application/x-www-form-urlencoded` data, which IS a CORS-simple
 *    content type, so no preflight is needed. Works consistently across
 *    mobile networks, in-app browsers, and desktop.
 *  - Has a hard timeout (via AbortController) so it never hangs indefinitely.
 *  - Retries automatically a couple of times with a short delay before
 *    giving up, since mobile networks can have transient blips.
 *  - Fails soft: callers are expected to save the message locally (or leave
 *    it in the input) BEFORE calling this, so nothing is ever lost even if
 *    every attempt fails.
 */

const ENDPOINT = 'https://formsubmit.co/ajax/itsjawadhere@gmail.com';

type SendFields = Record<string, string>;

async function attemptSend(fields: SendFields, timeoutMs: number): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const body = new URLSearchParams(fields);

    const res = await fetch(ENDPOINT, {
      method: 'POST',
      // No explicit Content-Type header here — the browser sets
      // "application/x-www-form-urlencoded" automatically for a
      // URLSearchParams body, which keeps this a CORS-simple request
      // (no preflight OPTIONS round-trip required).
      body,
      signal: controller.signal,
    });

    return res.ok;
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
 * Sends fields to the partner inbox. Retries a couple of times on failure
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
