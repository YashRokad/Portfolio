import { useLayoutEffect, useRef } from 'react';
import { gsap, Flip, DUR, EASE, STAGGER } from '../../../animations/gsapConfig';
import { splitText } from '../../../animations/splitText';
import { useMotion } from '../../../hooks/useMotionPreference';
import { claimFlip } from '../../../animations/flipBridge';
import s from './ProjectHero.module.css';

/**
 * Section 1 — Project Title. Claims the Flip state stashed by the work grid
 * so the clicked card image morphs into this hero. If no state is available
 * (direct load, back button, reduced motion) it cross-fades in instead.
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
      const meta = self.selector(`.${s.metaItem}`);
      const tagline = self.selector(`.${s.tagline}`);
      const img = imageRef.current;
      const stashed = reduced ? null : claimFlip(project.slug);

      if (stashed) {
        Flip.fit(img, stashed.state, { scale: true });
        Flip.from(Flip.getState(img), {
          duration: 0.92,
          ease: EASE.editorial,
          scale: true,
          absolute: false,
        });
      } else {
        gsap.fromTo(img,
          { autoAlpha: 0, scale: reduced ? 1 : 1.08, clipPath: reduced ? undefined : 'inset(12% 12% 12% 12%)' },
          {
            autoAlpha: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)',
            duration: reduced ? 0.45 : DUR.hero, ease: EASE.editorial,
          });
      }

      if (reduced) {
        gsap.set(titleRef.current, { visibility: 'visible' });
        gsap.fromTo([titleRef.current, ...tagline, ...meta],
          { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, stagger: 0.05 });
        return;
      }

      split = splitText(titleRef.current, { chars: true });
      gsap.set(titleRef.current, { visibility: 'visible' });
      gsap.timeline({ delay: 0.1 })
        .fromTo(split.chars,
          { yPercent: 118, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: DUR.hero, ease: EASE.editorial, stagger: STAGGER.chars })
        .fromTo(tagline, { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: DUR.slow }, '-=0.95')
        .fromTo(meta, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: DUR.standard, stagger: 0.07 }, '-=0.7');
    }, root);

    return () => { ctx.revert(); split?.revert?.(); };
  }, [project, reduced]);

  if (!project) return null;

  return (
    <section ref={root} id="overview" className={s.root} style={{ '--p-accent': project.accent }}>
      <div className={`shell ${s.inner}`}>
        <div className={s.head}>
          <p className="eyebrow">{project.industry} · {project.year}</p>
          <h1 ref={titleRef} className={`display ${s.title}`}>{project.title}</h1>
          <p className={s.tagline}>{project.tagline}</p>
        </div>

        <figure className={s.figure}>
          <img ref={imageRef} className={s.image} src={project.cover} alt={`${project.title} — cover`} />
        </figure>

        <dl className={s.meta}>
          <div className={s.metaItem}>
            <dt className="meta">Role</dt>
            <dd>{project.role}</dd>
          </div>
          <div className={s.metaItem}>
            <dt className="meta">Timeline</dt>
            <dd>{project.timeline}</dd>
          </div>
          <div className={s.metaItem}>
            <dt className="meta">Team</dt>
            <dd>{project.team}</dd>
          </div>
          <div className={s.metaItem}>
            <dt className="meta">Industry</dt>
            <dd>{project.industry}</dd>
          </div>
          <div className={s.metaItem}>
            <dt className="meta">Tools</dt>
            <dd>{project.tools.join(', ')}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
