import { useCountUp } from '../../hooks/useCountUp';
import s from './Stat.module.css';

/** A single kinetic metric: scramble-counts into place on scroll. */
export default function Stat({ value, prefix = '', suffix = '', decimals = 0, label, note, size = 'md' }) {
  const ref = useCountUp(value, { prefix, suffix, decimals });
  const readable = `${prefix}${Number(value).toFixed(decimals)}${suffix}`;

  return (
    <div className={s.root} data-size={size}>
      <p className={s.value}>
        <span ref={ref} aria-hidden="true" />
        <span className="visuallyHidden">{readable}</span>
      </p>
      <p className={s.label}>{label}</p>
      {note && <p className={s.note}>{note}</p>}
    </div>
  );
}
