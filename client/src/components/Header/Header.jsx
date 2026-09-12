import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap, DUR, EASE, STAGGER } from '../../animations/gsapConfig';
import { splitText } from '../../animations/splitText';
import { useMotion } from '../../hooks/useMotionPreference';
import TransitionLink from '../Transition/TransitionLink';
import s from './Header.module.css';

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/work', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const FOCUSABLE = 'a[href], button:not([disabled])';

export default function Header({ name = 'Yash Rokad', about }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { reduced } = useMotion();

  const headerRef = useRef(null);
  const panelRef = useRef(null);
  const scrimRef = useRef(null);
  const toggleRef = useRef(null);
  const tlRef = useRef(null);
  /* Set when a close should hand focus back; the toggle is hidden until the
     reverse finishes, so focusing it any earlier silently fails. */
  const returnFocus = useRef(false);

  /* One timeline, built once. Opening plays it; closing reverses it, so the
     close is the exact inverse rather than a separate animation. */
  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const panel = panelRef.current;
      const scrim = scrimRef.current;
      // Park the panel off-canvas before the browser paints it.
      gsap.set(panel, { xPercent: 100, autoAlpha: 1 });
      const links = self.selector(`.${s.menuLink}`);
      const foot = self.selector(`.${s.footCol}`);
      const close = self.selector(`.${s.close}`);
      const toggle = toggleRef.current;

      const splits = reduced ? [] : links.map((link) => splitText(link, { chars: false }));
      const words = splits.flatMap((sp) => sp.words);

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: EASE.curtain },
        onReverseComplete() {
          if (!returnFocus.current) return;
          returnFocus.current = false;
          toggleRef.current?.focus();
        },
      });

      if (reduced) {
        tl.set([scrim, panel], { pointerEvents: 'auto' })
          .fromTo(scrim, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 })
          .to(panel, { xPercent: 0, duration: 0.25 }, 0)
          .to(toggle, { autoAlpha: 0, duration: 0.2 }, 0)
          .fromTo([...links, ...foot, ...close],
            { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, stagger: 0.03 }, 0.1);
      } else {
        tl.set([scrim, panel], { pointerEvents: 'auto' })
          .fromTo(scrim,
            { autoAlpha: 0, '--scrim-blur': '0px' },
            { autoAlpha: 1, '--scrim-blur': '14px', duration: 0.55 }, 0)
          .to(toggle, { autoAlpha: 0, duration: 0.3 }, 0)
          .to(panel, { xPercent: 0, duration: 0.72 }, 0)
          .fromTo(close,
            { autoAlpha: 0, rotate: -90 },
            { autoAlpha: 1, rotate: 0, duration: DUR.standard, ease: EASE.snap }, 0.3)
          .fromTo(words,
            { yPercent: 118, autoAlpha: 0 },
            {
              yPercent: 0, autoAlpha: 1,
              duration: DUR.slow, ease: EASE.editorial, stagger: STAGGER.list,
            }, 0.28)
          .fromTo(foot,
            { y: 26, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: DUR.standard, stagger: 0.08 }, 0.5);
      }

      tlRef.current = tl;

      return () => splits.forEach((sp) => sp.revert());
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

  const close = useCallback(() => {
    returnFocus.current = true;
    setOpen(false);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => () => { document.body.style.overflow = ''; }, []);

  /* Escape closes; Tab is kept inside the panel while it is open. */
  useEffect(() => {
    if (!open) return undefined;
    const panel = panelRef.current;
    panel.querySelector(FOCUSABLE)?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      const items = [...panel.querySelectorAll(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  const socials = about?.contact?.socials ?? [];
  const email = about?.contact?.email;

  return (
    <header ref={headerRef} className={s.header} data-open={open || undefined}>
      <div className={s.bar}>
        <TransitionLink to="/" className={s.wordmark} aria-label={`${name} — home`}>
          <span className={s.mark} aria-hidden="true" />
          <span className={s.wordmarkText}>{name}</span>
        </TransitionLink>

        <button
          ref={toggleRef}
          type="button"
          className={s.toggle}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="site-menu"
        >
          <span className={s.toggleLabel}>Menu</span>
          <span className={s.toggleIcon} aria-hidden="true"><i /><i /></span>
        </button>
      </div>

      <div
        ref={scrimRef}
        className={s.scrim}
        onClick={close}
        aria-hidden="true"
      />

      <aside
        id="site-menu"
        ref={panelRef}
        className={s.panel}
        aria-label="Site menu"
        aria-modal={open ? 'true' : undefined}
        role={open ? 'dialog' : undefined}
        inert={open ? undefined : ''}
      >
        <button type="button" className={s.close} onClick={close}>
          <span className={s.closeIcon} aria-hidden="true"><i /><i /></span>
          Close
        </button>

        <nav className={s.menuNav}>
          {NAV.map((item) => (
            <TransitionLink
              key={item.to}
              to={item.to}
              className={s.menuLink}
              data-active={isActive(pathname, item.to) || undefined}
              aria-current={isActive(pathname, item.to) ? 'page' : undefined}
              onClick={close}
            >
              {item.label}
            </TransitionLink>
          ))}
        </nav>

        <div className={s.foot}>
          <div className={s.footCol}>
            <p className={s.footLabel}>Contact</p>
            {email && <a className={s.footLink} href={`mailto:${email}`}>{email}</a>}
            <p className={s.footNote}>{about?.availability?.label}</p>
          </div>
          <div className={s.footCol}>
            <p className={s.footLabel}>Socials</p>
            {socials.map((soc) => (
              <a
                key={soc.label}
                className={s.footLink}
                href={soc.href}
                target="_blank"
                rel="noreferrer noopener"
              >
                {soc.label}
              </a>
            ))}
          </div>
        </div>
      </aside>
    </header>
  );
}

function isActive(pathname, to) {
  if (to === '/') return pathname === '/';
  return pathname.startsWith(to);
}
