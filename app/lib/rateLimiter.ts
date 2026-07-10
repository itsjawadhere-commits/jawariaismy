/**
 * Minimal in-memory rate limiter for the /api/inbox passcode check.
 *
 * This is intentionally simple rather than backed by Redis/Upstash: the
 * site has one real visitor (Jawaria) and the goal is just to stop a
 * script from hammering the passcode endpoint, not to survive a
 * distributed attack. A Map in module scope persists for the lifetime of
 * a given server instance/lambda container, which is enough to slow down
 * or fully block naive brute-forcing.
 *
 * Caveat worth knowing: on serverless platforms (Vercel, etc.) each cold
 * start gets a fresh Map, and traffic can be spread across multiple warm
 * instances, so this isn't a hard global guarantee. For this use case
 * (a private, unlisted page) that tradeoff is fine. If this ever needs to
 * be bulletproof, swap this for Upstash Redis or Vercel's KV-backed rate
 * limiting — the interface below would stay the same.
 */

type Attempt = {
  count: number;
  firstAttemptAt: number;
  lockedUntil: number | null;
};

const attempts = new Map<string, Attempt>();

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5; // failed attempts allowed within the window
const LOCKOUT_MS = 5 * 60 * 1000; // lockout duration once exceeded

/**
 * Call before checking the passcode. Returns how long (ms) the caller must
 * wait if currently locked out, or null if the request is allowed to proceed.
 */
export function checkRateLimit(key: string): number | null {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record) return null;

  if (record.lockedUntil && now < record.lockedUntil) {
    return record.lockedUntil - now;
  }

  // Lockout expired (or was never set) — reset if the window has also elapsed.
  if (now - record.firstAttemptAt > WINDOW_MS) {
    attempts.delete(key);
    return null;
  }

  return null;
}

/** Call after a failed passcode attempt. */
export function recordFailedAttempt(key: string): void {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || now - record.firstAttemptAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAttemptAt: now, lockedUntil: null });
    return;
  }

  const count = record.count + 1;
  const lockedUntil = count >= MAX_ATTEMPTS ? now + LOCKOUT_MS : null;
  attempts.set(key, { count, firstAttemptAt: record.firstAttemptAt, lockedUntil });
}

/** Call after a successful passcode attempt to clear any history for this key. */
export function clearAttempts(key: string): void {
  attempts.delete(key);
}

/** Best-effort client identifier from request headers (works behind Vercel/most proxies). */
export function getClientKey(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp;
  return 'unknown';
}
