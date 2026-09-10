import { useOutletContext } from 'react-router-dom';
import Hero from '../../components/Hero/Hero';
import WorkList from '../../components/WorkList/WorkList';
import SectionHeading from '../../components/SectionHeading/SectionHeading';
import Stat from '../../components/Stat/Stat';
import Testimonials from '../../components/Testimonials/Testimonials';
import CtaBanner from '../../components/CtaBanner/CtaBanner';
import Marquee from '../../components/Marquee/Marquee';
import TransitionLink from '../../components/Transition/TransitionLink';
import Magnetic from '../../components/Magnetic/Magnetic';
import { useReveal } from '../../hooks/useReveal';
import { api } from '../../data-client/api';
import { useResource } from '../../data-client/useApi';
import usePageTitle from '../../hooks/usePageTitle';
import s from './Home.module.css';

export default function Home() {
  const { about } = useOutletContext();
  const { data: projects } = useResource('projects', api.getProjects);
  const { data: testimonials } = useResource('testimonials', api.getTestimonials);
  usePageTitle(about ? `${about.name} — ${about.role}` : 'Product Designer');

  const capabilitiesScope = useReveal({ stagger: 0.07, y: 44 });
  const processScope = useReveal({ stagger: 0.06, y: 36 });
  const statsScope = useReveal({ stagger: 0.08, y: 28 });
  const teaserScope = useReveal({ stagger: 0.06, y: 36 });

  const featured = (projects ?? []).slice(0, 4);

  return (
    <>
      <Hero
        headline={about?.heroHeadline ?? ''}
        sub={about?.heroSub ?? ''}
        role={about?.role ?? ''}
        location={about?.location ?? ''}
        play={Boolean(about)}
      />

      {/* ---- Selected work ---- */}
      <section id="selected-work" className={`section ${s.work}`}>
        <div className="shell">
          <div className={s.workHead}>
            <SectionHeading
              eyebrow="Selected work"
              title="Four systems people could not walk away from."
              lead="Each one shipped, measured, and still running. Hover a row to see it."
            />
            <TransitionLink to="/work" className={s.allLink}>
              All projects
              <span aria-hidden="true">→</span>
            </TransitionLink>
          </div>
          <WorkList projects={featured} />
        </div>
      </section>

      {/* ---- Capabilities ---- */}
      <section ref={capabilitiesScope} className={`section ${s.caps}`}>
        <div className="shell">
          <SectionHeading
            eyebrow="What I do"
            title="Six things, and the deliverables that come with them."
          />
          <ul className={s.capGrid}>
            {(about?.capabilities ?? []).map((cap, i) => (
              <li key={cap.title} className={s.capCard} data-reveal>
                <span className={s.capIndex}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className="h4">{cap.title}</h3>
                <p className={s.capBody}>{cap.body}</p>
                <ul className={s.capList}>
                  {cap.deliverables.map((d) => <li key={d}>{d}</li>)}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- Skills marquee ---- */}
      <div className={s.skillsStrip} aria-hidden="true">
        <Marquee items={about?.skills ?? []} speed={38} separator="/" />
      </div>

      {/* ---- Process ---- */}
      <section ref={processScope} className={`section ${s.process}`}>
        <div className="shell">
          <SectionHeading eyebrow="How the work goes" title="Five steps, in this order, every time." />
          <ol className={s.processList}>
            {(about?.process ?? []).map((step) => (
              <li key={step.step} className={s.processRow} data-reveal>
                <span className={s.processStep}>{step.step}</span>
                <h3 className={`h4 ${s.processTitle}`}>{step.title}</h3>
                <p className={s.processBody}>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- Proof strip ---- */}
      <section ref={statsScope} className={`section ${s.proof}`}>
        <div className="shell">
          <p className="eyebrow" data-reveal>By the numbers</p>
          <div className={s.statGrid}>
            {(about?.stats ?? []).map((stat) => (
              <div key={stat.label} data-reveal>
                <Stat {...stat} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Testimonials ---- */}
      <section className={`section ${s.voices}`}>
        <div className="shell">
          <SectionHeading eyebrow="In their words" title="What the people who hired me say." />
          <div className={s.voicesBody}>
            <Testimonials items={testimonials ?? []} />
          </div>
        </div>
      </section>

      {/* ---- About teaser ---- */}
      <section ref={teaserScope} className={`section ${s.teaser}`}>
        <div className="shell">
          <div className={s.teaserInner}>
            <figure className={s.portrait} data-reveal>
              <img src={about?.portrait ?? ''} alt={`${about?.name ?? 'Designer'}, portrait`} loading="lazy" />
            </figure>
            <div className={s.teaserCopy}>
              <p className="eyebrow" data-reveal>About</p>
              <p className={`bodyLg ${s.teaserLead}`} data-reveal>{about?.introStatement}</p>
              <p className={s.teaserNote} data-reveal>{about?.personalNote}</p>
              <div data-reveal>
                <Magnetic strength={0.35}>
                  <TransitionLink to="/about" className={s.teaserLink} data-cursor="read" data-cursor-label="Read">
                    More about how I work
                    <span aria-hidden="true">→</span>
                  </TransitionLink>
                </Magnetic>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        eyebrow="Next"
        title={about?.closingCta?.line ?? ''}
        body={about?.availability?.detail}
        action={about?.closingCta?.action ?? 'Start a conversation'}
      />
    </>
  );
}
