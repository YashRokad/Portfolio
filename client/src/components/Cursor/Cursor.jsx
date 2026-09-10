import { useEffect, useRef } from 'react';
import { gsap, DUR, EASE } from '../../animations/gsapConfig';
import { useMotion } from '../../hooks/useMotionPreference';
import s from './Cursor.module.css';

/**
 * Dot + lagging ring cursor. Follows via gsap.quickTo (no per-frame tween
 * allocation), expands with a contextual label on elements carrying
 * data-cursor, and is completely inert on touch / reduced-motion.
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const { reduced, touch } = useMotion();

  useEffect(() => {
    if (touch || reduced) {
      document.documentElement.removeAttribute('data-cursor');
      return undefined;
    }
    document.documentElement.dataset.cursor = 'custom';

    const ctx = gsap.context(() => {
      const dot = dotRef.current;
      const ring = ringRef.current;
      const label = labelRef.current;

      const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
      const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });
      const ringX = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' });
      const ringY = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' });

      let visible = false;
      const show = () => {
        if (visible) return;
        visible = true;
        gsap.to([dot, ring], { autoAlpha: 1, duration: DUR.micro });
      };
      const hide = () => {
        visible = false;
        gsap.to([dot, ring], { autoAlpha: 0, duration: DUR.micro });
      };

      const onMove = (e) => {
        show();
        dotX(e.clientX); dotY(e.clientY);
        ringX(e.clientX); ringY(e.clientY);
      };

      const setState = (mode, text) => {
        label.textContent = text || '';
        gsap.to(ring, {
          scale: mode === 'idle' ? 1 : 2.6,
          borderColor: mode === 'idle'
            ? 'rgba(236,235,231,0.5)'
            : 'rgba(236,235,231,0.95)',
          backgroundColor: mode === 'idle'
            ? 'rgba(236,235,231,0)'
            : 'rgba(236,235,231,0.14)',
          duration: DUR.quick,
          ease: EASE.snap,
        });
        gsap.to(dot, { scale: mode === 'idle' ? 1 : 0, duration: DUR.micro });
        gsap.to(label, { autoAlpha: mode === 'idle' ? 0 : 1, duration: DUR.micro });
      };

      const onOver = (e) => {
        const hit = e.target.closest('[data-cursor]');
        if (hit) {
          const mode = hit.dataset.cursor || 'view';
          setState(mode, hit.dataset.cursorLabel || defaultLabel(mode));
        } else if (e.target.closest('a, button, input, textarea, [role="button"]')) {
          setState('link', '');
        } else {
          setState('idle', '');
        }
      };

      const onDown = () => gsap.to(ringRef.current, { scale: 0.8, duration: DUR.micro });
      const onUp = () => gsap.to(ringRef.current, { scale: 1, duration: DUR.micro });

      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerover', onOver, { passive: true });
      window.addEventListener('pointerdown', onDown);
      window.addEventListener('pointerup', onUp);
      document.addEventListener('mouseleave', hide);

      return () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerover', onOver);
        window.removeEventListener('pointerdown', onDown);
        window.removeEventListener('pointerup', onUp);
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
      <div ref={ringRef} className={s.ring}>
        <span ref={labelRef} className={s.label} />
      </div>
      <div ref={dotRef} className={s.dot} />
    </div>
  );
}

function defaultLabel(mode) {
  return { view: 'View', read: 'Read', drag: 'Drag', play: 'Play', copy: 'Copy' }[mode] || '';
}
