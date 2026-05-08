/**
 * In-memory rate limiting and spend cap. Resets on server restart — that's
 * fine for a public demo.
 */

interface Bucket {
  count: number;
  windowStart: number;
}

const RATE_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const RATE_MAX = 10;
const buckets = new Map<string, Bucket>();

export function checkRateLimit(ip: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now - b.windowStart >= RATE_WINDOW_MS) {
    buckets.set(ip, { count: 1, windowStart: now });
    return { ok: true };
  }
  if (b.count >= RATE_MAX) {
    const retryAfter = Math.ceil(
      (b.windowStart + RATE_WINDOW_MS - now) / 1000,
    );
    return { ok: false, retryAfter };
  }
  b.count += 1;
  return { ok: true };
}

// Daily token budget. ~5M tokens at Sonnet 4.6 input pricing ~= $5 worth.
// We track total (input + output) tokens spent today.
const DAILY_TOKEN_LIMIT = 5_000_000;

interface Spend {
  date: string; // YYYY-MM-DD
  tokens: number;
}

let spend: Spend = { date: today(), tokens: 0 };

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function checkBudget(): { ok: boolean; spent: number; limit: number } {
  if (spend.date !== today()) {
    spend = { date: today(), tokens: 0 };
  }
  return {
    ok: spend.tokens < DAILY_TOKEN_LIMIT,
    spent: spend.tokens,
    limit: DAILY_TOKEN_LIMIT,
  };
}

export function recordSpend(tokens: number): void {
  if (spend.date !== today()) {
    spend = { date: today(), tokens: 0 };
  }
  spend.tokens += tokens;
}
