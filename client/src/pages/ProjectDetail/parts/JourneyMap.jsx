import { useLayoutEffect, useRef } from 'react';
import { gsap, DUR, EASE, revealTrigger } from '../../../animations/gsapConfig';
import { useMotion } from '../../../hooks/useMotionPreference';
import s from './JourneyMap.module.css';

const TONE_LEVEL = { low: 1, mid: 2, neutral: 3, high: 4 };

/**
 * Section 8 — the journey map as an actual map: stages across, dimensions
 * down, read the way the artefact is read in a workshop. It scrolls
 * horizontally like any wide table, with the dimension labels pinned to the
 * left edge; nothing is hijacked and nothing is hidden behind a carousel.
 */
export default function JourneyMap({ journey, accent }) {
  const root = useRef(null);
  const { reduced } = useMotion();

  useLayoutEffect(() => {
    if (!journey?.stages?.length) return undefined;
    const ctx = gsap.context((self) => {
      const cols = self.selector('[data-journey-col]');
      gsap.fromTo(cols,
        reduced ? { autoAlpha: 0 } : { y: 30, autoAlpha: 0 },
        {
          y: 0, autoAlpha: 1,
          duration: reduced ? 0.4 : DUR.standard,
          ease: EASE.editorial,
          stagger: 0.07,
          scrollTrigger: revealTrigger(root.current, { start: 'top 80%' }),
        });
    }, root);
    return () => ctx.revert();
  }, [journey, reduced]);

  if (!journey?.stages?.length) return null;
  const { stages } = journey;

  /* Older case studies only carry a single `detail` line per stage. */
  const rows = [
    { key: 'goal', label: 'Goal' },
    { key: 'actions', label: 'Actions', fallback: 'detail' },
    { key: 'touchpoints', label: 'Touchpoints' },
    { key: 'pain', label: 'Pain points' },
    { key: 'opportunity', label: 'Opportunities' },
  ].filter((row) => stages.some((st) => st[row.key] || (row.fallback && st[row.fallback])));

  return (
    <section ref={root} id="journey" className={s.root} style={{ '--p-accent': accent }}>
      <div className="shell">
        <p className={s.marker}>
          <span className={s.markerNum}>08</span>
          User journey map
        </p>
        <h2 className={s.title}>{journey.label}</h2>
      </div>

      <div className={s.scroller}>
        <table className={s.table}>
          <caption className="visuallyHidden">{journey.label}</caption>
          <thead>
            <tr>
              <th scope="row" className={s.corner}>Stage</th>
              {stages.map((stage, i) => (
                <th key={stage.name} scope="col" className={s.stage} data-journey-col>
                  <span className={s.stageNum}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={s.stageName}>{stage.name}</span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                <th scope="row" className={s.rowLabel}>{row.label}</th>
                {stages.map((stage) => (
                  <td key={stage.name} className={s.cell} data-kind={row.key}>
                    {stage[row.key] || (row.fallback ? stage[row.fallback] : null) || (
                      <span className={s.empty} aria-label="Not recorded">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}

            {/* Emotional register, drawn as level rather than colour. */}
            <tr>
              <th scope="row" className={s.rowLabel}>Emotion</th>
              {stages.map((stage) => {
                const level = TONE_LEVEL[stage.tone] ?? 3;
                return (
                  <td key={stage.name} className={s.cell} data-kind="emotion">
                    <span className={s.emotionName}>{stage.emotion}</span>
                    <span className={s.meter} aria-hidden="true">
                      {[1, 2, 3, 4].map((n) => (
                        <i key={n} data-on={n <= level || undefined} />
                      ))}
                    </span>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      <p className={`shell meta ${s.hint}`}>Scroll the map sideways to follow the whole journey.</p>
    </section>
  );
}
