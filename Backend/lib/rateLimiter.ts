type Entry = { timestamps: number[] };

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;

const store = new Map<string, Entry>();

export function isRateLimited(key: string) {
  const now = Date.now();
  const entry = store.get(key) ?? { timestamps: [] };

  entry.timestamps = entry.timestamps.filter((t) => t > now - WINDOW_MS);
  if (entry.timestamps.length >= MAX_REQUESTS) {
    store.set(key, entry);
    return true;
  }
  entry.timestamps.push(now);
  store.set(key, entry);
  return false;
}

export function resetRateLimit() {
  store.clear();
}
