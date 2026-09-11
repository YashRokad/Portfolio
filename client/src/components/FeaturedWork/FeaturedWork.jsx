import { useLayoutEffect, useRef } from 'react';
import { gsap, Flip, ScrollTrigger, DUR, EASE, STAGGER, revealTrigger } from '../../animations/gsapConfig';
import { splitText } from '../../animations/splitText';
import { useMotion } from '../../hooks/useMotionPreference';
import { stashFlip } from '../../animations/flipBridge';
import TransitionLink from '../Transition/TransitionLink';
import Magnetic from '../Magnetic/Magnetic';
import Stat from '../Stat/Stat';
import s from './FeaturedWork.module.css';

/**
 * One case study, given the room a single piece of work deserves: an oversized
 * image that unmasks and parallaxes, the title straddling its lower edge, and
 * the headline numbers underneath. Clicking captures a Flip state from the
 * image so the detail hero morphs out of it.
 */
export default function FeaturedWork({ project, totalCount = 0 }) {
  const root = useRef(null);
  const imageRef = useRef(null);
  const titleRef = useRef(null);
  const { reduced, touch } = useMotion();

  useLayoutEffect(() => {
    if (!project) return undefined;
    let split;

    const ctx = gsap.context((self) => {
      const frame = self.selector(`.${s.frame}`);
      const meta = self.selector('[data-fw-meta]');
      const foot = self.selector('[data-fw-foot]');

      if (reduced) {
        gsap.set(titleRef.current, { visibility: 'visible' });
        gsap.fromTo([...frame, titleRef.current, ...meta, ...foot],
          { autoAlpha: 0 },
          {
            autoAlpha: 1, duration: 0.45, stagger: 0.05,
            scrollTrigger: revealTrigger(root.current),
          });
        return;
      }

      split = splitText(titleRef.current, { chars: true });
      gsap.set(titleRef.current, { visibility: 'visible' });

      gsap.timeline({ scrollTrigger: revealTrigger(root.current, { start: 'top 74%' }) })
        .fromTo(frame,
          { clipPath: 'inset(14% 8% 14% 8% round 20px)' },
          { clipPath: 'inset(0% 0% 0% 0% round 20px)', duration: 1.25, ease: EASE.curtain })
        .fromTo(imageRef.current,
          { scale: 1.22 },
          { scale: 1, duration: 1.5, ease: EASE.editorial }, 0)
        .fromTo(split.chars,
          { yPercent: 118, autoAlpha: 0 },
          {
            yPercent: 0, autoAlpha: 1,
            duration: DUR.hero, ease: EASE.editorial, stagger: STAGGER.chars,
          }, 0.5)
        .fromTo(meta,
          { y: 22, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: DUR.standard, stagger: 0.08 }, 0.75)
        .fromTo(foot,
          { y: 26, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: DUR.standard, stagger: 0.08 }, 0.9);

      /* The image drifts inside its frame as the section passes. */
      gsap.fromTo(imageRef.current,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        });
    }, root);

    return () => { ctx.revert(); split?.revert?.(); ScrollTrigger.refresh(); };
  }, [project, reduced]);

  if (!project) return null;

  const handleClick = () => {
    if (reduced || touch) return;
    if (imageRef.current) stashFlip(project.slug, Flip.getState(imageRef.current), project.cover);
  };

  const highlights = (project.metrics ?? []).slice(0, 3);

  return (
    <section
      ref={root}
      id="selected-work"
      className={`section ${s.root}`}
      style={{ '--fw-accent': project.accent }}
    >
      <div className={`shell ${s.plate}`}>
        <header className={s.head}>
          <p className="eyebrow" data-fw-meta>Selected work</p>
          <TransitionLink to="/work" className={s.all} data-fw-meta>
            All {totalCount || 'the'} case studies
            <span aria-hidden="true">→</span>
          </TransitionLink>
        </header>

        <TransitionLink
          to={`/work/${project.slug}`}
          className={s.link}
          data-cursor="view"
          data-cursor-label="Open"
          onClick={handleClick}
          skipCurtain={!reduced && !touch}
        >
          <div className={s.frame}>
            <img ref={imageRef} className={s.image} src={project.cover} alt="" />
            <span className={s.badge} data-fw-meta>{project.industry} · {project.year}</span>
          </div>

          <h2 ref={titleRef} className={s.title}>{project.title}</h2>
        </TransitionLink>

        <div className={s.foot}>
          <div className={s.copy}>
            <p className={s.tagline} data-fw-foot>{project.tagline}</p>
            <div data-fw-foot>
              <Magnetic strength={0.35}>
                <TransitionLink to={`/work/${project.slug}`} className={s.cta}>
                  Read the case study
                  <span aria-hidden="true">→</span>
                </TransitionLink>
              </Magnetic>
            </div>
          </div>

          <ul className={s.stats}>
            {highlights.map((metric) => (
              <li key={metric.label} data-fw-foot>
                <Stat {...metric} note={undefined} size="xs" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
