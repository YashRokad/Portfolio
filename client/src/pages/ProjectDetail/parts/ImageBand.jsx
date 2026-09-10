import { useLayoutEffect, useRef } from 'react';
import { gsap, EASE, revealTrigger } from '../../../animations/gsapConfig';
import { useMotion } from '../../../hooks/useMotionPreference';
import s from './ImageBand.module.css';

/**
 * A full-bleed image between chapters — the thing that stops the page reading
 * as one long article. Renders nothing when the content has no image for that
 * slot, so a case study with fewer visuals simply has fewer bands.
 */
export default function ImageBand({ src, caption, height = 'tall', accent }) {
  const root = useRef(null);
  const imgRef = useRef(null);
  const { reduced } = useMotion();

  useLayoutEffect(() => {
    if (!src) return undefined;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.fromTo(imgRef.current, { autoAlpha: 0 }, {
          autoAlpha: 1, duration: 0.45, scrollTrigger: revealTrigger(root.current),
        });
        return;
      }
      gsap.fromTo(root.current,
        { clipPath: 'inset(12% 6% 12% 6% round 18px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 0px)',
          duration: 1.2, ease: EASE.curtain,
          scrollTrigger: revealTrigger(root.current, { start: 'top 82%' }),
        });
      gsap.fromTo(imgRef.current,
        { yPercent: -8, scale: 1.12 },
        {
          yPercent: 8, scale: 1.12, ease: 'none',
          scrollTrigger: {
            trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.7,
          },
        });
    }, root);
    return () => ctx.revert();
  }, [src, reduced]);

  if (!src) return null;

  return (
    <figure ref={root} className={s.root} data-height={height} style={{ '--p-accent': accent }}>
      <img ref={imgRef} className={s.img} src={src} alt={caption || ''} loading="lazy" />
      {caption && (
        <figcaption className={s.caption}>
          <span className={s.dot} aria-hidden="true" />
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
