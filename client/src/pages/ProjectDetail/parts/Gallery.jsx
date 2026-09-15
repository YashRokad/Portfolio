import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, DUR, EASE, revealTrigger } from '../../../animations/gsapConfig';
import { useMotion } from '../../../hooks/useMotionPreference';
import ShotSheet from '../../../components/ShotSheet/ShotSheet';
import s from './Gallery.module.css';

/**
 * Section 10 — Visual Design gallery. A plain grid: every mockup is visible
 * on the page rather than hidden behind a horizontal scroll. Tapping one
 * opens it full size in the same bottom sheet the design shots use, minus
 * the title block — these screens carry no copy.
 */
export default function Gallery({ gallery = [], title, accent }) {
  const root = useRef(null);
  const { reduced } = useMotion();
  const [active, setActive] = useState(null);

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
    <>
      <div ref={root} className={s.root} style={{ '--p-accent': accent }}>
        <ul className={s.grid} aria-label={`${title} — interface gallery`}>
          {gallery.map((shot) => (
            <li key={shot.src} className={s.item}>
              <button
                type="button"
                className={s.trigger}
                onClick={() => setActive({ image: shot.src })}
                data-cursor="view"
                data-cursor-label="Open"
              >
                <img className={s.img} src={shot.src} alt={shot.caption ?? ''} loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <ShotSheet shot={active} onClose={() => setActive(null)} />
    </>
  );
}
