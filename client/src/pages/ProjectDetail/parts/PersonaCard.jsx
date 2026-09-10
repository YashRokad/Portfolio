import s from './PersonaCard.module.css';

/**
 * Section 7 — a persona as a portrait and a statement: the photograph carries
 * the identity plate, the quote gets set at size beside it, and goals sit
 * directly against frustrations so the tension between what they want and what
 * stops them reads line by line. Nothing is collapsed.
 */
export default function PersonaCard({ persona }) {
  const goals = persona.goals ?? (persona.goal ? [persona.goal] : []);
  const frustrations = persona.frustrations ?? (persona.frustration ? [persona.frustration] : []);
  const pairs = Math.max(goals.length, frustrations.length);
  const facts = [persona.company, persona.tech && `Tech comfort: ${persona.tech}`].filter(Boolean);

  return (
    <article className={s.root}>
      <figure className={s.portrait}>
        {persona.photo && <img src={persona.photo} alt={`${persona.name}, portrait`} loading="lazy" />}
        <figcaption className={s.plate}>
          <span className={s.name}>
            {persona.name}
            {persona.role && <span className={s.role}>{persona.role}</span>}
          </span>
          {persona.region && <span className={s.region}>{persona.region}</span>}
        </figcaption>
      </figure>

      <div className={s.side}>
        <blockquote className={s.quote}>
          <span className={s.mark} aria-hidden="true">“</span>
          {persona.quote}
          <span className={s.mark} aria-hidden="true">”</span>
        </blockquote>

        {facts.length > 0 && (
          <p className={s.facts}>
            {facts.map((f) => <span key={f}>{f}</span>)}
          </p>
        )}

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
      </div>
    </article>
  );
}
