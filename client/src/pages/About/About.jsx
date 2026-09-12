import { useLayoutEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { gsap, DUR, EASE, revealTrigger } from '../../animations/gsapConfig';
import { splitText } from '../../animations/splitText';
import { useMotion } from '../../hooks/useMotionPreference';
import { useHeadlineReveal } from '../../hooks/useReveal';
import SectionHeading from '../../components/SectionHeading/SectionHeading';
import Marquee from '../../components/Marquee/Marquee';
import Capabilities from '../../components/Capabilities/Capabilities';
import { useReveal } from '../../hooks/useReveal';
import usePageTitle from '../../hooks/usePageTitle';
import s from './About.module.css';

export default function About() {
  const { about } = useOutletContext();
  const { reduced } = useMotion();
  usePageTitle('About');

  const headlineRef = useRef(null);
  useHeadlineReveal(headlineRef, { chars: true, delay: 0.1, trigger: false });

  const heroRef = useRef(null);
  const ledgerScope = useReveal({ stagger: 0.1, y: 34, deps: [about?.name] });
  const philosophyScope = useReveal({ stagger: 0.08, y: 30, deps: [about?.name] });

  /* Portrait unmasks and the lead statement rises in once the headline has
     had a beat to itself — same grammar as the hero, scoped to this page. */
  useLayoutEffect(() => {
    if (!about) return undefined;
    const ctx = gsap.context((self) => {
      const portrait = self.selector(`.${s.portrait}`)[0];
      const lead = self.selector(`.${s.lead}`)[0];
      const tag = self.selector(`.${s.tag}`);

      if (reduced) {
        gsap.set([portrait, lead, ...tag], { clearProps: 'all' });
        return;
      }

      gsap.timeline({ delay: 0.55 })
        .fromTo(portrait,
          { clipPath: 'inset(0% 0% 100% 0%)', scale: 1.1 },
          { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.15, ease: EASE.curtain })
        .fromTo(lead,
          { y: 30, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: DUR.slow, ease: EASE.editorial }, 0.2)
        .fromTo(tag,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: DUR.standard, stagger: 0.06 }, 0.4);
    }, heroRef);
    return () => ctx.revert();
  }, [about, reduced]);

  /* Career rail arrives on scroll, numbered like a masthead index. */
  const careerRef = useRef(null);
  useLayoutEffect(() => {
    if (!about?.timeline?.length) return undefined;
    const ctx = gsap.context((self) => {
      const rows = self.selector(`.${s.careerRow}`);
      gsap.fromTo(rows,
        reduced ? { autoAlpha: 0 } : { y: 28, autoAlpha: 0 },
        {
          y: 0, autoAlpha: 1,
          duration: reduced ? 0.4 : DUR.standard,
          ease: EASE.editorial,
          stagger: 0.08,
          scrollTrigger: revealTrigger(careerRef.current, { start: 'top 85%' }),
        });
    }, careerRef);
    return () => ctx.revert();
  }, [about, reduced]);

  const skills = about?.skills ?? [];
  const half = Math.ceil(skills.length / 2);

  return (
    <>
      {/* ---- Masthead hero: oversized headline, portrait breaking the grid ---- */}
      <section ref={heroRef} className={s.hero}>
        <div className={`shell ${s.heroShell}`}>
          <p className={`eyebrow ${s.eyebrow}`}>About</p>
          <h1 ref={headlineRef} className={s.headline}>
            {about?.aboutHeadline ?? 'About me'}
          </h1>

          <div className={s.heroRow}>
            <p className={s.lead}>{about?.introStatement}</p>
            <ul className={s.tags} aria-hidden="true">
              {(about?.capabilities ?? []).slice(0, 4).map((c) => (
                <li key={c.slug} className={s.tag}>{c.title}</li>
              ))}
            </ul>
          </div>
        </div>

        <figure className={s.portrait}>
          <img src={about?.portrait ?? ''} alt={`${about?.name ?? 'Designer'}, portrait`} />
        </figure>
      </section>

      {/* ---- Ledger, run as offset magazine columns rather than a data table ---- */}
      <section ref={ledgerScope} className={s.ledger}>
        <div className={`shell ${s.ledgerShell}`}>
          {(about?.ledger ?? []).map((entry, i) => (
            <article key={entry.label} className={s.entry} data-reveal>
              <span className={s.entryIndex}>{String(i + 1).padStart(2, '0')}</span>
              <h2 className={s.entryLabel}>{entry.label}</h2>
              <p className={s.entryBody}>{entry.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---- Skills marquee, two opposing rows ---- */}
      <section className={s.marqueeSection} aria-label="Skills">
        <Marquee items={skills.slice(0, half)} speed={34} direction={1} className={s.marqueeRow} />
        <Marquee items={skills.slice(half)} speed={40} direction={-1} className={`${s.marqueeRow} ${s.marqueeAlt}`} />
      </section>

      {/* ---- Career rail ---- */}
      <section ref={careerRef} className={`section ${s.career}`}>
        <div className="shell">
          <SectionHeading eyebrow="Career" title="Ten years, four rooms." tight />
          <ol className={s.careerList}>
            {(about?.timeline ?? []).map((entry) => (
              <li key={entry.period} className={s.careerRow}>
                <span className={s.careerPeriod}>{entry.period}</span>
                <span className={s.careerRole}>
                  {entry.role} <span className={s.careerOrg}>— {entry.org}</span>
                </span>
                <p className={s.careerNote}>{entry.note}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- Services ---- */}
      <Capabilities
        items={about?.capabilities ?? []}
        eyebrow="What I do"
        title="Five things, and what you get from each."
      />

      {/* ---- Philosophy, as a pull-quote grid ---- */}
      {about?.philosophy?.length > 0 && (
        <section ref={philosophyScope} className={`section ${s.philosophy}`}>
          <div className="shell">
            <SectionHeading eyebrow="How I think about it" title="Four things I keep coming back to." tight />
            <ul className={s.philosophyGrid}>
              {about.philosophy.map((p, i) => (
                <li key={p.title} className={s.philosophyCard} data-reveal>
                  <span className={s.philosophyIndex}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 className={s.philosophyTitle}>{p.title}</h3>
                  <p className={s.philosophyBody}>{p.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
