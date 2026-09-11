import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, DUR, EASE, STAGGER } from '../../animations/gsapConfig';
import { splitText } from '../../animations/splitText';
import { useMotion } from '../../hooks/useMotionPreference';
import Marquee from '../Marquee/Marquee';
import s from './Hero.module.css';

/* Drift for each mesh bloom: how far it wanders and how long one pass takes.
   Durations are deliberately coprime so the blooms never resynchronise into a
   visible loop. */
const BLOOMS = [
  { key: 'green', x: 5, y: -4, scale: 1.12, time: 19 },
  { key: 'magenta', x: -6, y: 5, scale: 1.08, time: 23 },
  { key: 'ember', x: 7, y: 6, scale: 1.15, time: 27 },
  { key: 'haze', x: 4, y: 7, scale: 1.1, time: 37 },
];

/* Font size the wordmark is measured at. The result is cached as a ratio —
   a pure font metric, since letter-spacing is in em and scales with size — so
   a resize only has to divide, never re-measure. */
const MEASURE_AT = 200;

/**
 * Home hero: a standing statement upper left over a drifting mesh gradient and
 * a faint ruled pattern, with an oversized wordmark running edge to edge along
 * the bottom of the viewport.
 *
 * The mesh is pure CSS — soft radial stops rather than blur filters, so a
 * layer this large stays cheap — and the whole backdrop parallaxes as the page
 * leaves it, letting the wordmark peel off the colour rather than travel with
 * it.
 */
export default function Hero({
  wordmark = '', statement, sub, tags = [], play = true,
}) {
  const root = useRef(null);
  const markRef = useRef(null);
  const meshRef = useRef(null);
  const ratio = useRef(0);
  const { reduced } = useMotion();

  /* Size the wordmark so it runs exactly edge to edge, the way the reference
     does. A CSS clamp cannot do this: the right size depends on how wide this
     particular string renders, not on the viewport alone. */
  useLayoutEffect(() => {
    const el = markRef.current;
    if (!el || !wordmark.trim()) return undefined;

    const pad = () => {
      const cs = getComputedStyle(el);
      return parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    };

    /* Measured off the live element, so the real font, weight and tracking are
       all in play. Only valid while the h1 still holds a plain text node, so
       it runs before splitText touches it. */
    const measure = () => {
      el.style.fontSize = `${MEASURE_AT}px`;
      const range = document.createRange();
      range.selectNodeContents(el);
      const w = range.getBoundingClientRect().width;
      range.detach?.();
      if (w > 0) ratio.current = w / MEASURE_AT;
    };

    const fit = () => {
      if (!ratio.current) return;
      const avail = el.clientWidth - pad();
      if (avail > 0) el.style.fontSize = `${avail / ratio.current}px`;
    };

    measure();
    fit();

    /* Metrics measured against a fallback face are wrong, so redo the ratio
       once Manrope is actually in. */
    document.fonts?.ready.then(() => {
      if (!markRef.current) return;
      const hasSplit = markRef.current.querySelector('.splitLine');
      if (!hasSplit) measure();
      fit();
    }).catch(() => {});

    /* Observe the section, not the h1: fit() changes the h1's own height, and
       observing it would feed that back in as a resize. */
    const ro = new ResizeObserver(fit);
    ro.observe(root.current);
    return () => ro.disconnect();
  }, [wordmark]);

  useLayoutEffect(() => {
    if (!play) return undefined;
    let split;

    const ctx = gsap.context((self) => {
      const statementEl = self.selector(`.${s.statement}`);
      const intro = self.selector('[data-hero-intro]');

      if (reduced) {
        gsap.set(markRef.current, { visibility: 'visible' });
        gsap.fromTo([meshRef.current, markRef.current, ...statementEl, ...intro],
          { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, stagger: 0.05 });
        return;
      }

      split = splitText(markRef.current, { chars: true });
      gsap.set(markRef.current, { visibility: 'visible' });

      gsap.timeline({ delay: 0.1 })
        .fromTo(meshRef.current,
          { scale: 1.14, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 1.9, ease: EASE.editorial }, 0)
        .fromTo(statementEl,
          { y: 30, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: DUR.slow }, 0.4)
        .fromTo(split.chars,
          { yPercent: 116, autoAlpha: 0 },
          {
            yPercent: 0, autoAlpha: 1,
            duration: DUR.hero, ease: EASE.editorial, stagger: STAGGER.chars,
          }, 0.35)
        .fromTo(intro,
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: DUR.standard, stagger: 0.1 }, 1.1);

      /* Each bloom wanders on its own clock, which is what keeps the mesh
         feeling like light rather than a looping texture. */
      BLOOMS.forEach((b) => {
        const el = self.selector(`[data-bloom='${b.key}']`)[0];
        if (!el) return;
        gsap.to(el, {
          xPercent: b.x,
          yPercent: b.y,
          scale: b.scale,
          duration: b.time,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      });

      /* The backdrop drifts up more slowly than the page, so the wordmark
         peels off the colour rather than moving with it. */
      gsap.to(meshRef.current, {
        yPercent: 12,
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
      <div className={s.canvas} aria-hidden="true">
        <div ref={meshRef} className={s.mesh}>
          {BLOOMS.map((b) => (
            <span key={b.key} className={s.bloom} data-bloom={b.key} />
          ))}
        </div>

        <svg className={s.arc} viewBox="0 0 100 100" fill="none" preserveAspectRatio="xMidYMid meet">
          <circle cx="50" cy="50" r="49.6" stroke="currentColor" strokeWidth="0.08" />
        </svg>
        <span className={s.arcRule} />
        <span className={s.scrim} />
      </div>

      <div className={s.inner}>
        <div className={`shell ${s.top}`}>
          <p className={s.statement}>
            <span className={s.glyph} aria-hidden="true" />
            {statement}
          </p>
          <p className={s.sub} data-hero-intro>{sub}</p>
        </div>

        <div className={s.bottom}>
          <div className={`shell ${s.meta}`} data-hero-intro>
            <Marquee
              className={s.tags}
              items={tags}
              speed={24}
              separator=""
              variant="pill"
              ariaLabel="Areas of practice"
            />
          </div>

          <h1 ref={markRef} className={s.wordmark}>{wordmark}</h1>
        </div>
      </div>
    </section>
  );
}
