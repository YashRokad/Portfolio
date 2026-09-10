import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap, DUR, EASE, STAGGER } from '../../animations/gsapConfig';
import { useMotion } from '../../hooks/useMotionPreference';
import TransitionLink from '../Transition/TransitionLink';
import s from './Header.module.css';

const NAV = [
  { to: '/', label: 'Index' },
  { to: '/work', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Header({ name = 'Yash Rokad' }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { reduced } = useMotion();
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const tlRef = useRef(null);
  const toggleRef = useRef(null);

  /* Build the takeover timeline once; open/close simply plays it in reverse
     so the close is a true inverse rather than a hard cut. */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const panel = menuRef.current;
      const links = panel.querySelectorAll(`.${s.menuLink}`);
      const meta = panel.querySelectorAll(`.${s.menuMeta} > *`);

      const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.curtain } });
      if (reduced) {
        tl.fromTo(panel, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 })
          .fromTo([...links, ...meta], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, stagger: 0.03 }, 0);
      } else {
        tl.set(panel, { pointerEvents: 'auto' })
          .fromTo(panel,
            { clipPath: 'inset(0% 0% 100% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.62 })
          .fromTo(links,
            { yPercent: 116, rotate: 5, autoAlpha: 0 },
            { yPercent: 0, rotate: 0, autoAlpha: 1, duration: DUR.slow, ease: EASE.editorial, stagger: STAGGER.list },
            '-=0.34')
          .fromTo(meta,
            { y: 22, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: DUR.standard, stagger: 0.06 },
            '-=0.55');
      }
      tlRef.current = tl;
    }, headerRef);
    return () => { ctx.revert(); tlRef.current = null; };
  }, [reduced]);

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (open) tl.play();
    else tl.reverse();
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  /* Close on route change and on Escape; return focus to the toggle. */
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => () => { document.body.style.overflow = ''; }, []);

  return (
    <header ref={headerRef} className={s.header} data-open={open || undefined}>
      <div className={s.bar}>
        <TransitionLink to="/" className={s.wordmark} aria-label={`${name} — home`}>
          <span className={s.mark} aria-hidden="true" />
          <span className={s.wordmarkText}>{name}</span>
        </TransitionLink>

        <nav className={s.desktopNav} aria-label="Primary">
          {NAV.map((item) => (
            <TransitionLink
              key={item.to}
              to={item.to}
              className={s.navLink}
              data-active={isActive(pathname, item.to) || undefined}
              aria-current={isActive(pathname, item.to) ? 'page' : undefined}
            >
              <span className={s.navLabel}>{item.label}</span>
              <span className={s.navPill} aria-hidden="true" />
            </TransitionLink>
          ))}
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className={s.toggle}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="site-menu"
        >
          <span className={s.toggleLabel}>{open ? 'Close' : 'Menu'}</span>
          <span className={s.toggleIcon} aria-hidden="true"><i /><i /></span>
        </button>
      </div>

      <div id="site-menu" ref={menuRef} className={s.menu} inert={open ? undefined : ''}>
        <nav className={s.menuNav} aria-label="Primary, expanded">
          {NAV.map((item, i) => (
            <TransitionLink key={item.to} to={item.to} className={s.menuLink}>
              <span className={s.menuIndex}>{String(i + 1).padStart(2, '0')}</span>
              {item.label}
            </TransitionLink>
          ))}
        </nav>
        <div className={s.menuMeta}>
          <p className="meta">Available for senior and lead product design roles.</p>
          <a className={s.menuEmail} href="mailto:hello@yashrokad.design">hello@yashrokad.design</a>
        </div>
      </div>
    </header>
  );
}

function isActive(pathname, to) {
  if (to === '/') return pathname === '/';
  return pathname.startsWith(to === '/work' ? '/work' : to);
}
