import { useLayoutEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { gsap, ScrollTrigger, DUR, EASE, revealTrigger } from '../../animations/gsapConfig';
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

  const introScope = useReveal({ stagger: 0.07, y: 40, deps: [about?.name] });
  const philosophyScope = useReveal({ stagger: 0.08, y: 44, deps: [about?.name] });
  const toolsScope = useReveal({ stagger: 0.05, y: 30, deps: [about?.name] });

  const timelineRef = useRef(null);
  const splitRef = useRef(null);

  /* Career timeline: each entry rises as the connecting line draws down. */
  useLayoutEffect(() => {
    if (!about?.timeline?.length) return undefined;
    const ctx = gsap.context((self) => {
      const rows = self.selector(`.${s.timelineRow}`);
      const line = self.selector(`.${s.timelineLine}`);

      if (reduced) {
        gsap.fromTo(rows, { autoAlpha: 0 }, {
          autoAlpha: 1, duration: 0.4, stagger: 0.06,
          scrollTrigger: revealTrigger(timelineRef.current),
        });
        gsap.set(line, { scaleY: 1 });
        return;
      }

      gsap.fromTo(line, { scaleY: 0 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 70%',
          end: 'bottom 65%',
          scrub: 0.6,
        },
      });

      gsap.fromTo(rows,
        { x: -36, autoAlpha: 0, clipPath: 'inset(0% 100% 0% 0%)' },
        {
          x: 0, autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)',
          duration: DUR.slow, ease: EASE.editorial, stagger: 0.14,
          scrollTrigger: revealTrigger(timelineRef.current, { start: 'top 76%' }),
        });
    }, timelineRef);
    return () => ctx.revert();
  }, [about, reduced]);

  /* Pinned split-scroll: copy holds while the imagery column scrolls past. */
  useLayoutEffect(() => {
    if (!about) return undefined;
    const ctx = gsap.context((self) => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: '(min-width: 861px)', reduce: '(prefers-reduced-motion: reduce)' }, (context) => {
        const { desktop, reduce } = context.conditions;
        const panels = self.selector(`.${s.splitPanel}`);
        if (!desktop || reduce || reduced) {
          gsap.fromTo(panels, { y: 40, autoAlpha: 0 }, {
            y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08, ease: EASE.editorial,
            scrollTrigger: { trigger: splitRef.current, start: 'top 80%', once: true },
          });
          return;
        }

        ScrollTrigger.create({
          trigger: splitRef.current,
          start: 'top 18%',
          end: 'bottom 82%',
          pin: self.selector(`.${s.splitSticky}`)[0],
          pinSpacing: false,
          invalidateOnRefresh: true,
        });

        panels.forEach((panel) => {
          gsap.fromTo(panel,
            { y: 70, autoAlpha: 0, clipPath: 'inset(8% 0% 8% 0% round 20px)' },
            {
              y: 0, autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0% round 20px)',
              duration: DUR.slow, ease: EASE.editorial,
              scrollTrigger: { trigger: panel, start: 'top 84%', once: true },
            });
        });
      });
      return () => mm.revert();
    }, splitRef);
    return () => ctx.revert();
  }, [about, reduced]);

  const skills = about?.skills ?? [];
  const half = Math.ceil(skills.length / 2);

  return (
    <>
      <section ref={introScope} className={`section ${s.intro}`}>
        <div className="shell">
          <SectionHeading
            as="h1"
            eyebrow="About"
            title={about?.aboutHeadline ?? ''}
            lead={about?.introStatement}
          />
          <div className={s.introGrid}>
            <figure className={s.portrait} data-reveal>
              <img src={about?.portrait ?? ''} alt={`${about?.name ?? ''}, portrait`} />
              <figcaption className="meta">{about?.name} — {about?.role}</figcaption>
            </figure>
            <div className={s.introCopy}>
              <p className={`bodyLg ${s.introLead}`} data-reveal>{about?.heroSub}</p>
              <p className={s.locationLine} data-reveal>{about?.location}</p>
              <p className={s.personal} data-reveal>{about?.personalNote}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Philosophy ---- */}
      <section ref={philosophyScope} className={`section ${s.philosophy}`}>
        <div className="shell">
          <SectionHeading eyebrow="Approach" title="Four positions I keep arguing for." />
          <ul className={s.philosophyGrid}>
            {(about?.philosophy ?? []).map((item, i) => (
              <li key={item.title} className={s.philosophyCard} data-reveal>
                <span className={s.philosophyIndex}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className="h4">{item.title}</h3>
                <p className={s.philosophyBody}>{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- Pinned split scroll ---- */}
      <section ref={splitRef} className={`section ${s.split}`}>
        <div className={`shell ${s.splitInner}`}>
          <div className={s.splitSticky}>
            <p className="eyebrow">In practice</p>
            <h2 className={`h2 ${s.splitTitle}`}>What the work actually looks like on a Wednesday.</h2>
            <p className="prose">
              Less craft ritual than people expect, more time spent in rooms where the software is being
              worked around. These are the artefacts that come out of it.
            </p>
          </div>
          <div className={s.splitScroller}>
            {(about?.capabilities ?? []).slice(0, 4).map((cap) => (
              <article key={cap.title} className={s.splitPanel}>
                <h3 className="h3">{cap.title}</h3>
                <p className={s.splitBody}>{cap.body}</p>
                <ul className={s.splitList}>
                  {cap.deliverables.map((d) => <li key={d}>{d}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Career timeline ---- */}
      <section ref={timelineRef} className={`section ${s.timeline}`}>
        <div className="shell">
          <SectionHeading eyebrow="Career" title="Ten years, four rooms." />
          <div className={s.timelineWrap}>
            <span className={s.timelineLine} aria-hidden="true" />
            <ol className={s.timelineList}>
              {(about?.timeline ?? []).map((entry) => (
                <li key={entry.period} className={s.timelineRow}>
                  <span className={s.timelineDot} aria-hidden="true" />
                  <span className={s.period}>{entry.period}</span>
                  <div className={s.timelineBody}>
                    <h3 className="h4">{entry.role}</h3>
                    <p className={s.org}>{entry.org}</p>
                    <p className={s.note}>{entry.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
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
