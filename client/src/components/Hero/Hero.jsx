import { useLayoutEffect, useRef } from 'react';
import { gsap, DUR, EASE, STAGGER } from '../../animations/gsapConfig';
import { splitText } from '../../animations/splitText';
import { useMotion } from '../../hooks/useMotionPreference';
import { scrollToEl } from '../../hooks/useSmoothScroll';
import s from './Hero.module.css';

/**
 * Home hero: masked char-stagger headline over a slow ambient mesh, plus a
 * scroll cue that keeps drawing itself until the visitor scrolls.
 */
export default function Hero({ headline, sub, role, location, play = true, scrollTargetId = 'selected-work' }) {
  const root = useRef(null);
  const headlineRef = useRef(null);
  const { reduced } = useMotion();

  useLayoutEffect(() => {
    if (!play) return undefined;
    let split;

    const ctx = gsap.context((self) => {
      const meta = self.selector('[data-hero-meta]');
      const subEls = self.selector(`.${s.sub}`);
      const cue = self.selector(`.${s.cue}`);
      const blobs = self.selector(`.${s.blob}`);

      if (reduced) {
        gsap.set(headlineRef.current, { visibility: 'visible' });
        gsap.fromTo([headlineRef.current, ...subEls, ...meta, ...cue],
          { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, stagger: 0.06 });
        return;
      }

      split = splitText(headlineRef.current, { chars: true });
      gsap.set(headlineRef.current, { visibility: 'visible' });

      const tl = gsap.timeline({ delay: 0.12 });
      tl.fromTo(split.chars,
        { yPercent: 118, rotate: 6, autoAlpha: 0 },
        {
          yPercent: 0, rotate: 0, autoAlpha: 1,
          duration: DUR.hero, ease: EASE.editorial, stagger: STAGGER.chars,
        })
        .fromTo(meta, { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: DUR.standard, stagger: 0.08 }, '-=0.9')
        .fromTo(subEls, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: DUR.slow }, '-=0.7')
        .fromTo(cue, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: DUR.standard }, '-=0.55');

      /* Ambient drift — slow, looping, never in a hurry. */
      blobs.forEach((blob, i) => {
        gsap.to(blob, {
          xPercent: gsap.utils.random(-18, 18),
          yPercent: gsap.utils.random(-16, 16),
          scale: gsap.utils.random(0.9, 1.2),
          duration: gsap.utils.random(14, 22),
          ease: EASE.drift,
          repeat: -1,
          yoyo: true,
          delay: i * 1.4,
        });
      });

      gsap.to(cue, { y: 10, duration: 1.1, ease: EASE.drift, repeat: -1, yoyo: true, delay: 1.6 });
    }, root);

    return () => { ctx.revert(); split?.revert?.(); };
  }, [reduced, play, headline]);

  return (
    <section ref={root} className={s.root}>
      <div className={s.mesh} aria-hidden="true">
        <span className={s.blob} data-blob="1" />
        <span className={s.blob} data-blob="2" />
        <span className={s.blob} data-blob="3" />
      </div>

      <div className={`shell ${s.inner}`}>
        <div className={s.metaRow}>
          <p className="eyebrow" data-hero-meta>{role}</p>
          <p className="meta" data-hero-meta>{location}</p>
        </div>

        <h1 ref={headlineRef} className={`display ${s.headline}`}>{headline}</h1>

        <div className={s.bottom}>
          <p className={s.sub}>{sub}</p>
          <button
            type="button"
            className={s.cue}
            onClick={() => scrollToEl(document.getElementById(scrollTargetId))}
          >
            <span className={s.cueLine} aria-hidden="true" />
            Selected work
          </button>
        </div>
      </div>
    </section>
  );
}
