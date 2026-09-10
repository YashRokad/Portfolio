import { useLayoutEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { gsap, DUR, EASE, revealTrigger } from '../../animations/gsapConfig';
import { splitText } from '../../animations/splitText';
import { useMotion } from '../../hooks/useMotionPreference';
import SectionHeading from '../../components/SectionHeading/SectionHeading';
import Marquee from '../../components/Marquee/Marquee';
import CtaBanner from '../../components/CtaBanner/CtaBanner';
import { useReveal } from '../../hooks/useReveal';
import usePageTitle from '../../hooks/usePageTitle';
import s from './About.module.css';

export default function About() {
  const { about } = useOutletContext();
  const { reduced } = useMotion();
  usePageTitle('About');

  const ledgerRef = useRef(null);
  const headingRef = useRef(null);
  const toolsScope = useReveal({ stagger: 0.05, y: 30, deps: [about?.name] });

  /* The ledger is the whole page's first impression, so it reveals as one
     considered sequence: heading, then rows, then the portrait unmasking. */
  useLayoutEffect(() => {
    if (!about) return undefined;
    let split;

    const ctx = gsap.context((self) => {
      const rows = self.selector(`.${s.row}`);
      const portrait = self.selector(`.${s.portrait}`);

      if (reduced) {
        gsap.set(headingRef.current, { visibility: 'visible' });
        gsap.fromTo([headingRef.current, ...rows, ...portrait],
          { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, stagger: 0.05 });
        return;
      }

      split = splitText(headingRef.current, { chars: true });
      gsap.set(headingRef.current, { visibility: 'visible' });

      gsap.timeline({ delay: 0.1 })
        .fromTo(split.chars,
          { yPercent: 116, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: DUR.hero, ease: EASE.editorial, stagger: 0.02 })
        .fromTo(portrait,
          { clipPath: 'inset(0% 0% 100% 0%)', scale: 1.12 },
          { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.1, ease: EASE.curtain }, 0.3)
        .fromTo(rows,
          { y: 34, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: DUR.slow, ease: EASE.editorial, stagger: 0.1 }, 0.55);
    }, ledgerRef);

    return () => { ctx.revert(); split?.revert?.(); };
  }, [about, reduced]);

  /* The career rows share the ledger's grammar but arrive on scroll. */
  const careerRef = useRef(null);
  useLayoutEffect(() => {
    if (!about?.timeline?.length) return undefined;
    const ctx = gsap.context((self) => {
      const lines = self.selector(`.${s.careerLine}`);
      gsap.fromTo(lines,
        reduced ? { autoAlpha: 0 } : { x: -24, autoAlpha: 0 },
        {
          x: 0, autoAlpha: 1,
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
      {/* ---- The ledger ---- */}
      <section ref={ledgerRef} className={s.ledger}>
        <div className={`shell ${s.ledgerInner}`}>
          <div className={s.ledgerCopy}>
            <h1 ref={headingRef} className={s.heading}>About me</h1>

            <dl className={s.rows}>
              {(about?.ledger ?? []).map((entry) => (
                <div key={entry.label} className={s.row}>
                  <dt className={s.label}>{entry.label}</dt>
                  <dd className={s.value}>{entry.body}</dd>
                </div>
              ))}

              <div ref={careerRef} className={s.row}>
                <dt className={s.label}>Career</dt>
                <dd className={s.value}>
                  <ul className={s.career}>
                    {(about?.timeline ?? []).map((entry) => (
                      <li key={entry.period} className={s.careerLine}>
                        <span className={s.period}>({entry.period})</span>
                        {entry.role} at {entry.org}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>

          <figure className={s.portrait}>
            <img src={about?.portrait ?? ''} alt={`${about?.name ?? 'Designer'}, portrait`} />
          </figure>
        </div>
      </section>

      {/* ---- Skills marquee, two opposing rows ---- */}
      <section className={s.marqueeSection} aria-label="Skills">
        <Marquee items={skills.slice(0, half)} speed={34} direction={1} className={s.marqueeRow} />
        <Marquee items={skills.slice(half)} speed={40} direction={-1} className={`${s.marqueeRow} ${s.marqueeAlt}`} />
      </section>

      {/* ---- Tools ---- */}
      <section ref={toolsScope} className={`section ${s.tools}`}>
        <div className="shell">
          <SectionHeading eyebrow="Stack" title="What I actually open every day." />
          <ul className={s.toolList}>
            {(about?.tools ?? []).map((tool) => (
              <li key={tool.name} className={s.toolRow} data-reveal>
                <span className={s.toolName}>{tool.name}</span>
                <span className={s.toolUse}>{tool.use}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBanner
        eyebrow="Work"
        title="The four case studies are where this all shows up."
        body="Each one has the research, the numbers, and the parts that did not work."
        to="/work"
        action="See the work"
      />
    </>
  );
}
