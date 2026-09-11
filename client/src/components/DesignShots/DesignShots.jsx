import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, EASE, DUR } from '../../animations/gsapConfig';
import { useMotion } from '../../hooks/useMotionPreference';
import s from './DesignShots.module.css';

/**
 * Design shots — visual craft, not case studies.
 *
 * The section pins and scroll drives a *fractional* index rather than a
 * discrete one: the name column slides continuously and each image cross-fades
 * against its neighbour by distance from that index, so there is no step, no
 * snap and no moment where two images fight. Below 860px and under
 * reduced-motion the pin is dropped for a plain stacked list.
 */
export default function DesignShots({ shots = [], eyebrow = 'Design shots', title }) {
  const root = useRef(null);
  const pinRef = useRef(null);
  const listRef = useRef(null);
  const { reduced } = useMotion();

  useLayoutEffect(() => {
    if (!shots.length) return undefined;

    const ctx = gsap.context((self) => {
      const mm = gsap.matchMedia();

      mm.add(
        { desktop: '(min-width: 861px)', reduce: '(prefers-reduced-motion: reduce)' },
        (context) => {
          const { desktop, reduce } = context.conditions;
          const names = self.selector(`.${s.name}`);
          const slides = self.selector(`.${s.slide}`);

          if (!desktop || reduce || reduced) {
            gsap.set(slides, { autoAlpha: 1, clipPath: 'none' });
            gsap.set(names, { autoAlpha: 1 });
            gsap.fromTo(self.selector(`.${s.stackItem}`),
              { y: 40, autoAlpha: 0 },
              {
                y: 0, autoAlpha: 1, duration: DUR.standard, ease: EASE.editorial, stagger: 0.1,
                scrollTrigger: { trigger: root.current, start: 'top 78%', once: true },
              });
            return;
          }

          const last = shots.length - 1;
          const state = { index: 0 };

          /* Centre of each row within the list, so the active name can be
             parked on the viewport's centre line no matter how tall the rows
             turn out to be. */
          const rowCentre = (i) => names[i].offsetTop + names[i].offsetHeight / 2;

          const apply = () => {
            const { index } = state;
            const lo = Math.floor(index);
            const hi = Math.min(lo + 1, last);
            const centre = gsap.utils.interpolate(rowCentre(lo), rowCentre(hi), index - lo);
            gsap.set(listRef.current, {
              y: listRef.current.parentElement.clientHeight / 2 - centre,
            });

            names.forEach((el, i) => {
              const d = Math.min(Math.abs(i - index), 1);
              gsap.set(el, {
                autoAlpha: 1 - d * 0.78,
                // The active name is the only one at full weight and colour.
                color: gsap.utils.interpolate('#ecebe7', '#5a5f66', d),
              });
            });

            slides.forEach((el, i) => {
              const d = Math.min(Math.abs(i - index), 1);
              gsap.set(el, {
                autoAlpha: 1 - d,
                scale: 1 + d * 0.06,
                zIndex: Math.round((1 - d) * 10),
              });
            });
          };

          apply();

          const trigger = ScrollTrigger.create({
            trigger: root.current,
            start: 'top top',
            end: () => `+=${last * window.innerHeight}`,
            pin: pinRef.current,
            scrub: 0.7,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate(selfT) {
              state.index = selfT.progress * last;
              apply();
            },
            onRefresh() { apply(); },
          });

          return () => trigger.kill();
        }
      );

      return () => mm.revert();
    }, root);

    return () => { ctx.revert(); ScrollTrigger.refresh(); };
  }, [shots, reduced]);

  if (!shots.length) return null;

  return (
    <section ref={root} id="design-shots" className={s.root} aria-label="Design shots">
      <div ref={pinRef} className={s.pin}>
        <div className={`bleed ${s.inner}`}>
          <header className={s.head}>
            <p className="eyebrow">{eyebrow}</p>
            {title && <h2 className={`h3 ${s.title}`}>{title}</h2>}
          </header>

          <div className={s.columns}>
            <div className={s.namesViewport}>
              <ul ref={listRef} className={s.names}>
                {shots.map((shot) => (
                  <li key={shot.slug} className={s.name}>
                    <h3 className={s.nameText}>{shot.name}</h3>
                    <p className={s.nameSub}>{shot.subtitle}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className={s.frame}>
              {shots.map((shot) => (
                <figure key={shot.slug} className={s.slide} style={{ '--shot-accent': shot.accent }}>
                  <img className={s.img} src={shot.image} alt={`${shot.name} — ${shot.subtitle}`} loading="lazy" />
                </figure>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Stacked fallback for narrow viewports and reduced motion. */}
      <div className={s.stack}>
        {shots.map((shot) => (
          <article key={shot.slug} className={s.stackItem} style={{ '--shot-accent': shot.accent }}>
            <img className={s.stackImg} src={shot.image} alt={`${shot.name} — ${shot.subtitle}`} loading="lazy" />
            <div className={s.stackCopy}>
              <h3 className={s.nameText}>{shot.name}</h3>
              <p className={s.nameSub}>{shot.subtitle}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
