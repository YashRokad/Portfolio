import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { gsap, Flip, DUR, EASE, STAGGER, revealTrigger } from '../../animations/gsapConfig';
import { useMotion } from '../../hooks/useMotionPreference';
import { stashFlip } from '../../animations/flipBridge';
import TransitionLink from '../../components/Transition/TransitionLink';
import SectionHeading from '../../components/SectionHeading/SectionHeading';
import CtaBanner from '../../components/CtaBanner/CtaBanner';
import { api } from '../../data-client/api';
import { useResource } from '../../data-client/useApi';
import usePageTitle from '../../hooks/usePageTitle';
import s from './Work.module.css';

const ALL = 'All';
/* The full vertical list is fixed so the filter bar reads as a statement of
   range, not as a summary of whatever happens to be in the JSON today. */
const INDUSTRIES = [ALL, 'Fintech', 'Insurance', 'Manufacturing', 'Logistics', 'Hospitality', 'SaaS'];

export default function Work() {
  const { about } = useOutletContext();
  const { data: projects, loading } = useResource('projects', api.getProjects);
  const [filter, setFilter] = useState(ALL);
  const gridRef = useRef(null);
  const { reduced, touch } = useMotion();
  usePageTitle('Work');

  const all = useMemo(() => projects ?? [], [projects]);
  const visible = useMemo(
    () => (filter === ALL ? all : all.filter((p) => p.industry === filter)),
    [all, filter]
  );

  const counts = useMemo(() => {
    const map = { [ALL]: all.length };
    all.forEach((p) => { map[p.industry] = (map[p.industry] ?? 0) + 1; });
    return map;
  }, [all]);

  /* Cards reveal on first paint of a data set. */
  useLayoutEffect(() => {
    if (!all.length) return undefined;
    const ctx = gsap.context((self) => {
      const cards = self.selector(`.${s.card}`);
      if (!cards.length) return;
      if (reduced) {
        gsap.fromTo(cards, { autoAlpha: 0 }, {
          autoAlpha: 1, duration: 0.4, stagger: 0.05, scrollTrigger: revealTrigger(gridRef.current),
        });
        return;
      }
      gsap.fromTo(cards,
        { y: 70, autoAlpha: 0, clipPath: 'inset(6% 6% 6% 6% round 14px)' },
        {
          y: 0, autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0% round 14px)',
          duration: DUR.slow, ease: EASE.editorial, stagger: STAGGER.cards,
          scrollTrigger: revealTrigger(gridRef.current),
        });
    }, gridRef);
    return () => ctx.revert();
  }, [all, reduced]);

  /* Filter changes re-flow the grid with Flip rather than re-rendering into
     a new position with a jump. */
  const changeFilter = (next) => {
    if (next === filter) return;
    if (reduced || !gridRef.current) { setFilter(next); return; }

    const state = Flip.getState(gridRef.current.querySelectorAll(`.${s.cardWrap}`), {
      props: 'opacity',
      simple: true,
    });
    setFilter(next);
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.72,
        ease: EASE.editorial,
        scale: true,
        stagger: 0.045,
        absolute: true,
        onEnter: (els) => gsap.fromTo(els,
          { autoAlpha: 0, scale: 0.86, y: 32 },
          { autoAlpha: 1, scale: 1, y: 0, duration: DUR.standard, ease: EASE.editorial, stagger: 0.045 }),
        onLeave: (els) => gsap.to(els,
          { autoAlpha: 0, scale: 0.9, y: -24, duration: DUR.quick, ease: EASE.snap }),
      });
    });
  };

  const handleClick = (project) => (e) => {
    if (reduced || touch) return;
    const img = e.currentTarget.querySelector(`.${s.image}`);
    if (img) stashFlip(project.slug, Flip.getState(img), project.cover);
  };

  return (
    <>
      <section className={`section ${s.intro}`}>
        <div className="shell">
          <SectionHeading
            as="h1"
            eyebrow={`Work · ${all.length} case studies`}
            title="Operational software for people who cannot log off."
            lead={about?.introStatement}
          />
        </div>
      </section>

      <section className={s.gridSection}>
        <div className="shell">
          <div className={s.filters} role="tablist" aria-label="Filter projects by industry">
            {INDUSTRIES.map((industry) => {
              const count = counts[industry] ?? 0;
              return (
                <button
                  key={industry}
                  type="button"
                  role="tab"
                  aria-selected={filter === industry}
                  className={s.filter}
                  data-active={filter === industry || undefined}
                  data-empty={count === 0 || undefined}
                  onClick={() => changeFilter(industry)}
                >
                  {industry}
                  <span className={s.filterCount}>{count}</span>
                </button>
              );
            })}
          </div>

          <div ref={gridRef} className={s.grid}>
            {visible.map((project) => (
              <article key={project.slug} className={s.cardWrap} data-flip-id={project.slug}>
                <TransitionLink
                  to={`/work/${project.slug}`}
                  className={s.card}
                  data-cursor="view"
                  data-cursor-label="Open"
                  style={{ '--card-accent': project.accent }}
                  onClick={handleClick(project)}
                  skipCurtain={!reduced && !touch}
                >
                  <span className={s.frame}>
                    <img className={s.image} src={project.cover} alt="" loading="lazy" />
                  </span>
                  <span className={s.caption}>
                    <h2 className={s.cardTitle}>{project.title}</h2>
                    <p className={s.cardTagline}>{project.tagline}</p>
                  </span>
                </TransitionLink>
              </article>
            ))}

            {!loading && visible.length === 0 && (
              <p className={s.empty}>
                Nothing in {filter} yet — the case studies from that vertical are still under NDA.
                <button type="button" className={s.emptyAction} onClick={() => changeFilter(ALL)}>
                  Show everything
                </button>
              </p>
            )}
          </div>
        </div>
      </section>

      <CtaBanner
        eyebrow="Next"
        title="Want the version of this with your numbers in it?"
        body={about?.availability?.detail}
        action="Start a conversation"
      />
    </>
  );
}
