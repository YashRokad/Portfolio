import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { gsap, Flip, DUR, EASE, STAGGER, revealTrigger } from '../../animations/gsapConfig';
import { useMotion } from '../../hooks/useMotionPreference';
import { stashFlip } from '../../animations/flipBridge';
import TransitionLink from '../../components/Transition/TransitionLink';
import CtaBanner from '../../components/CtaBanner/CtaBanner';
import PageAtmosphere from '../../components/PageAtmosphere/PageAtmosphere';
import ShotSheet from '../../components/ShotSheet/ShotSheet';
import { api } from '../../data-client/api';
import { useResource } from '../../data-client/useApi';
import usePageTitle from '../../hooks/usePageTitle';
import { useHeadlineReveal } from '../../hooks/useReveal';
import s from './Work.module.css';


const MODES = [
  { id: 'cases', index: '01', label: 'Case Studies', note: 'Research, decisions, numbers.' },
  { id: 'shots', index: '02', label: 'Design Shots', note: 'Pieces, not projects.' },
];

export default function Work() {
  const { about } = useOutletContext();
  const { data: projects, loading } = useResource('projects', api.getProjects);
  const { data: shots } = useResource('shots', api.getShots);
  const [mode, setMode] = useState('cases');
  const [activeShot, setActiveShot] = useState(null);
  const gridRef = useRef(null);
  const paneRef = useRef(null);
  const headlineRef = useRef(null);
  const { reduced, touch } = useMotion();
  usePageTitle('Work');
  useHeadlineReveal(headlineRef, { chars: false, trigger: false });

  const all = useMemo(() => projects ?? [], [projects]);

  /* Cards reveal on first paint of a data set. */
  useLayoutEffect(() => {
    if (mode !== 'cases' || !all.length) return undefined;
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
  }, [all, reduced, mode]);

  /* Shot tiles reveal the same way, once the shots pane is showing. */
  useLayoutEffect(() => {
    if (mode !== 'shots' || !shots?.length) return undefined;
    const ctx = gsap.context((self) => {
      const tiles = self.selector(`.${s.cardWrap}`);
      if (!tiles.length) return;
      if (reduced) {
        gsap.fromTo(tiles, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, stagger: 0.05 });
        return;
      }
      gsap.fromTo(tiles,
        { y: 60, autoAlpha: 0, clipPath: 'inset(8% 0% 8% 0%)' },
        {
          y: 0, autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)',
          duration: DUR.slow, ease: EASE.editorial, stagger: STAGGER.cards,
        });
    }, gridRef);
    return () => ctx.revert();
  }, [shots, mode, reduced]);

  /* Switching modes is a chapter turn, not a tab click: the outgoing pane
     clips away and the incoming one unmasks from the same edge. */
  const changeMode = (next) => {
    if (next === mode || !paneRef.current) return;

    if (reduced) { setMode(next); return; }

    const el = paneRef.current;
    gsap.to(el, {
      autoAlpha: 0, y: -18, duration: DUR.quick, ease: EASE.snap,
      onComplete: () => {
        setMode(next);
        requestAnimationFrame(() => {
          gsap.fromTo(el,
            { autoAlpha: 0, y: 18, clipPath: 'inset(0% 0% 100% 0%)' },
            { autoAlpha: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: DUR.slow, ease: EASE.editorial });
        });
      },
    });
  };

  const handleClick = (project) => (e) => {
    if (reduced || touch) return;
    const img = e.currentTarget.querySelector(`.${s.image}`);
    if (img) stashFlip(project.slug, Flip.getState(img), project.cover);
  };

  return (
    <>
      <section className={s.intro}>
        <PageAtmosphere />
        <div className={`shell ${s.introShell}`}>
          <p className={`eyebrow ${s.introEyebrow}`}>Work</p>
          <h1 ref={headlineRef} className={s.introHeadline}>
            Operational software for people who cannot log off.
          </h1>

          <div className={s.introRow}>
            <p className={s.introLead}>{about?.workStatement}</p>
            <dl className={s.tally}>
              <div className={s.tallyItem}>
                <dt className={s.tallyLabel}>Case studies</dt>
                <dd className={s.tallyValue}>{String(all.length).padStart(2, '0')}</dd>
              </div>
              <div className={s.tallyItem}>
                <dt className={s.tallyLabel}>Design shots</dt>
                <dd className={s.tallyValue}>{String((shots ?? []).length).padStart(2, '0')}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* ---- Mode rail: a chapter index, not a pill switch ---- */}
      <section className={s.modeSection}>
        <div className={`shell ${s.modeShell}`}>
          <div className={s.modeRail} role="tablist" aria-label="Show case studies or design shots">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={mode === m.id}
                className={s.modeItem}
                data-active={mode === m.id || undefined}
                onClick={() => changeMode(m.id)}
              >
                <span className={s.modeLabel}>{m.label}</span>
                <span className={s.modeNote}>{m.note}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div ref={paneRef}>
        {mode === 'cases' ? (
          <section className={s.gridSection}>
            <div className="shell">
              <div ref={gridRef} className={s.grid}>
                {all.map((project) => (
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

                {!loading && all.length === 0 && (
                  <p className={s.empty}>
                    No case studies yet.
                  </p>
                )}
              </div>
            </div>
          </section>
        ) : (
          <section className={s.gridSection}>
            <div className="shell">
              <div ref={gridRef} className={s.grid}>
                {(shots ?? []).map((shot) => (
                  <article key={shot.slug} className={s.cardWrap}>
                    <button
                      type="button"
                      className={s.card}
                      data-cursor="view"
                      data-cursor-label="Open"
                      style={{ '--card-accent': shot.accent }}
                      onClick={() => setActiveShot(shot)}
                    >
                      <span className={`${s.frame} ${s.frameWide}`}>
                        <img className={s.image} src={shot.image} alt="" loading="lazy" />
                      </span>
                      <span className={s.caption}>
                        <h2 className={s.cardTitle}>{shot.name}</h2>
                        <p className={s.cardTagline}>{shot.subtitle}</p>
                      </span>
                    </button>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      <CtaBanner
        eyebrow="Next"
        title="Want the version of this with your numbers in it?"
        action="Start a conversation"
      />

      <ShotSheet shot={activeShot} onClose={() => setActiveShot(null)} />
    </>
  );
}
