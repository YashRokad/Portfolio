import { useLayoutEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { gsap, DUR, EASE, STAGGER } from '../../animations/gsapConfig';
import { splitText } from '../../animations/splitText';
import { useMotion } from '../../hooks/useMotionPreference';
import Magnetic from '../../components/Magnetic/Magnetic';
import { useReveal } from '../../hooks/useReveal';
import usePageTitle from '../../hooks/usePageTitle';
import s from './Contact.module.css';

export default function Contact() {
  const { about } = useOutletContext();
  const { reduced } = useMotion();
  usePageTitle('Contact');

  const heroRef = useRef(null);
  const emailRef = useRef(null);
  const faqScope = useReveal({ stagger: 0.07, y: 30, deps: [about?.name] });

  const email = about?.contact?.email ?? '';

  /* The address is the page, so it gets the headline treatment. */
  useLayoutEffect(() => {
    if (!about) return undefined;
    let split;
    const ctx = gsap.context((self) => {
      const rest = self.selector('[data-hero-item]');
      if (reduced) {
        gsap.set(emailRef.current, { visibility: 'visible' });
        gsap.fromTo([emailRef.current, ...rest], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, stagger: 0.06 });
        return;
      }
      split = splitText(emailRef.current, { chars: true });
      gsap.set(emailRef.current, { visibility: 'visible' });
      gsap.timeline()
        .fromTo(split.chars,
          { yPercent: 116, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: DUR.hero, ease: EASE.editorial, stagger: STAGGER.chars })
        .fromTo(rest, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: DUR.standard, stagger: 0.08 }, '-=0.95');
    }, heroRef);
    return () => { ctx.revert(); split?.revert?.(); };
  }, [about, reduced]);

  return (
    <>
      <section ref={heroRef} className={s.hero}>
        <div className="shell">
          <p className={s.eyebrow} data-hero-item>Contact</p>

          <div className={s.emailWrap}>
            <a
              ref={emailRef}
              className={s.email}
              href={`mailto:${email}`}
              data-cursor="view"
              data-cursor-label="Mail"
            >
              {email}
            </a>
          </div>

          <div className={s.actions} data-hero-item>
            <CopyButton value={email} />
            <span className={s.actionNote}>Or copy it — I reply to everything within two working days.</span>
          </div>

          <div className={s.meta}>
            <div className={s.status} data-hero-item>
              <StatusDot status={about?.availability?.status} />
              <div>
                <p className={s.statusLabel}>{about?.availability?.label}</p>
                <p className="meta">{about?.availability?.detail}</p>
              </div>
            </div>

            <ul className={s.socials} data-hero-item>
              {(about?.contact?.socials ?? []).map((soc) => (
                <li key={soc.label}>
                  <Magnetic strength={0.4}>
                    <a className={s.social} href={soc.href} target="_blank" rel="noreferrer noopener">
                      {soc.label}
                    </a>
                  </Magnetic>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section ref={faqScope} className={`section ${s.faq}`}>
        <div className="shell">
          <p className="eyebrow" data-reveal>How I work</p>
          <dl className={s.faqList}>
            {(about?.faq ?? []).map((item) => (
              <div key={item.q} className={s.faqRow} data-reveal>
                <dt className={s.faqQ}>{item.q}</dt>
                <dd className={s.faqA}>{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}

/* ---------------------------------------------------------------- pieces */

function StatusDot({ status }) {
  const ref = useRef(null);
  const { reduced } = useMotion();

  useLayoutEffect(() => {
    if (reduced) return undefined;
    const ctx = gsap.context(() => {
      gsap.to(ref.current.querySelector(`.${s.pulse}`), {
        scale: 2.6, opacity: 0, duration: 1.8, ease: 'power2.out', repeat: -1,
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <span ref={ref} className={s.dotWrap} data-status={status}>
      <span className={s.pulse} aria-hidden="true" />
      <span className={s.dot} aria-hidden="true" />
    </span>
  );
}

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const iconRef = useRef(null);
  const { reduced } = useMotion();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* Clipboard can be blocked; only claim success when it actually worked. */
      return;
    }
    setCopied(true);
    if (!reduced) {
      const path = iconRef.current?.querySelector('[data-check]');
      gsap.fromTo(path,
        { strokeDasharray: 26, strokeDashoffset: 26 },
        { strokeDashoffset: 0, duration: 0.42, ease: EASE.editorial });
    }
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <button type="button" className={s.copy} onClick={copy} data-copied={copied || undefined}>
      <span ref={iconRef} className={s.copyIcon} aria-hidden="true">
        {copied ? (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path data-check d="M4 12.5 9.5 18 20 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="9" y="9" width="11" height="11" rx="2.5" />
            <path d="M15 5.5A2.5 2.5 0 0 0 12.5 3H6a3 3 0 0 0-3 3v6.5A2.5 2.5 0 0 0 5.5 15" strokeLinecap="round" />
          </svg>
        )}
      </span>
      {copied ? 'Copied' : 'Copy address'}
    </button>
  );
}
