import s from './PageAtmosphere.module.css';

/** Ambient colour wash for interior page heroes. Purely decorative. */
export default function PageAtmosphere({ strength }) {
  return (
    <div
      className={s.root}
      aria-hidden="true"
      style={strength ? { '--atmos-strength': strength } : undefined}
    >
      <div className={s.mesh}>
        <span className={s.bloom} data-bloom="green" />
        <span className={s.bloom} data-bloom="magenta" />
        <span className={s.bloom} data-bloom="ember" />
      </div>
      <span className={s.arc} />
      <div className={s.scrim} />
    </div>
  );
}
