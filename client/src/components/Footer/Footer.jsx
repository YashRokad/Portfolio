import { useReveal } from '../../hooks/useReveal';
import TransitionLink from '../Transition/TransitionLink';
import s from './Footer.module.css';

const MENU = [
  { to: '/', label: 'Home' },
  { to: '/work', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Footer({ about }) {
  const scope = useReveal({ stagger: 0.06, y: 28, deps: [about?.name] });

  const footer = about?.footer ?? {};
  const socials = about?.contact?.socials ?? [];
  const name = about?.name ?? 'Yash Rokad';

  return (
    <footer ref={scope} className={s.footer}>
      <div className={`shell ${s.inner}`}>
        <div className={s.left}>
          <TransitionLink to="/" className={s.wordmark} data-reveal>
            <span className={s.mark} aria-hidden="true" />
            {name}
          </TransitionLink>

          <ul className={s.contacts} data-reveal>
            {(footer.contacts ?? []).map((c) => (
              <li key={c.label}>
                <p className={s.colLabel}>{c.label}</p>
                <a className={s.contactValue} href={`mailto:${c.value}`}>{c.value}</a>
              </li>
            ))}
          </ul>
        </div>

        <nav className={s.cols} aria-label="Footer">
          <div className={s.col} data-reveal>
            <p className={s.colLabel}>Menu</p>
            <ul>
              {MENU.map((item) => (
                <li key={item.to}>
                  <TransitionLink to={item.to} className={s.link}>{item.label}</TransitionLink>
                </li>
              ))}
            </ul>
          </div>

          <div className={s.col} data-reveal>
            <p className={s.colLabel}>Social</p>
            <ul>
              {socials.map((soc) => (
                <li key={soc.label}>
                  <a className={s.link} href={soc.href} target="_blank" rel="noreferrer noopener">
                    {soc.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      {/* Oversized wordmark, sunk into the base of the page. */}
      <p className={s.watermark} aria-hidden="true">{name}</p>
    </footer>
  );
}
