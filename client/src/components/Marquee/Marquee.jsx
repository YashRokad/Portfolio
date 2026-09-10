import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '../../animations/gsapConfig';
import { useMotion } from '../../hooks/useMotionPreference';
import s from './Marquee.module.css';

/**
 * Seamless infinite marquee.
 *
 * The item list is repeated until the row is comfortably wider than the
 * viewport, then the whole row is translated by exactly one copy's width and
 * looped. Because copy N+1 lands precisely where copy N started, the reset is
 * invisible — there is no seam and no jump, at any item count or viewport.
 */
export default function Marquee({
  items = [], speed = 26, direction = 1, className = '', separator = '—', ariaLabel,
  variant = 'plain',
}) {
  const rootRef = useRef(null);
  const rowRef = useRef(null);
  const copyRef = useRef(null);
  const [copies, setCopies] = useState(2);
  const { reduced } = useMotion();

  /* Measure one copy and repeat until the row covers the viewport twice over. */
  useLayoutEffect(() => {
    if (!items.length) return undefined;
    const measure = () => {
      const width = copyRef.current?.offsetWidth ?? 0;
      if (!width) return;
      setCopies(Math.max(2, Math.ceil((window.innerWidth * 2) / width) + 1));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (copyRef.current) ro.observe(copyRef.current);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, [items]);

  useLayoutEffect(() => {
    if (reduced || !items.length) return undefined;

    const ctx = gsap.context(() => {
      const row = rowRef.current;
      const distance = () => copyRef.current?.offsetWidth ?? 0;
      if (!distance()) return;

      const tween = gsap.fromTo(row,
        { x: direction > 0 ? 0 : -distance() },
        {
          x: direction > 0 ? () => -distance() : 0,
          duration: speed,
          ease: 'none',
          repeat: -1,
        });

      /* Hovering eases the speed down rather than stopping dead. */
      const el = rootRef.current;
      const slow = () => gsap.to(tween, { timeScale: 0.25, duration: 0.5, overwrite: true });
      const normal = () => gsap.to(tween, { timeScale: 1, duration: 0.5, overwrite: true });
      el.addEventListener('pointerenter', slow);
      el.addEventListener('pointerleave', normal);
      return () => {
        el.removeEventListener('pointerenter', slow);
        el.removeEventListener('pointerleave', normal);
      };
    }, rootRef);

    return () => ctx.revert();
  }, [reduced, speed, direction, items, copies]);

  if (!items.length) return null;

  const copy = (key) => (
    <span
      className={s.copy}
      key={key}
      ref={key === 0 ? copyRef : undefined}
      aria-hidden={key === 0 ? undefined : 'true'}
    >
      {items.map((item, i) => (
        <span className={s.item} data-variant={variant} key={`${item}-${i}`}>
          {item}
          {separator && <span className={s.sep} aria-hidden="true">{separator}</span>}
        </span>
      ))}
    </span>
  );

  return (
    <div ref={rootRef} className={`${s.root} ${className}`} aria-label={ariaLabel}>
      <div ref={rowRef} className={s.row}>
        {Array.from({ length: copies }, (_, i) => copy(i))}
      </div>
    </div>
  );
}
