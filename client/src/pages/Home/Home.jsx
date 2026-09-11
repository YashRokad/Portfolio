import { useOutletContext } from 'react-router-dom';
import Hero from '../../components/Hero/Hero';
import FeaturedWork from '../../components/FeaturedWork/FeaturedWork';
import DesignShots from '../../components/DesignShots/DesignShots';
import Capabilities from '../../components/Capabilities/Capabilities';
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
  const { data: shots } = useResource('shots', api.getShots);
  usePageTitle(about ? `${about.name} — ${about.role}` : 'Product Designer');

  const processScope = useReveal({ stagger: 0.06, y: 36 });
  const statsScope = useReveal({ stagger: 0.08, y: 28 });
  const teaserScope = useReveal({ stagger: 0.06, y: 36 });

  const featured = (projects ?? [])[0] ?? null;

  return (
    <>
      <Hero
        wordmark={about?.wordmark ?? about?.name ?? ''}
        statement={about?.heroHeadline ?? ''}
        sub={about?.heroSub ?? ''}
        tags={(about?.capabilities ?? []).map((c) => c.title)}
        play={Boolean(about)}
      />

      {/* ---- Design shots ---- */}
      <DesignShots
        shots={shots ?? []}
        eyebrow="Design shots"
        title="Brand, systems and environmental work — pieces rather than case studies."
      />

      {/* ---- Selected work ---- */}
      <FeaturedWork project={featured} totalCount={(projects ?? []).length} />

      {/* ---- Capabilities ---- */}
      <Capabilities
        items={about?.capabilities ?? []}
        eyebrow="What I do"
        title="Six things, and what you get from each."
      />

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
