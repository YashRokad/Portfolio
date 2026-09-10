import { useLayoutEffect, useRef } from 'react';
import { gsap, Flip, DUR, EASE, STAGGER } from '../../../animations/gsapConfig';
import { splitText } from '../../../animations/splitText';
import { useMotion } from '../../../hooks/useMotionPreference';
import { claimFlip } from '../../../animations/flipBridge';
import { scrollToEl } from '../../../hooks/useSmoothScroll';
import s from './ProjectHero.module.css';

/**
 * Section 1 — Project Title.
 *
 * Date and oversized project name on the left, the outcome line and a meta
 * ledger on the right, then a full-bleed image before the case study proper
 * begins. The image claims the Flip state stashed by the work grid so the
 * clicked card morphs into it; a direct load or reduced motion gets a
 * cross-fade instead.
 */
export default function ProjectHero({ project }) {
  const root = useRef(null);
  const imageRef = useRef(null);
  const titleRef = useRef(null);
  const { reduced } = useMotion();

  useLayoutEffect(() => {
    if (!project) return undefined;
    let split;

    const ctx = gsap.context((self) => {
      const rows = self.selector(`.${s.metaRow}`);
      const lead = self.selector(`.${s.lead}`);
      const date = self.selector(`.${s.date}`);
      const action = self.selector(`.${s.action}`);
      const glow = self.selector(`.${s.glow}`);
      const img = imageRef.current;
      const stashed = reduced ? null : claimFlip(project.slug);

      if (stashed) {
        Flip.fit(img, stashed.state, { scale: true });
        Flip.from(Flip.getState(img), {
          duration: 0.92,
          ease: EASE.editorial,
          scale: true,
        });
      } else {
        gsap.fromTo(img,
          { autoAlpha: 0, scale: reduced ? 1 : 1.1 },
          { autoAlpha: 1, scale: 1, duration: reduced ? 0.45 : 1.5, ease: EASE.editorial });
      }

      if (reduced) {
        gsap.set(titleRef.current, { visibility: 'visible' });
        gsap.fromTo([titleRef.current, ...lead, ...rows, ...date, ...action],
          { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, stagger: 0.04 });
        return;
      }

      split = splitText(titleRef.current, { chars: true });
      gsap.set(titleRef.current, { visibility: 'visible' });

      gsap.timeline({ delay: 0.08 })
        .fromTo(date, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: DUR.standard }, 0)
        .fromTo(split.chars,
          { yPercent: 112, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: DUR.hero, ease: EASE.editorial, stagger: STAGGER.chars }, 0.1)
        .fromTo(lead, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: DUR.slow }, 0.35)
        .fromTo(rows,
          { y: 18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: DUR.standard, stagger: 0.07 }, 0.5)
        .fromTo(action, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: DUR.standard }, 0.7);

      /* The accent glow breathes very slowly behind the heading. */
      gsap.to(glow, {
        scale: 1.15, xPercent: -6, opacity: 0.85,
        duration: 16, ease: EASE.drift, repeat: -1, yoyo: true,
      });
    }, root);

    return () => { ctx.revert(); split?.revert?.(); };
  }, [project, reduced]);

  if (!project) return null;

  const meta = [
    ['Industry', project.industry],
    ['Scope of work', project.role],
    ['Timeline', project.timeline],
    ['Team', project.team],
    ['Tools', project.tools.join(', ')],
  ];

  return (
    <section ref={root} id="overview" className={s.root} style={{ '--p-accent': project.accent }}>
      <span className={s.glow} aria-hidden="true" />

      <div className={`shell ${s.head}`}>
        <div className={s.left}>
          <p className={s.date}>{project.industry} · {project.year}</p>
          <h1 ref={titleRef} className={s.title}>{project.title}</h1>
          <button
            type="button"
            className={s.action}
            onClick={() => scrollToEl(document.getElementById('metrics'))}
          >
            See the outcome
            <span aria-hidden="true" className={s.arrow}>↓</span>
          </button>
        </div>

        <div className={s.right}>
          <p className={s.lead}>{project.tagline}</p>
          <dl className={s.meta}>
            {meta.map(([label, value]) => (
              <div key={label} className={s.metaRow}>
                <dt className={s.metaLabel}>{label}</dt>
                <dd className={s.metaValue}>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <figure className={s.figure}>
        <img ref={imageRef} className={s.image} src={project.cover} alt={`${project.title} — cover`} />
      </figure>
    </section>
  );
}
