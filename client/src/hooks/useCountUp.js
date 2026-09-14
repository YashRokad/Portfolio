import { useLayoutEffect, useRef } from 'react';

/** Renders a metric's final value directly, no count-up animation. */
export function useCountUp(value, { prefix = '', suffix = '', decimals = 0 } = {}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.textContent = `${prefix}${Number(value).toFixed(decimals)}${suffix}`;
  }, [value, prefix, suffix, decimals]);

  return ref;
}
