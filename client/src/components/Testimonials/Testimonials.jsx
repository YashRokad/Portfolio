import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, DUR, EASE } from '../../animations/gsapConfig';
import { splitText } from '../../animations/splitText';
import { useMotion } from '../../hooks/useMotionPreference';
import s from './Testimonials.module.css';

/**
 * Quote on the left, a ruled index of who said it on the right. Selecting a
 * name wipes the outgoing quote out by word and brings the incoming one in
 * from below.
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
    <div ref={root} className={s.root}>
      <blockquote className={s.quoteWrap}>
        <span className={s.mark} aria-hidden="true">&ldquo;</span>
        <p ref={quoteRef} className={s.quote} key={current.id}>{current.quote}</p>
        <footer ref={attrRef} className={s.attr}>
          <cite className={s.name}>{current.name}</cite>
          <span className={s.role}>{current.role} · {current.org}</span>
        </footer>
      </blockquote>

      <div className={s.index} role="tablist" aria-label="Testimonials">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={s.indexRow}
            data-active={i === active || undefined}
            onClick={() => setActive(i)}
          >
            <span className={s.indexNum} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <span className={s.indexName}>{item.name}</span>
            <span className={s.indexOrg}>{item.org}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
