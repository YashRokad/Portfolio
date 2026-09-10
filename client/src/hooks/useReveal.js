import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, DUR, EASE, STAGGER, revealTrigger } from '../animations/gsapConfig';
import { splitText } from '../animations/splitText';
import { useMotion } from './useMotionPreference';

/**
 * Scroll-reveal for a scope. Children marked [data-reveal] rise, scale and
 * unmask together; reduced-motion users get a plain cross-fade instead.
 * Everything lives in a gsap.context() and is reverted on unmount.
 */
export function useReveal({ selector = '[data-reveal]', stagger = STAGGER.list, y = 48, deps = [] } = {}) {
  const scope = useRef(null);
  const { reduced } = useMotion();

  useLayoutEffect(() => {
    // The scope can be empty on a first paint that is still loading data;
    // the deps re-run this once the markup is actually mounted.
    if (!scope.current) return undefined;

    const ctx = gsap.context((self) => {
      const targets = self.selector(selector);
      if (!targets.length) return;

      if (reduced) {
        gsap.fromTo(targets, { autoAlpha: 0 }, {
          autoAlpha: 1, duration: 0.4, stagger: 0.04,
          scrollTrigger: revealTrigger(scope.current),
        });
        return;
      }

      gsap.fromTo(targets,
        { yPercent: 0, y, autoAlpha: 0, scale: 0.985, filter: 'blur(6px)' },
        {
          y: 0, autoAlpha: 1, scale: 1, filter: 'blur(0px)',
          duration: DUR.slow, ease: EASE.editorial, stagger,
          scrollTrigger: revealTrigger(scope.current),
        }
      );
    }, scope);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, ...deps]);

  return scope;
}

/** Reveal a headline by masked line + char stagger. */
export function useHeadlineReveal(ref, { chars = true, delay = 0, trigger = true, play = true } = {}) {
  const { reduced } = useMotion();

  useLayoutEffect(() => {
    if (!ref.current || !play) return undefined;
    let split;
    const ctx = gsap.context(() => {
      split = splitText(ref.current, { chars });
      const targets = chars ? split.chars : split.words;
      if (reduced) {
        gsap.fromTo(ref.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, delay });
        return;
      }
      gsap.set(ref.current, { autoAlpha: 1 });
      gsap.fromTo(targets,
        { yPercent: 118, rotate: 4, autoAlpha: 0 },
        {
          yPercent: 0, rotate: 0, autoAlpha: 1,
          duration: DUR.hero, ease: EASE.editorial,
          stagger: chars ? STAGGER.chars : STAGGER.tight,
          delay,
          scrollTrigger: trigger ? revealTrigger(ref.current, { start: 'top 88%' }) : undefined,
        }
      );
    }, ref);

    return () => { ctx.revert(); split?.revert?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, play]);
}

export { ScrollTrigger };
