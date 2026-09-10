import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '../../../animations/gsapConfig';
import { scrollToEl } from '../../../hooks/useSmoothScroll';
import s from './SectionRail.module.css';

/**
 * Chapter progress along the right edge. A tick per section, the label
 * revealed only on hover or when active — deliberately not a table of
 * contents, which is what made the page read like documentation.
 */
export default function SectionRail({ sections = [], accent }) {
  const [active, setActive] = useState(sections[0]?.id);
  const root = useRef(null);

  useLayoutEffect(() => {
    if (!sections.length) return undefined;
    const ctx = gsap.context(() => {
      const triggers = sections.map((section) => {
        const el = document.getElementById(section.id);
        if (!el) return null;
        return ScrollTrigger.create({
          trigger: el,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: (self) => self.isActive && setActive(section.id),
        });
      }).filter(Boolean);
      return () => triggers.forEach((t) => t.kill());
    }, root);
    return () => ctx.revert();
  }, [sections]);

  if (!sections.length) return null;

  return (
    <nav ref={root} className={s.root} aria-label="Case study sections" style={{ '--p-accent': accent }}>
      <ol className={s.list}>
        {sections.map((section, i) => (
          <li key={section.id}>
            <button
              type="button"
              className={s.item}
              data-active={active === section.id || undefined}
              aria-current={active === section.id ? 'true' : undefined}
              onClick={() => scrollToEl(document.getElementById(section.id))}
            >
              <span className={s.label}>{section.label}</span>
              <span className={s.num}>{String(i + 1).padStart(2, '0')}</span>
              <span className={s.tick} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
