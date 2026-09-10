import { useLayoutEffect, useRef } from 'react';
import { gsap, DUR, EASE } from '../animations/gsapConfig';
import { useMotion } from './useMotionPreference';

/**
 * Pulls an element toward the pointer while it is hovered, and springs it
 * back on exit. Inert on touch and reduced-motion.
 */
export function useMagnetic({ strength = 0.35, scale = 1 } = {}) {
  const ref = useRef(null);
  const { reduced, touch } = useMotion();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced || touch) return undefined;

    const ctx = gsap.context(() => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });

      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const onEnter = () => scale !== 1 && gsap.to(el, { scale, duration: DUR.micro, ease: EASE.snap });
      const onLeave = () => {
        xTo(0); yTo(0);
        if (scale !== 1) gsap.to(el, { scale: 1, duration: DUR.quick, ease: EASE.snap });
      };

      el.addEventListener('pointerenter', onEnter);
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
      return () => {
        el.removeEventListener('pointerenter', onEnter);
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
      };
    }, ref);

    return () => ctx.revert();
  }, [reduced, touch, strength, scale]);

  return ref;
}
