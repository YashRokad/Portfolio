import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, DUR, EASE, STAGGER, revealTrigger } from '../../animations/gsapConfig';
import { useMotion } from '../../hooks/useMotionPreference';
import s from './Capabilities.module.css';

/**
 * What I do — a ruled list rather than a card grid.
 *
 * Hovering a row lifts its name, colours its rule, expands its deliverable
 * tags and slides a portrait-format still into the gutter between the columns.
 * The still lives inside the section and is positioned from the row's own
 * offset, so it can never be stranded over other content. The tags stay in the
 * accessibility tree while collapsed, so nothing is hidden from a reader.
 */
export default function Capabilities({ items = [], eyebrow = 'What I do', title }) {
  const root = useRef(null);
  const listRef = useRef(null);
  const stillRef = useRef(null);
  const [active, setActive] = useState(null);
  const { reduced, touch } = useMotion();

  /* Rows arrive on scroll: rule wipes out from the left, name unmasks. */
  useLayoutEffect(() => {
    if (!items.length) return undefined;
    const ctx = gsap.context((self) => {
      const rows = self.selector(`.${s.row}`);
      const rules = self.selector(`.${s.rule}`);

      if (reduced) {
        gsap.fromTo(rows, { autoAlpha: 0 }, {
          autoAlpha: 1, duration: 0.4, stagger: 0.05, scrollTrigger: revealTrigger(root.current),
        });
        gsap.set(rules, { scaleX: 1 });
        return;
      }

      const tl = gsap.timeline({ scrollTrigger: revealTrigger(root.current, { start: 'top 76%' }) });
      tl.fromTo(rules,
        { scaleX: 0 },
        { scaleX: 1, duration: DUR.slow, ease: EASE.editorial, stagger: STAGGER.cards })
        .fromTo(rows,
          { y: 42, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: DUR.slow, ease: EASE.editorial, stagger: STAGGER.cards },
          '-=0.85');
    }, root);
    return () => ctx.revert();
  }, [items, reduced]);

  /* The still tracks the active row's centre and cross-fades its image. */
  useLayoutEffect(() => {
    const still = stillRef.current;
    if (!still || reduced || touch) return undefined;

    const ctx = gsap.context(() => {
      if (active === null) {
        gsap.to(still, {
          autoAlpha: 0, scale: 0.92, duration: DUR.quick, ease: EASE.snap, overwrite: 'auto',
        });
        return;
      }

      const row = listRef.current.children[active];
      const y = row.offsetTop + row.offsetHeight / 2 - still.offsetHeight / 2;

      gsap.to(still, {
        y, autoAlpha: 1, scale: 1,
        duration: DUR.standard, ease: EASE.editorial, overwrite: 'auto',
      });
      gsap.fromTo(still.querySelector('img'),
        { clipPath: 'inset(0% 0% 100% 0%)', scale: 1.14 },
        { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 0.66, ease: EASE.curtain });
    }, root);

    return () => ctx.revert();
  }, [active, reduced, touch]);

  if (!items.length) return null;
  const current = active === null ? items[0] : items[active];

  return (
    <section ref={root} className={`section ${s.root}`}>
      <div className="shell">
        <header className={s.head}>
          <p className="eyebrow">{eyebrow}</p>
          {title && <p className={s.title}>{title}</p>}
        </header>

        <div className={s.body}>
          <ul
            ref={listRef}
            className={s.list}
            onPointerLeave={() => setActive(null)}
          >
            {items.map((item, i) => (
              <li
                key={item.slug ?? item.title}
                className={s.row}
                data-active={active === i || undefined}
                style={{ '--cap-accent': item.accent }}
                onPointerEnter={() => setActive(i)}
              >
                <span className={s.rule} aria-hidden="true" />
                <h3 className={s.name}>
                  {item.title}
                  <span className={s.index}>{String(i + 1).padStart(2, '0')}</span>
                </h3>
                <div className={s.detail}>
                  <p className={s.blurb}>{item.body}</p>
                  <ul className={s.tags}>
                    {item.deliverables.map((d) => (
                      <li key={d} className={s.tag}>{d}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>

          <div ref={stillRef} className={s.still} aria-hidden="true">
            <img src={current.image} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}
