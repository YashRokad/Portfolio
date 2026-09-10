import { useRef, useState } from 'react';
import { gsap, DUR, EASE } from '../../../animations/gsapConfig';
import { useMotion } from '../../../hooks/useMotionPreference';
import s from './PersonaCard.module.css';

/**
 * Section 7 — a persona that expands to reveal the frustration and the quote.
 * The toggle is a real button so it is keyboard-reachable and announced.
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
      gsap.fromTo(body.children,
        { y: 18, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: DUR.standard, ease: EASE.editorial, stagger: 0.07, delay: 0.08 });
    }
  };

  return (
    <article className={s.root} data-open={open || undefined} style={{ '--p-accent': accent }}>
      <div className={s.head}>
        <span className={s.avatar} aria-hidden="true">
          {persona.name.split(' ').map((w) => w[0]).join('')}
        </span>
        <div>
          <h3 className="h4">{persona.name}</h3>
          <p className="meta">{persona.role}</p>
        </div>
      </div>

      <p className={s.goal}>
        <span className={s.goalLabel}>Goal</span>
        {persona.goal}
      </p>

      <button type="button" className={s.toggle} onClick={toggle} aria-expanded={open}>
        {open ? 'Hide detail' : 'What gets in the way'}
        <span className={s.chev} aria-hidden="true" />
      </button>

      <div ref={bodyRef} className={s.body}>
        <p className={s.frustration}>
          <span className={s.goalLabel}>Frustration</span>
          {persona.frustration}
        </p>
        <blockquote className={s.quote}>{persona.quote}</blockquote>
      </div>
    </article>
  );
}
