import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ProjectHero from './parts/ProjectHero';
import SectionRail from './parts/SectionRail';
import JourneyMap from './parts/JourneyMap';
import Gallery from './parts/Gallery';
import PersonaCard from './parts/PersonaCard';
import Stat from '../../components/Stat/Stat';
import TransitionLink from '../../components/Transition/TransitionLink';
import Magnetic from '../../components/Magnetic/Magnetic';
import { useReveal } from '../../hooks/useReveal';
import { api } from '../../data-client/api';
import { useResource } from '../../data-client/useApi';
import usePageTitle from '../../hooks/usePageTitle';
import s from './ProjectDetail.module.css';

/** The rail mirrors the eleven required case-study sections, in order. */
const SECTIONS = [
  { id: 'overview', label: 'Project title' },
  { id: 'about', label: 'About project' },
  { id: 'metrics', label: 'Impact metrics' },
  { id: 'research', label: 'User problem' },
  { id: 'pain-points', label: 'Pain points' },
  { id: 'audit', label: 'Competitive audit' },
  { id: 'personas', label: 'User personas' },
  { id: 'journey', label: 'User journey map' },
  { id: 'solutions', label: 'Solutions' },
  { id: 'visual', label: 'Visual design' },
  { id: 'next', label: 'Next project' },
];

