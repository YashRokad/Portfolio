import { useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ProjectHero from './parts/ProjectHero';
import JourneyMap from './parts/JourneyMap';
import Gallery from './parts/Gallery';
import PersonaCard from './parts/PersonaCard';
import AuditTable from './parts/AuditTable';
import ImageBand from './parts/ImageBand';
import ScrollProgress from '../../components/ScrollProgress/ScrollProgress';
import Stat from '../../components/Stat/Stat';
import TransitionLink from '../../components/Transition/TransitionLink';
import Magnetic from '../../components/Magnetic/Magnetic';
import { useReveal } from '../../hooks/useReveal';
import { api } from '../../data-client/api';
import { useResource } from '../../data-client/useApi';
import usePageTitle from '../../hooks/usePageTitle';
import s from './ProjectDetail.module.css';

/** Section eyebrow: the number and the name, used identically everywhere. */
function Marker({ n, children }) {
  return (
    <p className={s.marker}>
      <span className={s.markerNum}>{n}</span>
      {children}
    </p>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const articleRef = useRef(null);
  const loader = useCallback(() => api.getProject(slug), [slug]);
  const { data: project, error, loading } = useResource(`project:${slug}`, loader);
  const ready = Boolean(project);
  usePageTitle(project ? `${project.title} — Case study` : 'Case study');

  const aboutScope = useReveal({ stagger: 0.07, y: 40, deps: [slug, ready] });
  const metricsScope = useReveal({ stagger: 0.1, y: 44, deps: [slug, ready] });
  const researchScope = useReveal({ stagger: 0.07, y: 40, deps: [slug, ready] });
  const painScope = useReveal({ stagger: 0.09, y: 46, deps: [slug, ready] });
  const auditScope = useReveal({ stagger: 0.08, y: 30, deps: [slug, ready] });
  const personaScope = useReveal({ stagger: 0.12, y: 48, deps: [slug, ready] });
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
  const bands = project.bands ?? {};

  return (
    <article ref={articleRef} className={s.root} style={{ '--p-accent': accent }}>
      <ProjectHero project={project} />
      <ScrollProgress targetRef={articleRef} accent={accent} />

      {/* ---------------------------------------------- 02 About project */}
      <section ref={aboutScope} id="about" className={s.about}>
        <div className={`shell ${s.aboutGrid}`}>
          <div className={s.aboutSide} data-reveal>
            <Marker n="02">About the project</Marker>
            <dl className={s.aboutFacts}>
              <div><dt>Client</dt><dd>{project.client}</dd></div>
              <div><dt>Year</dt><dd>{project.year}</dd></div>
              <div><dt>Sector</dt><dd>{project.industry}</dd></div>
            </dl>
          </div>
          <p className={s.aboutLead} data-reveal>{project.about}</p>
        </div>
      </section>

      <ImageBand src={bands.about} caption={bands.aboutCaption} accent={accent} />

      {/* -------------------------------------------- 03 Impact metrics */}
      <section ref={metricsScope} id="metrics" className={s.metrics}>
        <span className={s.metricsGlow} aria-hidden="true" />
        <div className="shell">
          <Marker n="03">Impact</Marker>
          <div className={s.metricGrid}>
            {project.metrics.map((metric) => (
              <div key={metric.label} className={s.metricCell} data-reveal>
                <Stat {...metric} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------ 04 User problem & research */}
      <section ref={researchScope} id="research" className={s.research}>
        <div className="shell">
          <div className={s.researchTop}>
            <Marker n="04">User problem &amp; research</Marker>
            <p className={s.researchIntro} data-reveal>{project.research.intro}</p>
          </div>

          <ul className={s.methods}>
            {project.research.methods.map((m, i) => (
              <li key={m.name} className={s.method} data-reveal>
                <span className={s.methodNum}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className={s.methodName}>{m.name}</h3>
                <p className={s.methodDetail}>{m.detail}</p>
              </li>
            ))}
          </ul>
        </div>

        <blockquote className={s.insight} data-reveal>
          <div className="shell">
            <p className={s.insightLabel}>The finding everything turned on</p>
            <p className={s.insightText}>{project.research.insight}</p>
            <footer className={s.insightFoot}>{project.research.insightAttribution}</footer>
          </div>
        </blockquote>
      </section>

      {/* ------------------------------------------------ 05 Pain points */}
      <section ref={painScope} id="pain-points" className={s.pain}>
        <div className="shell">
          <Marker n="05">Pain points</Marker>
          <ul className={s.painList}>
            {project.painPoints.map((point, i) => (
              <li key={point.label} className={s.painRow} data-reveal>
                <span className={s.painIndex}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className={s.painLabel}>{point.label}</h3>
                <p className={s.painDetail}>{point.detail}</p>
                {point.evidence && <p className={s.painEvidence}>{point.evidence}</p>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ImageBand src={bands.problem} caption={bands.problemCaption} height="short" accent={accent} />

      {/* ------------------------------------------ 06 Competitive audit */}
      <section ref={auditScope} id="audit" className={s.audit}>
        <div className="shell">
          <Marker n="06">Competitive audit</Marker>
          <AuditTable audit={project.competitiveAudit} accent={accent} />
        </div>
      </section>

      {/* ---------------------------------------------- 07 User personas */}
      <section ref={personaScope} id="personas" className={s.personas}>
        <div className="shell">
          <Marker n="07">Who this is for</Marker>
          <div className={s.personaGrid}>
            {project.personas.map((persona) => (
              <div key={persona.name} data-reveal>
                <PersonaCard persona={persona} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------- 08 User journey map */}
      <JourneyMap journey={project.journey} accent={accent} />

      {/* -------------------------------------------------- 09 Solutions */}
      <section ref={solutionScope} id="solutions" className={s.solutions}>
        <div className="shell">
          <Marker n="09">Solutions</Marker>
          <p className={s.solutionsLead} data-reveal>
            Each one answers a problem named above — nothing here was added because it was interesting.
          </p>

          <ol className={s.solutionList}>
            {project.solutions.map((sol, i) => (
              <li key={sol.name} className={s.solution} data-reveal>
                <div className={s.solutionProblem}>
                  <span className={s.solutionTag}>Problem</span>
                  <p>{sol.resolves}</p>
                </div>
                <span className={s.solutionArrow} aria-hidden="true" />
                <div className={s.solutionAnswer}>
                  <span className={s.solutionNum}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 className={s.solutionName}>{sol.name}</h3>
                  <p className={s.solutionDetail}>{sol.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ImageBand src={bands.solution} caption={bands.solutionCaption} accent={accent} />

      {/* ---------------------------------------------- 10 Visual design */}
      <section ref={visualScope} id="visual" className={s.visual}>
        <div className={`shell ${s.visualGrid}`}>
          <Marker n="10">Visual design</Marker>
          <p className={s.visualStatement} data-reveal>{project.visualDesign.statement}</p>
        </div>
        <div className={s.galleryWrap}>
          <div className="shell">
            <Gallery gallery={project.visualDesign.gallery} title={project.title} accent={accent} />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------- 11 Next project */}
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
                <Marker n="11">Next project</Marker>
                <h2 className={s.nextTitle} data-reveal>{project.next.title}</h2>
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
