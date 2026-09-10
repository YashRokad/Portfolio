import { useLayoutEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { gsap, DUR, EASE, STAGGER } from '../../animations/gsapConfig';
import { splitText } from '../../animations/splitText';
import { useMotion } from '../../hooks/useMotionPreference';
import { useMagnetic } from '../../hooks/useMagnetic';
import Magnetic from '../../components/Magnetic/Magnetic';
import { useReveal } from '../../hooks/useReveal';
import { api } from '../../data-client/api';
import usePageTitle from '../../hooks/usePageTitle';
import s from './Contact.module.css';

const BUDGETS = ['Not sure yet', 'Under £15k', '£15k – £40k', '£40k+', 'Full-time role'];

export default function Contact() {
  const { about } = useOutletContext();
  const { reduced } = useMotion();
  usePageTitle('Contact');

  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const emailRef = useMagnetic({ strength: 0.22 });
  const formScope = useReveal({ stagger: 0.06, y: 32, deps: [about?.name] });
  const faqScope = useReveal({ stagger: 0.07, y: 30, deps: [about?.name] });

  const email = about?.contact?.email ?? '';

  useLayoutEffect(() => {
    if (!about) return undefined;
    let split;
    const ctx = gsap.context((self) => {
      const rest = self.selector('[data-hero-item]');
      if (reduced) {
        gsap.set(headlineRef.current, { visibility: 'visible' });
        gsap.fromTo([headlineRef.current, ...rest], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, stagger: 0.06 });
        return;
      }
      split = splitText(headlineRef.current, { chars: true });
      gsap.set(headlineRef.current, { visibility: 'visible' });
      gsap.timeline()
        .fromTo(split.chars,
          { yPercent: 118, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: DUR.hero, ease: EASE.editorial, stagger: STAGGER.chars })
        .fromTo(rest, { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: DUR.standard, stagger: 0.08 }, '-=0.95');
    }, heroRef);
    return () => { ctx.revert(); split?.revert?.(); };
  }, [about, reduced]);

  return (
    <>
      <section ref={heroRef} className={`section ${s.hero}`}>
        <div className="shell">
          <p className="eyebrow" data-hero-item>Contact</p>
          <h1 ref={headlineRef} className={`display ${s.headline}`}>Tell me what people work around.</h1>

          <div className={s.emailRow} data-hero-item>
            <a ref={emailRef} className={s.email} href={`mailto:${email}`} data-cursor="view" data-cursor-label="Mail">
              {email}
            </a>
            <CopyButton value={email} />
          </div>

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
                <Magnetic strength={0.45}>
                  <a className={s.social} href={soc.href} target="_blank" rel="noreferrer noopener">
                    {soc.label}
                  </a>
                </Magnetic>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section ref={formScope} className={`section ${s.formSection}`}>
        <div className={`shell ${s.formGrid}`}>
          <div className={s.formIntro}>
            <p className="eyebrow" data-reveal>Or use the form</p>
            <h2 className={`h2 ${s.formTitle}`} data-reveal>Four fields. I read every one.</h2>
            <p className="prose" data-reveal>{about?.contact?.phoneNote}</p>
          </div>
          <ContactForm />
        </div>
      </section>

      <section ref={faqScope} className={`section ${s.faq}`}>
        <div className="shell">
          <p className="eyebrow" data-reveal>How I work</p>
          <dl className={s.faqList}>
            {(about?.faq ?? []).map((item) => (
              <div key={item.q} className={s.faqRow} data-reveal>
                <dt className={`h4 ${s.faqQ}`}>{item.q}</dt>
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
      /* Clipboard can be blocked; the visual state below still tells the
         truth because we only flip it on success. */
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
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

const EMPTY = { name: '', email: '', company: '', budget: BUDGETS[0], message: '' };

/* Mirrors the server's rules so the visitor gets the correction immediately
   and a well-formed submission is the only thing that ever leaves the page. */
function validate(values) {
  const next = {};
  if (values.name.trim().length < 2) next.name = 'Tell me what to call you.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) next.email = 'That email address looks off.';
  if (values.message.trim().length < 10) next.message = 'A little more detail helps me reply well.';
  return next;
}

function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle'); // idle | sending | sent | error
  const formRef = useRef(null);
  const { reduced } = useMotion();

  const update = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (state === 'sending') return;

    const found = validate(values);
    if (Object.keys(found).length) {
      setErrors(found);
      setState('error');
      formRef.current.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    setState('sending');
    setErrors({});
    try {
      await api.sendMessage(values);
      setState('sent');
      setValues(EMPTY);
      if (!reduced) {
        gsap.fromTo(formRef.current.querySelector(`.${s.success}`),
          { y: 16, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: DUR.standard, ease: EASE.editorial });
      }
    } catch (err) {
      setErrors(err.errors ?? {});
      setState('error');
    }
  };

  return (
    <form ref={formRef} className={s.form} onSubmit={onSubmit} noValidate>
      <Field label="Your name" name="name" value={values.name} onChange={update('name')} error={errors.name} required />
      <Field label="Email" name="email" type="email" value={values.email} onChange={update('email')} error={errors.email} required />
      <Field label="Company" name="company" value={values.company} onChange={update('company')} optional />

      <label className={s.field}>
        <span className={s.labelText}>Shape of the engagement</span>
        <select className={s.input} value={values.budget} onChange={update('budget')}>
          {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <span className={s.underline} aria-hidden="true" />
      </label>

      <Field
        label="What are people working around?"
        name="message"
        value={values.message}
        onChange={update('message')}
        error={errors.message}
        textarea
        required
      />

      <div className={s.actions}>
        <button type="submit" className={s.submit} disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : 'Send it'}
          <span className={s.submitDot} aria-hidden="true" />
        </button>
        {state === 'sent' && (
          <p className={s.success} role="status">Got it — I reply to everything within two working days.</p>
        )}
        {state === 'error' && Object.keys(errors).length === 0 && (
          <p className={s.error} role="alert">That did not send. Email works too.</p>
        )}
      </div>
    </form>
  );
}

function Field({ label, name, value, onChange, error, type = 'text', textarea = false, required = false, optional = false }) {
  const id = `field-${name}`;
  const Tag = textarea ? 'textarea' : 'input';
  const wrapRef = useRef(null);
  const { reduced } = useMotion();

  /* Focus draws the rule in from the left and lifts the label. */
  const animateFocus = (focused) => {
    const rule = wrapRef.current?.querySelector(`.${s.underline}`);
    const labelEl = wrapRef.current?.querySelector(`.${s.labelText}`);
    if (!rule) return;
    if (reduced) {
      gsap.set(rule, { scaleX: focused ? 1 : 0 });
      return;
    }
    gsap.to(rule, {
      scaleX: focused ? 1 : 0,
      transformOrigin: focused ? 'left center' : 'right center',
      duration: DUR.quick,
      ease: EASE.editorial,
      overwrite: true,
    });
    gsap.to(labelEl, { color: focused ? 'var(--accent)' : 'var(--text-tertiary)', duration: DUR.micro });
  };

  return (
    <label ref={wrapRef} className={s.field} htmlFor={id} data-invalid={error ? '' : undefined}>
      <span className={s.labelText}>
        {label}
        {optional && <span className={s.optional}> — optional</span>}
      </span>
      <Tag
        id={id}
        name={name}
        className={`${s.input} ${textarea ? s.textarea : ''}`}
        type={textarea ? undefined : type}
        rows={textarea ? 4 : undefined}
        value={value}
        onChange={onChange}
        onFocus={() => animateFocus(true)}
        onBlur={() => animateFocus(false)}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <span className={s.underline} aria-hidden="true" />
      {error && <span id={`${id}-error`} className={s.fieldError}>{error}</span>}
    </label>
  );
}
