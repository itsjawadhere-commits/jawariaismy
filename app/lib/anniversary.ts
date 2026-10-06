// Pakistan Standard Time is a fixed UTC+5 (no DST), so every date check here is
// done against Asia/Karachi no matter where the visitor's device is.

export const ANNIVERSARY_MONTH = 10;
export const ANNIVERSARY_DAY = 6;
// Day 0: October 6, 2025, 00:00 PKT  (= Oct 5, 19:00 UTC)
export const START_UTC_MS = Date.UTC(2025, 9, 6, 0, 0, 0) - 5 * 3600 * 1000;

export function getPKTParts(date: Date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Karachi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const get = (t: string) => parseInt(parts.find((p) => p.type === t)!.value, 10);
  return { year: get('year'), month: get('month'), day: get('day') };
}

// Adding ?preview=anniversary to the URL lets you see the anniversary version any day.
export function isPreview(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('preview') === 'anniversary';
}

/** True only on October 6 (Pakistan time). */
export function isAnniversaryDay(date: Date = new Date()): boolean {
  if (isPreview()) return true;
  const p = getPKTParts(date);
  return p.month === ANNIVERSARY_MONTH && p.day === ANNIVERSARY_DAY;
}

/** True from the first anniversary (Oct 6, 2026 PKT) onward, so the letter stays. */
export function isAnniversaryReached(date: Date = new Date()): boolean {
  if (isPreview()) return true;
  return date.getTime() >= START_UTC_MS + 365 * 86400000;
}

/** Whole days since Oct 6, 2025 00:00 PKT. Reaches 365 at midnight PKT on Oct 6, 2026. */
export function daysTogether(now: number = Date.now()): number {
  return Math.max(0, Math.floor((now - START_UTC_MS) / 86400000));
}
