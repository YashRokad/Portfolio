import { useEffect, useRef } from 'react';
import { gsap, DUR } from '../../animations/gsapConfig';
import { useMotion } from '../../hooks/useMotionPreference';
import s from './Cursor.module.css';

/**
 * Tiny dot cursor. Follows via gsap.quickTo (no per-frame tween
 * allocation) and is completely inert on touch / reduced-motion.
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const { reduced, touch } = useMotion();

  useEffect(() => {
    if (touch || reduced) {
      document.documentElement.removeAttribute('data-cursor');
      return undefined;
    }
    document.documentElement.dataset.cursor = 'custom';

    const ctx = gsap.context(() => {
      const dot = dotRef.current;

      const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
      const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });

      let visible = false;
      const show = () => {
        if (visible) return;
        visible = true;
        gsap.to(dot, { autoAlpha: 1, duration: DUR.micro });
      };
      const hide = () => {
        visible = false;
        gsap.to(dot, { autoAlpha: 0, duration: DUR.micro });
      };

      const onMove = (e) => {
        show();
        dotX(e.clientX); dotY(e.clientY);
      };

      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('mouseleave', hide);

      return () => {
        window.removeEventListener('pointermove', onMove);
        document.removeEventListener('mouseleave', hide);
      };
    });

    return () => {
      ctx.revert();
      document.documentElement.removeAttribute('data-cursor');
    };
  }, [touch, reduced]);

  if (touch || reduced) return null;

  return (
    <div className={s.root} aria-hidden="true">
      <div ref={dotRef} className={s.dot} />
    </div>
  );
}
