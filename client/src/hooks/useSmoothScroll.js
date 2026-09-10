import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../animations/gsapConfig';
import { useMotion } from './useMotionPreference';

let lenisInstance = null;
export const getLenis = () => lenisInstance;

/**
 * Boots Lenis and drives it from GSAP's ticker so ScrollTrigger and the
 * smooth scroller never disagree about scroll position. Reduced-motion users
 * get the browser's native scroll instead.
 */
export function useSmoothScroll() {
  const { reduced } = useMotion();

  useEffect(() => {
    if (reduced) {
      ScrollTrigger.refresh();
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    lenisInstance = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisInstance = null;
    };
  }, [reduced]);
}

export function scrollToTop(immediate = true) {
  if (lenisInstance) lenisInstance.scrollTo(0, { immediate });
  else window.scrollTo(0, 0);
}

export function scrollToEl(target, offset = -96) {
  if (lenisInstance) lenisInstance.scrollTo(target, { offset, duration: 1.1 });
  else target?.scrollIntoView?.({ behavior: 'smooth' });
}
