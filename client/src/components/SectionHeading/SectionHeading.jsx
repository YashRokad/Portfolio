import { useRef } from 'react';
import { useHeadlineReveal } from '../../hooks/useReveal';
import s from './SectionHeading.module.css';

/** Eyebrow + masked-line headline + optional supporting copy. */
export default function SectionHeading({ eyebrow, title, lead, align = 'start', as: Tag = 'h2' }) {
  const ref = useRef(null);
  useHeadlineReveal(ref, { chars: false });

  return (
    <header className={s.root} data-align={align}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Tag ref={ref} className={`h2 ${s.title}`}>{title}</Tag>
      {lead && <p className={`prose ${s.lead}`}>{lead}</p>}
    </header>
  );
}