export default function ProjectDetail() {
  const { slug } = useParams();
  const loader = useCallback(() => api.getProject(slug), [slug]);
  const { data: project, error, loading } = useResource(`project:${slug}`, loader);
  const ready = Boolean(project);
  usePageTitle(project ? `${project.title} — Case study` : 'Case study');

  const aboutScope = useReveal({ stagger: 0.07, y: 40, deps: [slug, ready] });
  const metricsScope = useReveal({ stagger: 0.08, y: 34, deps: [slug, ready] });
  const researchScope = useReveal({ stagger: 0.07, y: 40, deps: [slug, ready] });
  const painScope = useReveal({ stagger: 0.09, y: 46, deps: [slug, ready] });
  const auditScope = useReveal({ stagger: 0.08, y: 40, deps: [slug, ready] });
  const personaScope = useReveal({ stagger: 0.1, y: 44, deps: [slug, ready] });
  const solutionScope = useReveal({ stagger: 0.09, y: 44, deps: [slug, ready] });
  const visualScope = useReveal({ stagger: 0.07, y: 36, deps: [slug, ready] });
  const nextScope = useReveal({ stagger: 0.06, y: 32, deps: [slug, ready] });

  if (loading) {
    return <div className={`shell ${s.state}`}><p className="meta">Loading case study…</p></div>;
  }
  if (error || !project) {
    return (
      <div className={`shell ${s.state}`}>
        <h1 className="h2">That case study is not here.</h1>
        <p className="prose">The link may be out of date. The full list is one click away.</p>
        <TransitionLink to="/work" className={s.stateLink}>Back to all work →</TransitionLink>
      </div>
    );
  }

  const accent = project.accent;

  return (
    <article className={s.root} style={{ '--p-accent': accent }}>
      <ProjectHero project={project} />

      <div className={`shell ${s.body}`}>
        <SectionRail sections={SECTIONS} accent={accent} />

        <div className={s.content}>
          {/* 2 — About project */}
          <section ref={aboutScope} id="about" className={s.section}>
            <p className="eyebrow" data-reveal>02 — About the project</p>
            <p className={`bodyLg ${s.aboutLead}`} data-reveal>{project.about}</p>
            <p className={`meta ${s.client}`} data-reveal>Client — {project.client}</p>
          </section>

          {/* 3 — Impact metrics */}
          <section ref={metricsScope} id="metrics" className={s.section}>
            <p className="eyebrow" data-reveal>03 — Impact metrics</p>
            <div className={s.metricGrid}>
              {project.metrics.map((metric) => (
                <div key={metric.label} data-reveal className={s.metricCard}>
                  <Stat {...metric} size="sm" />
                </div>
              ))}
            </div>
          </section>

          {/* 4 — User problem / research */}
          <section ref={researchScope} id="research" className={s.section}>
            <p className="eyebrow" data-reveal>04 — User problem &amp; research</p>
            <p className={`prose ${s.researchIntro}`} data-reveal>{project.research.intro}</p>
            <ul className={s.methods}>
              {project.research.methods.map((m) => (
                <li key={m.name} className={s.method} data-reveal>
                  <h3 className={s.methodName}>{m.name}</h3>
                  <p className={s.methodDetail}>{m.detail}</p>
                </li>
              ))}
            </ul>
            <blockquote className={s.insight} data-reveal>
              <p className={s.insightText}>{project.research.insight}</p>
              <footer className="meta">{project.research.insightAttribution}</footer>
            </blockquote>
          </section>

          {/* 5 — Pain points */}
          <section ref={painScope} id="pain-points" className={s.section}>
            <p className="eyebrow" data-reveal>05 — Pain points</p>
            <ul className={s.painGrid}>
              {project.painPoints.map((pain, i) => (
                <li key={pain.label} className={s.painCard} data-reveal>
                  <span className={s.painIndex}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="h4">{pain.label}</h3>
                  <p className={s.painDetail}>{pain.detail}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* 6 — Competitive audit */}
          <section ref={auditScope} id="audit" className={s.section}>
            <p className="eyebrow" data-reveal>06 — Competitive audit</p>
            <ul className={s.auditList}>
              {project.competitiveAudit.competitors.map((c) => (
                <li key={c.name} className={s.auditRow} data-reveal>
                  <h3 className={`h4 ${s.auditName}`}>{c.name}</h3>
                  <p className={s.auditVerdict}>{c.verdict}</p>
                </li>
              ))}
            </ul>
            <div className={s.whitespace} data-reveal>
              <p className="eyebrow">Whitespace opportunity</p>
              <p className={s.whitespaceText}>{project.competitiveAudit.whitespace}</p>
            </div>
          </section>

          {/* 7 — User personas */}
          <section ref={personaScope} id="personas" className={s.section}>
            <p className="eyebrow" data-reveal>07 — User personas</p>
            <div className={s.personaGrid}>
              {project.personas.map((persona) => (
                <div key={persona.name} data-reveal>
                  <PersonaCard persona={persona} accent={accent} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* 8 — User journey map (full-bleed, pinned) */}
      <JourneyMap journey={project.journey} accent={accent} />

      <div className={`shell ${s.body}`}>
        <div className={s.railSpacer} aria-hidden="true" />
        <div className={s.content}>
          {/* 9 — Solutions */}
          <section ref={solutionScope} id="solutions" className={s.section}>
            <p className="eyebrow" data-reveal>09 — Solutions</p>
            <ol className={s.solutionList}>
              {project.solutions.map((sol, i) => (
                <li key={sol.name} className={s.solution} data-reveal>
                  <span className={s.solutionIndex}>{String(i + 1).padStart(2, '0')}</span>
                  <div className={s.solutionBody}>
                    <h3 className="h3">{sol.name}</h3>
                    <p className={s.resolves}>
                      <span className={s.resolvesLabel}>Resolves</span>
                      {sol.resolves}
                    </p>
                    <p className={s.solutionDetail}>{sol.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>

      {/* 10 — Visual design */}
      <section ref={visualScope} id="visual" className={`section ${s.visual}`}>
        <div className="shell">
          <p className="eyebrow" data-reveal>10 — Visual design</p>
          <p className={`bodyLg ${s.visualStatement}`} data-reveal>{project.visualDesign.statement}</p>
        </div>
        <div className={s.galleryWrap}>
          <div className="shell">
            <Gallery gallery={project.visualDesign.gallery} title={project.title} accent={accent} />
          </div>
        </div>
      </section>

      {/* 11 — Next project */}
      <section ref={nextScope} id="next" className={s.next}>
        <TransitionLink
          to={`/work/${project.next.slug}`}
          className={s.nextLink}
          data-cursor="view"
          data-cursor-label="Next"
        >
          <div className="shell">
            <div className={s.nextInner}>
              <div className={s.nextCopy}>
                <p className="eyebrow" data-reveal>11 — Next project</p>
                <h2 className={`h2 ${s.nextTitle}`} data-reveal>{project.next.title}</h2>
                <p className={s.nextTagline} data-reveal>{project.next.tagline}</p>
                <div data-reveal>
                  <Magnetic strength={0.3}>
                    <span className={s.nextAction}>Read the case study →</span>
                  </Magnetic>
                </div>
              </div>
              <figure className={s.nextFigure} data-reveal>
                <img src={project.next.cover} alt="" loading="lazy" />
              </figure>
            </div>
          </div>
        </TransitionLink>
      </section>
    </article>
  );
}
