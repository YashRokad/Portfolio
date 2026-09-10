import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, DUR, EASE, STAGGER } from '../../animations/gsapConfig';
import { splitText } from '../../animations/splitText';
import { useMotion } from '../../hooks/useMotionPreference';
import { scrollToEl } from '../../hooks/useSmoothScroll';
import Marquee from '../Marquee/Marquee';
import s from './Hero.module.css';

/**
 * Home hero: a full-bleed image behind an oversized wordmark that sits on the
 * baseline of the viewport, with the standing statement mid-left and a tag
 * marquee along the bottom. The image parallaxes as the page leaves it.
 */
export default function Hero({
  wordmark = '', statement, sub, location, email, image, tags = [],
  play = true, scrollTargetId = 'selected-work',
}) {
  const root = useRef(null);
  const markRef = useRef(null);
  const imageRef = useRef(null);
  const { reduced } = useMotion();

  useLayoutEffect(() => {
    if (!play) return undefined;
    let split;

    const ctx = gsap.context((self) => {
      const meta = self.selector('[data-hero-meta]');
      const statementEl = self.selector(`.${s.statement}`);
      const footer = self.selector('[data-hero-footer]');

      if (reduced) {
        gsap.set(markRef.current, { visibility: 'visible' });
        gsap.fromTo([imageRef.current, markRef.current, ...statementEl, ...meta, ...footer],
          { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, stagger: 0.05 });
        return;
      }

      split = splitText(markRef.current, { chars: true });
      gsap.set(markRef.current, { visibility: 'visible' });

      gsap.timeline({ delay: 0.1 })
        .fromTo(imageRef.current,
          { scale: 1.18, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 1.8, ease: EASE.editorial }, 0)
        .fromTo(meta,
          { y: -18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: DUR.standard, stagger: 0.08 }, 0.25)
        .fromTo(statementEl,
          { y: 30, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: DUR.slow }, 0.4)
        .fromTo(split.chars,
          { yPercent: 116, autoAlpha: 0 },
          {
            yPercent: 0, autoAlpha: 1,
            duration: DUR.hero, ease: EASE.editorial, stagger: STAGGER.chars,
          }, 0.35)
        .fromTo(footer,
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: DUR.standard, stagger: 0.1 }, 1.1);

      /* The image drifts up more slowly than the page, so the wordmark peels
         off it rather than moving with it. */
      gsap.to(imageRef.current, {
        yPercent: 14,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });
    }, root);

    return () => { ctx.revert(); split?.revert?.(); ScrollTrigger.refresh(); };
  }, [reduced, play, wordmark]);

  return (
    <section ref={root} className={s.root}>
      <div className={s.backdrop}>
        <img ref={imageRef} className={s.image} src={image} alt="" />
        <span className={s.scrim} aria-hidden="true" />
      </div>

      <div className={s.inner}>
        <div className={`shell ${s.top}`}>
          <p className={s.locus} data-hero-meta>
            <span className={s.pulse} aria-hidden="true" />
            {location}
          </p>
          <a className={s.email} href={`mailto:${email}`} data-hero-meta>{email}</a>
        </div>

        <div className={`shell ${s.middle}`}>
          <p className={s.statement}>
            <span className={s.glyph} aria-hidden="true" />
            {statement}
          </p>
        </div>

        <div className={s.bottom}>
          <div className="shell">
            <h1 ref={markRef} className={s.wordmark}>{wordmark}</h1>
          </div>

          <div className={`shell ${s.footer}`}>
            <p className={s.sub} data-hero-footer>{sub}</p>
            <div className={s.tagRow} data-hero-footer>
              <button
                type="button"
                className={s.cue}
                onClick={() => scrollToEl(document.getElementById(scrollTargetId))}
              >
                <span className={s.cueDot} aria-hidden="true" />
                Scroll
              </button>
              <Marquee
                className={s.tags}
                items={tags}
                speed={24}
                separator=""
                variant="pill"
                ariaLabel="Areas of practice"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
