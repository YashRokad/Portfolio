import { useRef, useState } from 'react';
import { gsap, DUR, EASE } from '../../../animations/gsapConfig';
import { useMotion } from '../../../hooks/useMotionPreference';
import s from './PersonaCard.module.css';

/**
 * Section 7 — a persona led by what the person actually said. Role facts sit
 * as a compact ledger; goals and frustrations expand on demand so the card
 * stays scannable until someone wants the detail.
 */
export default function PersonaCard({ persona, accent }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef(null);
  const { reduced } = useMotion();

  const toggle = () => {
    const next = !open;
    setOpen(next);
    const body = bodyRef.current;
    if (!body) return;

    gsap.killTweensOf(body);
    if (reduced) {
      gsap.set(body, { height: next ? 'auto' : 0, autoAlpha: next ? 1 : 0 });
      return;
    }
    gsap.to(body, {
      height: next ? 'auto' : 0,
      autoAlpha: next ? 1 : 0,
      duration: DUR.standard,
      ease: EASE.editorial,
    });
    if (next) {
      gsap.fromTo(body.querySelectorAll('[data-persona-item]'),
        { y: 18, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: DUR.standard, ease: EASE.editorial, stagger: 0.06, delay: 0.08 });
    }
  };

  const goals = persona.goals ?? (persona.goal ? [persona.goal] : []);
  const frustrations = persona.frustrations ?? (persona.frustration ? [persona.frustration] : []);

  return (
    <article className={s.root} data-open={open || undefined} style={{ '--p-accent': accent }}>
      <blockquote className={s.quote}>{persona.quote}</blockquote>

      <div className={s.identity}>
        <span className={s.avatar} aria-hidden="true">
          {persona.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
        </span>
        <div>
          <h3 className={s.name}>{persona.name}</h3>
          <p className={s.role}>{persona.role}</p>
        </div>
      </div>

      <dl className={s.facts}>
        {persona.company && <div><dt>Company</dt><dd>{persona.company}</dd></div>}
        {persona.region && <div><dt>Region</dt><dd>{persona.region}</dd></div>}
        {persona.tech && <div><dt>Tech comfort</dt><dd>{persona.tech}</dd></div>}
      </dl>

      <button type="button" className={s.toggle} onClick={toggle} aria-expanded={open}>
        {open ? 'Hide goals and frustrations' : 'Goals and frustrations'}
        <span className={s.chev} aria-hidden="true" />
      </button>

      <div ref={bodyRef} className={s.body}>
        <div className={s.columns}>
          <section data-persona-item>
            <h4 className={s.colLabel} data-kind="goal">Goals</h4>
            <ul className={s.bullets}>
              {goals.map((g) => <li key={g}>{g}</li>)}
            </ul>
          </section>
          <section data-persona-item>
            <h4 className={s.colLabel} data-kind="pain">Frustrations</h4>
            <ul className={s.bullets}>
              {frustrations.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </section>
        </div>
        {persona.note && <p className={s.note} data-persona-item>{persona.note}</p>}
      </div>
    </article>
  );
}
