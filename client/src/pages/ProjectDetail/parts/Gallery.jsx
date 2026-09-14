import { useLayoutEffect, useRef } from 'react';
import { gsap, DUR, EASE, revealTrigger } from '../../../animations/gsapConfig';
import { useMotion } from '../../../hooks/useMotionPreference';
import s from './Gallery.module.css';

/**
 * Section 10 — Visual Design gallery. A plain grid: every mockup is visible
 * on the page rather than hidden behind a horizontal scroll.
 */
export default function Gallery({ gallery = [], title, accent }) {
  const root = useRef(null);
  const { reduced } = useMotion();

  useLayoutEffect(() => {
    if (!gallery.length) return undefined;

    const ctx = gsap.context((self) => {
      const items = self.selector(`.${s.item}`);
      gsap.fromTo(items,
        reduced ? { autoAlpha: 0 } : { y: 40, autoAlpha: 0 },
        {
          y: 0, autoAlpha: 1,
          duration: reduced ? 0.4 : DUR.slow,
          ease: EASE.editorial,
          stagger: 0.08,
          scrollTrigger: revealTrigger(root.current),
        });
    }, root);

    return () => ctx.revert();
  }, [gallery, reduced]);

  if (!gallery.length) return null;

  return (
    <div ref={root} className={s.root} style={{ '--p-accent': accent }}>
      <ul className={s.grid} aria-label={`${title} — interface gallery`}>
        {gallery.map((shot) => (
          <li key={shot.src} className={s.item}>
            <figure className={s.figure}>
              <img className={s.img} src={shot.src} alt={shot.caption ?? ''} loading="lazy" />
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}
