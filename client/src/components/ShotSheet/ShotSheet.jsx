import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap, DUR, EASE } from '../../animations/gsapConfig';
import { useMotion } from '../../hooks/useMotionPreference';
import s from './ShotSheet.module.css';

const FOCUSABLE = 'button:not([disabled])';

/**
 * A single sheet, mounted once. `shot` is null when closed — the panel and
 * scrim stay in the DOM (for the exit animation) and just go pointer-events:
 * none, same pattern as the site menu.
 */
export default function ShotSheet({ shot, onClose }) {
  const open = Boolean(shot);
  const { reduced } = useMotion();

  const scrimRef = useRef(null);
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const tlRef = useRef(null);
  const returnFocus = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrim = scrimRef.current;
      const panel = panelRef.current;
      gsap.set(panel, { yPercent: 100, autoAlpha: 1 });

      const tl = gsap.timeline({
        paused: true,
        onReverseComplete() {
          returnFocus.current?.focus?.();
          returnFocus.current = null;
        },
      });

      if (reduced) {
        tl.set([scrim, panel], { pointerEvents: 'auto' })
          .fromTo(scrim, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 })
          .to(panel, { yPercent: 0, duration: 0.25 }, 0);
      } else {
        tl.set([scrim, panel], { pointerEvents: 'auto' })
          .fromTo(scrim,
            { autoAlpha: 0, '--scrim-blur': '0px' },
            { autoAlpha: 1, '--scrim-blur': '14px', duration: 0.5 }, 0)
          .to(panel, { yPercent: 0, duration: 0.7, ease: EASE.curtain }, 0);
      }

      tlRef.current = tl;
    });
    return () => { ctx.revert(); tlRef.current = null; };
  }, [reduced]);

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (open) {
      returnFocus.current = document.activeElement;
      panelRef.current.scrollTop = 0;
      tl.play();
    } else {
      tl.reverse();
    }
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  useEffect(() => () => { document.body.style.overflow = ''; }, []);

  useEffect(() => {
    if (!open) return undefined;
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      const items = [...panelRef.current.querySelectorAll(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      <div ref={scrimRef} className={s.scrim} onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        className={s.panel}
        data-lenis-prevent
        role="dialog"
        aria-modal={open ? 'true' : undefined}
        aria-label={shot?.name}
        inert={open ? undefined : ''}
      >
        <button ref={closeRef} type="button" className={s.close} onClick={onClose}>
          <span className={s.closeIcon} aria-hidden="true"><i /><i /></span>
        </button>

        {shot && (
          <div className={s.body}>
            <div className={s.copy}>
              <h2 className={s.title}>{shot.name}</h2>
              <p className={s.sub}>{shot.subtitle}</p>
            </div>
            <div className={s.frame}>
              <img className={s.image} src={shot.image} alt="" />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
