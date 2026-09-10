import { useLayoutEffect, useRef } from 'react';
import { gsap, DUR, EASE, revealTrigger } from '../animations/gsapConfig';
import { useMotion } from './useMotionPreference';

const GLYPHS = '0123456789';

/**
 * Counts a number up while scrambling the digits into place, then settles on
 * the final value with its prefix/suffix. Never renders as static text for
 * full-motion users; reduced-motion users simply see the final value.
 */
export function useCountUp(value, { prefix = '', suffix = '', decimals = 0 } = {}) {
  const ref = useRef(null);
  const { reduced } = useMotion();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const final = `${prefix}${Number(value).toFixed(decimals)}${suffix}`;

    if (reduced) { el.textContent = final; return undefined; }

    const ctx = gsap.context(() => {
      const counter = { v: 0 };
      el.textContent = `${prefix}${(0).toFixed(decimals)}${suffix}`;

      gsap.timeline({ scrollTrigger: revealTrigger(el, { start: 'top 88%' }) })
        .to(counter, {
          v: Number(value),
          duration: DUR.hero + 0.4,
          ease: EASE.editorial,
          onUpdate() {
            const p = this.progress();
            const digits = counter.v.toFixed(decimals);
            // Late in the tween the scramble decays and real digits land.
            const scrambled = digits
              .split('')
              .map((ch) => (/\d/.test(ch) && Math.random() > p * 1.35
                ? GLYPHS[Math.floor(Math.random() * 10)]
                : ch))
              .join('');
            el.textContent = `${prefix}${scrambled}${suffix}`;
          },
          onComplete() { el.textContent = final; },
        });
    }, ref);

    return () => ctx.revert();
  }, [value, prefix, suffix, decimals, reduced]);

  return ref;
}
