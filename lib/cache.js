export function createCache(defaultTTL = 5 * 60 * 1000) {
  const store = new Map();

  function get(key) {
    const entry = store.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > entry.ttl) {
      store.delete(key);
      return null;
    }
    return entry.value;
  }

  function set(key, value, ttl) {
    store.set(key, { value, timestamp: Date.now(), ttl: ttl ?? defaultTTL });
  }

  function invalidate(key) {
    store.delete(key);
  }

  function invalidateAll() {
    store.clear();
  }

  return { get, set, invalidate, invalidateAll };
}
