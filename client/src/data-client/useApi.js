import { useEffect, useState, useRef } from 'react';

/**
 * Minimal request hook with an in-memory cache, so returning to a page
 * during a session does not re-flash a loading state.
 */
const cache = new Map();

export function useResource(key, loader) {
  const [state, setState] = useState(() => ({
    data: cache.get(key) ?? null,
    error: null,
    loading: !cache.has(key),
  }));
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  useEffect(() => {
    let alive = true;
    if (cache.has(key)) {
      setState({ data: cache.get(key), error: null, loading: false });
      return () => { alive = false; };
    }
    setState({ data: null, error: null, loading: true });
    loaderRef.current()
      .then((data) => {
        cache.set(key, data);
        if (alive) setState({ data, error: null, loading: false });
      })
      .catch((error) => alive && setState({ data: null, error, loading: false }));
    return () => { alive = false; };
  }, [key]);

  return state;
}

export const clearResourceCache = () => cache.clear();
