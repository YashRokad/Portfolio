import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, DUR, EASE } from '../../animations/gsapConfig';
import { splitText } from '../../animations/splitText';
import { useMotion } from '../../hooks/useMotionPreference';
import s from './Intro.module.css';

const KEY = 'intro-played';

export const introHasPlayed = () =>
  typeof sessionStorage !== 'undefined' && sessionStorage.getItem(KEY) === '1';

/**
 * One-time first-load reveal. Gated by sessionStorage so it never replays on
 * internal navigation, and skipped entirely for reduced-motion visitors.
 */
export default function Intro({ onDone }) {
  const { reduced } = useMotion();
  const [skip] = useState(() => introHasPlayed() || reduced);
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (skip) { onDone?.(); return undefined; }
    document.body.style.overflow = 'hidden';

    let split;
    const ctx = gsap.context(() => {
      const word = rootRef.current.querySelector(`.${s.word}`);
      const bar = rootRef.current.querySelector(`.${s.bar}`);
      const count = rootRef.current.querySelector(`.${s.count}`);
      split = splitText(word, { chars: true });

      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem(KEY, '1');
          document.body.style.overflow = '';
          onDone?.();
        },
      });

      tl.fromTo(split.chars,
        { yPercent: 120, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 1, ease: EASE.editorial, stagger: 0.03 })
        .fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1.05, ease: EASE.editorial }, 0.15)
        .to({ v: 0 }, {
          v: 100, duration: 1.05, ease: EASE.editorial,
          onUpdate() { count.textContent = String(Math.round(this.targets()[0].v)).padStart(3, '0'); },
        }, 0.15)
        .to(split.chars, {
          yPercent: -120, autoAlpha: 0, duration: 0.6,
          ease: EASE.curtain, stagger: 0.012,
        }, '+=0.15')
        .to([bar, count], { autoAlpha: 0, duration: 0.3 }, '<')
        .to(rootRef.current, {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 0.85,
          ease: EASE.curtain,
        }, '-=0.25')
        .set(rootRef.current, { autoAlpha: 0, pointerEvents: 'none' });
    }, rootRef);

    return () => {
      ctx.revert();
      split?.revert?.();
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip]);

  if (skip) return null;

  return (
    <div ref={rootRef} className={s.root} aria-hidden="true">
      <div className={s.inner}>
        <p className={`${s.word} display`}>Yash Rokad</p>
        <div className={s.footerRow}>
          <span className={s.count}>000</span>
          <span className={s.barTrack}><span className={s.bar} /></span>
          <span className="meta">Product design, enterprise scale</span>
        </div>
      </div>
    </div>
  );
}
