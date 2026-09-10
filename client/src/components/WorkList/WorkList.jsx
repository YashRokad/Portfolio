import { useRef, useLayoutEffect } from 'react';
import { gsap, DUR, EASE, STAGGER, revealTrigger } from '../../animations/gsapConfig';
import { useMotion } from '../../hooks/useMotionPreference';
import TransitionLink from '../Transition/TransitionLink';
import s from './WorkList.module.css';

/**
 * Name + outcome-tagline rows. Each row carries its own thumbnail so the work
 * reads at a glance without a floating panel chasing the pointer.
 */
export default function WorkList({ projects = [] }) {
  const scope = useRef(null);
  const { reduced } = useMotion();

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const rows = self.selector(`.${s.row}`);
      if (!rows.length) return;
      if (reduced) {
        gsap.fromTo(rows, { autoAlpha: 0 }, {
          autoAlpha: 1, duration: 0.4, stagger: 0.05,
          scrollTrigger: revealTrigger(scope.current),
        });
        return;
      }
      gsap.fromTo(rows,
        { yPercent: 40, autoAlpha: 0, clipPath: 'inset(0% 0% 100% 0%)' },
        {
          yPercent: 0, autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)',
          duration: DUR.slow, ease: EASE.editorial, stagger: STAGGER.list,
          scrollTrigger: revealTrigger(scope.current),
        });
    }, scope);
    return () => ctx.revert();
  }, [reduced, projects]);

  return (
    <div ref={scope} className={s.root}>
      <ul className={s.list}>
        {projects.map((project, i) => (
          <li key={project.slug} className={s.rowWrap}>
            <TransitionLink
              to={`/work/${project.slug}`}
              className={s.row}
              data-cursor="view"
              data-cursor-label="Open"
            >
              <span className={s.index}>{String(i + 1).padStart(2, '0')}</span>
              <span className={s.title}>{project.title}</span>
              <span className={s.tagline}>{project.tagline}</span>
              <span className={s.industry} style={{ '--row-accent': project.accent }}>
                {project.industry}
              </span>
              <span className={s.arrow} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M5 19 19 5M9 5h10v10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <img className={s.thumb} src={project.cover} alt="" loading="lazy" />
            </TransitionLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
