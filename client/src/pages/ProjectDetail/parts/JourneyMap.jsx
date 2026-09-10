import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, EASE } from '../../../animations/gsapConfig';
import { useMotion } from '../../../hooks/useMotionPreference';
import s from './JourneyMap.module.css';

/**
 * Section 8 — User Journey Map. Pinned horizontally: vertical scroll drives
 * the stage track sideways. Below 860px, and for reduced-motion visitors, the
 * pin is dropped entirely and the stages stack as a normal vertical list.
 */
export default function JourneyMap({ journey, accent }) {
  const root = useRef(null);
  const trackRef = useRef(null);
  const { reduced } = useMotion();

  useLayoutEffect(() => {
    if (!journey?.stages?.length) return undefined;

    const ctx = gsap.context((self) => {
      const mm = gsap.matchMedia();

      mm.add(
        { desktop: '(min-width: 861px)', mobile: '(max-width: 860px)', reduce: '(prefers-reduced-motion: reduce)' },
        (context) => {
          const { desktop, reduce } = context.conditions;
          const cards = self.selector(`.${s.card}`);
          const progress = self.selector(`.${s.progressBar}`);

          if (!desktop || reduce || reduced) {
            /* Sane fallback: stagger the cards in place, no pin, no hijack. */
            gsap.fromTo(cards,
              { y: 40, autoAlpha: 0 },
              {
                y: 0, autoAlpha: 1, duration: 0.7, ease: EASE.editorial, stagger: 0.08,
                scrollTrigger: { trigger: root.current, start: 'top 78%', once: true },
              });
            return;
          }

          const track = trackRef.current;
          const distance = () => track.scrollWidth - window.innerWidth + 96;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: 'top top',
              end: () => `+=${Math.max(distance(), 1)}`,
              pin: true,
              scrub: 0.8,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });
          tl.to(track, { x: () => -distance(), ease: 'none' })
            .fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0);

          /* Each card lifts as it reaches the reading position. */
          cards.forEach((card) => {
            gsap.fromTo(card,
              { y: 26, scale: 0.97 },
              {
                y: 0, scale: 1, ease: 'none',
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: tl,
                  start: 'left 82%',
                  end: 'left 45%',
                  scrub: true,
                },
              });
          });
        }
      );

      return () => mm.revert();
    }, root);

    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, [journey, reduced]);

  if (!journey?.stages?.length) return null;

  return (
    <section ref={root} id="journey" className={s.root} style={{ '--p-accent': accent }}>
      <div className={s.head}>
        <div className="shell">
          <p className={s.marker}>
            <span className={s.markerNum}>08</span>
            User journey map
          </p>
          <h2 className={`h2 ${s.title}`}>{journey.label}</h2>
        </div>
      </div>

      <div className={s.viewport}>
        <ol ref={trackRef} className={s.track}>
          {journey.stages.map((stage, i) => (
            <li key={stage.name} className={s.card} data-tone={stage.tone}>
              <span className={s.stageIndex}>{String(i + 1).padStart(2, '0')}</span>
              <h3 className={`h4 ${s.stageName}`}>{stage.name}</h3>
              <p className={s.stageDetail}>{stage.detail}</p>
              <p className={s.emotion}>
                <span className={s.emotionDot} aria-hidden="true" />
                {stage.emotion}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="shell">
        <div className={s.progressTrack} aria-hidden="true">
          <span className={s.progressBar} />
        </div>
        <p className={`meta ${s.hint}`}>Keep scrolling — the journey moves sideways.</p>
      </div>
    </section>
  );
}
