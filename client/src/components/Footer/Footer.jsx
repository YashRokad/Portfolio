import { useRef, useState } from 'react';
import { gsap, DUR, EASE } from '../../animations/gsapConfig';
import { useMotion } from '../../hooks/useMotionPreference';
import { useReveal } from '../../hooks/useReveal';
import { api } from '../../data-client/api';
import Magnetic from '../Magnetic/Magnetic';
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
  const year = useRef(new Date().getFullYear()).current;

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

          <div className={s.newsletter} data-reveal>
            <p className={s.colLabel}>{footer.newsletterLabel ?? 'Newsletter'}</p>
            <p className={s.newsletterLine}>{footer.newsletterLine}</p>
            <SubscribeForm />
          </div>
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

          <div className={s.col} data-reveal>
            <p className={s.colLabel}>Location</p>
            <address className={s.address}>
              {(footer.location ?? [about?.location]).filter(Boolean).map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
          </div>

          <ul className={s.contacts}>
            {(footer.contacts ?? []).map((c) => (
              <li key={c.label} data-reveal>
                <p className={s.colLabel}>{c.label}</p>
                <a className={s.contactValue} href={`mailto:${c.value}`}>{c.value}</a>
              </li>
            ))}
          </ul>
        </nav>

        <p className={s.baseline} data-reveal>
          © {year} {name}. {footer.credit}
        </p>
      </div>

      {/* Oversized wordmark, sunk into the base of the page. */}
      <p className={s.watermark} aria-hidden="true">{name}</p>
    </footer>
  );
}

/* ------------------------------------------------------------------ form */

function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | done | error
  const [error, setError] = useState(null);
  const ruleRef = useRef(null);
  const { reduced } = useMotion();

  const focusRule = (on) => {
    if (!ruleRef.current) return;
    if (reduced) { gsap.set(ruleRef.current, { scaleX: on ? 1 : 0 }); return; }
    gsap.to(ruleRef.current, {
      scaleX: on ? 1 : 0,
      transformOrigin: on ? 'left center' : 'right center',
      duration: DUR.quick,
      ease: EASE.editorial,
      overwrite: true,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (state === 'sending') return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError('That email address looks off.');
      setState('error');
      return;
    }
    setState('sending');
    setError(null);
    try {
      await api.subscribe(email.trim());
      setState('done');
      setEmail('');
    } catch (err) {
      setError(err.errors?.email ?? 'That did not send. Email works too.');
      setState('error');
    }
  };

  return (
    <form className={s.form} onSubmit={onSubmit} noValidate>
      <label className={s.field} htmlFor="subscribe-email">
        <span className="visuallyHidden">Email address</span>
        <input
          id="subscribe-email"
          className={s.input}
          type="email"
          value={email}
          placeholder="you@company.com"
          onChange={(e) => { setEmail(e.target.value); if (error) { setError(null); setState('idle'); } }}
          onFocus={() => focusRule(true)}
          onBlur={() => focusRule(false)}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? 'subscribe-error' : undefined}
        />
        <span ref={ruleRef} className={s.rule} aria-hidden="true" />
      </label>

      <Magnetic strength={0.25}>
        <button type="submit" className={s.submit} disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : 'Subscribe'}
        </button>
      </Magnetic>

      {error && <p id="subscribe-error" className={s.formError} role="alert">{error}</p>}
      {state === 'done' && <p className={s.formOk} role="status">You’re on the list.</p>}
    </form>
  );
}
