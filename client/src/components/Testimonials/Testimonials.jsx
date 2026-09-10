import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, DUR, EASE } from '../../animations/gsapConfig';
import { splitText } from '../../animations/splitText';
import { useMotion } from '../../hooks/useMotionPreference';
import s from './Testimonials.module.css';

/**
 * Avatar-dot driven testimonial swap. Selecting a dot wipes the outgoing
 * quote out by word and brings the incoming one in from below.
 */
export default function Testimonials({ items = [] }) {
  const [active, setActive] = useState(0);
  const quoteRef = useRef(null);
  const attrRef = useRef(null);
  const root = useRef(null);
  const { reduced } = useMotion();
  const first = useRef(true);

  useLayoutEffect(() => {
    if (!items.length) return undefined;
    let split;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.fromTo([quoteRef.current, attrRef.current], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 });
        return;
      }
      split = splitText(quoteRef.current, { chars: false });
      gsap.fromTo(split.words,
        { yPercent: 110, autoAlpha: 0 },
        {
          yPercent: 0, autoAlpha: 1,
          duration: DUR.slow, ease: EASE.editorial, stagger: 0.022,
          delay: first.current ? 0 : 0.05,
        });
      gsap.fromTo(attrRef.current,
        { y: 18, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: DUR.standard, delay: 0.18 });
      first.current = false;
    }, root);
    return () => { ctx.revert(); split?.revert?.(); };
  }, [active, reduced, items]);

  if (!items.length) return null;
  const current = items[active];

  return (
    <div ref={root} className={s.root} style={{ '--t-accent': current.accent }}>
      <blockquote className={s.quoteWrap}>
        <span className={s.mark} aria-hidden="true">&ldquo;</span>
        <p ref={quoteRef} className={s.quote} key={current.id}>{current.quote}</p>
        <footer ref={attrRef} className={s.attr}>
          <cite className={s.name}>{current.name}</cite>
          <span className="meta">{current.role} · {current.org}</span>
        </footer>
      </blockquote>

      <div className={s.dots} role="tablist" aria-label="Testimonials">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`${item.name}, ${item.org}`}
            className={s.dot}
            data-active={i === active || undefined}
            style={{ '--dot-accent': item.accent }}
            onClick={() => setActive(i)}
          >
            <span aria-hidden="true">{item.initials}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
