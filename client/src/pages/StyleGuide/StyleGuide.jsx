import usePageTitle from '../../hooks/usePageTitle';
import s from './StyleGuide.module.css';

/**
 * Phase 1 verification surface: renders every design token so regressions in
 * the token layer are visible rather than theoretical. Not linked from the
 * navigation — reachable at /styleguide.
 */
const COLORS = [
  '--bg-base', '--bg-elevated', '--bg-elevated-2', '--text-primary',
  '--text-secondary', '--text-tertiary', '--accent', '--accent-soft',
  '--border-subtle', '--border-strong', '--overlay-scrim',
  '--state-positive', '--state-caution', '--state-negative',
  '--tone-low', '--tone-mid', '--tone-neutral', '--tone-high',
];
const TYPE = [
  ['--fs-display', 'Display', 'var(--fw-black)'],
  ['--fs-h1', 'Heading 1', 'var(--fw-bold)'],
  ['--fs-h2', 'Heading 2', 'var(--fw-bold)'],
  ['--fs-h3', 'Heading 3', 'var(--fw-bold)'],
  ['--fs-h4', 'Heading 4', 'var(--fw-semibold)'],
  ['--fs-body-lg', 'Body large', 'var(--fw-regular)'],
  ['--fs-body', 'Body', 'var(--fw-regular)'],
  ['--fs-caption', 'Caption', 'var(--fw-regular)'],
  ['--fs-eyebrow', 'Eyebrow', 'var(--fw-semibold)'],
];
const SPACE = ['--sp-1', '--sp-2', '--sp-3', '--sp-4', '--sp-5', '--sp-6', '--sp-7', '--sp-8', '--sp-9', '--sp-10', '--sp-11'];
const MOTION = ['--dur-micro', '--dur-standard', '--dur-hero', '--ease-editorial', '--ease-snap'];

export default function StyleGuide() {
  usePageTitle('Style guide');
  return (
    <div className={`shell ${s.root}`}>
      <h1 className="display">Tokens</h1>

      <section className={s.block}>
        <h2 className="h3">Color</h2>
        <ul className={s.swatches}>
          {COLORS.map((token) => (
            <li key={token} className={s.swatch}>
              <span className={s.chip} style={{ background: `var(${token})` }} />
              <code>{token}</code>
            </li>
          ))}
        </ul>
      </section>

      <section className={s.block}>
        <h2 className="h3">Typography — Manrope only</h2>
        <ul className={s.typeList}>
          {TYPE.map(([token, label, weight]) => (
            <li key={token}>
              <span style={{ fontSize: `var(${token})`, fontWeight: weight, letterSpacing: 'var(--ls-heading)' }}>
                {label}
              </span>
              <code>{token}</code>
            </li>
          ))}
        </ul>
        <p className={s.weights}>
          {[300, 400, 500, 600, 700, 800].map((w) => (
            <span key={w} style={{ fontWeight: w }}>Manrope {w}&nbsp;&nbsp;</span>
          ))}
        </p>
      </section>

      <section className={s.block}>
        <h2 className="h3">Spacing</h2>
        <ul className={s.spaceList}>
          {SPACE.map((token) => (
            <li key={token}>
              <span className={s.bar} style={{ width: `var(${token})` }} />
              <code>{token}</code>
            </li>
          ))}
        </ul>
      </section>

      <section className={s.block}>
        <h2 className="h3">Motion</h2>
        <ul className={s.motionList}>
          {MOTION.map((token) => <li key={token}><code>{token}</code></li>)}
        </ul>
      </section>
    </div>
  );
}
