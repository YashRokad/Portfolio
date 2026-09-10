import s from './PersonaCard.module.css';

/**
 * Section 7 — a persona led by what the person actually said, with goals and
 * frustrations set against each other in two columns so the tension between
 * what they want and what stops them is readable at a glance. Nothing is
 * collapsed; the whole persona is on the page.
 */
export default function PersonaCard({ persona }) {
  const goals = persona.goals ?? (persona.goal ? [persona.goal] : []);
  const frustrations = persona.frustrations ?? (persona.frustration ? [persona.frustration] : []);
  const pairs = Math.max(goals.length, frustrations.length);

  return (
    <article className={s.root}>
      <header className={s.head}>
        <span className={s.avatar} aria-hidden="true">
          {persona.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
        </span>
        <div>
          <h3 className={s.name}>{persona.name}</h3>
          <p className={s.role}>
            {[persona.role, persona.company, persona.region].filter(Boolean).join(' · ')}
          </p>
        </div>
      </header>

      <blockquote className={s.quote}>{persona.quote}</blockquote>

      <div className={s.compare}>
        <div className={s.compareHead}>
          <span data-kind="goal">What they want</span>
          <span data-kind="pain">What stops them</span>
        </div>

        {Array.from({ length: pairs }, (_, i) => (
          <div className={s.pair} key={i}>
            <p className={s.want}>{goals[i] ?? <span className={s.empty}>—</span>}</p>
            <p className={s.block}>{frustrations[i] ?? <span className={s.empty}>—</span>}</p>
          </div>
        ))}
      </div>

      {persona.note && <p className={s.note}>{persona.note}</p>}
    </article>
  );
}
