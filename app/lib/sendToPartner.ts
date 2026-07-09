/**
 * Reliable submit helper — sends messages to the partner's inbox via
 * Web3Forms (https://web3forms.com).
 *
 * History: this used to POST to FormSubmit.co. That service turned out to be
 * unreliable — requests would hang with no response for 12+ seconds and
 * never resolve, which outage trackers confirmed was a known, recurring
 * problem with FormSubmit itself, not this code. Web3Forms is a more
 * dependable alternative built specifically for this "static site sends
 * straight to an inbox" use case, and its API is designed for JSON fetch
 * calls (no CORS/preflight quirks to work around).
 *
 * This helper still keeps the reliability layer on top, since any network
 * call can have a bad day:
 *  - A hard timeout (via AbortController) so a request never hangs forever.
 *  - A couple of automatic retries with a short backoff before giving up.
 *  - Fails soft: callers should save the message locally (or leave it in the
 *    input) BEFORE calling this, so nothing is ever lost even if every
 *    attempt fails.
 */

const ENDPOINT = 'https://api.web3forms.com/submit';
const ACCESS_KEY = '530eb8db-bfcd-47a8-a5ad-4067b3073ae1';

type SendFields = Record<string, string>;

async function attemptSend(fields: SendFields, timeoutMs: number): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        ...fields,
      }),
      signal: controller.signal,
    });

    if (!res.ok) return false;

    // Web3Forms returns { success: true/false, message: "..." } — trust that
    // field when present rather than just the HTTP status.
    try {
      const data = await res.json();
      return data?.success !== false;
    } catch {
      // Body wasn't JSON for some reason, but the request itself succeeded.
      return true;
    }
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
