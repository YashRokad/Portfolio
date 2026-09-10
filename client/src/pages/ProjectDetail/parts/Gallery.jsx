import { useLayoutEffect, useRef } from 'react';
import { gsap, Draggable, InertiaPlugin, DUR, EASE, revealTrigger } from '../../../animations/gsapConfig';
import { useMotion } from '../../../hooks/useMotionPreference';
import s from './Gallery.module.css';

/**
 * Section 10 — Visual Design gallery. Inertia-based drag on pointer devices,
 * native scroll-snap everywhere else, so the same markup works without the
 * drag layer when it is not appropriate.
 */
export default function Gallery({ gallery = [], title, accent }) {
  const root = useRef(null);
  const trackRef = useRef(null);
  const { reduced, touch } = useMotion();

  useLayoutEffect(() => {
    if (!gallery.length) return undefined;

    const ctx = gsap.context((self) => {
      const items = self.selector(`.${s.item}`);
      gsap.fromTo(items,
        reduced ? { autoAlpha: 0 } : { x: 60, autoAlpha: 0 },
        {
          x: 0, autoAlpha: 1,
          duration: reduced ? 0.4 : DUR.slow,
          ease: EASE.editorial,
          stagger: 0.08,
          scrollTrigger: revealTrigger(root.current),
        });

      if (reduced || touch) return;

      const track = trackRef.current;
      const bounds = () => ({
        minX: -(track.scrollWidth - track.parentElement.offsetWidth),
        maxX: 0,
      });

      const [drag] = Draggable.create(track, {
        type: 'x',
        bounds: bounds(),
        inertia: true,
        edgeResistance: 0.82,
        dragResistance: 0.06,
        cursor: 'none',
        onPress() { gsap.to(items, { scale: 0.98, duration: DUR.micro }); },
        onRelease() { gsap.to(items, { scale: 1, duration: DUR.quick, ease: EASE.snap }); },
      });

      const onResize = () => drag.applyBounds(bounds());
      window.addEventListener('resize', onResize);
      return () => { window.removeEventListener('resize', onResize); drag.kill(); };
    }, root);

    return () => ctx.revert();
  }, [gallery, reduced, touch]);

  if (!gallery.length) return null;

  return (
    <div ref={root} className={s.root} style={{ '--p-accent': accent }}>
      <div className={s.viewport} data-drag={!reduced && !touch ? '' : undefined}>
        <ul
          ref={trackRef}
          className={s.track}
          data-cursor="drag"
          data-cursor-label="Drag"
          aria-label={`${title} — interface gallery`}
        >
          {gallery.map((shot) => (
            <li key={shot.src} className={s.item}>
              <figure className={s.figure}>
                <img className={s.img} src={shot.src} alt={shot.caption} draggable="false" loading="lazy" />
                <figcaption className={s.caption}>{shot.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
      <p className={`meta ${s.hint}`}>
        {touch ? 'Swipe to browse the gallery.' : 'Drag to browse the gallery.'}
      </p>
    </div>
  );
}
