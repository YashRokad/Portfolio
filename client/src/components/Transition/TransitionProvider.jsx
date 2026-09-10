import { createContext, useContext, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap, ScrollTrigger, DUR, EASE } from '../../animations/gsapConfig';
import { useMotion } from '../../hooks/useMotionPreference';
import { scrollToTop } from '../../hooks/useSmoothScroll';
import { clearFlip } from '../../animations/flipBridge';
import s from './Transition.module.css';

const TransitionContext = createContext({ go: () => {} });
export const useTransition = () => useContext(TransitionContext);

const PANELS = 5;

export function TransitionProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { reduced } = useMotion();
  const curtainRef = useRef(null);
  const busy = useRef(false);
  const lastPath = useRef(location.pathname);

  /** Play the curtain in, navigate under cover, then wipe it away. */
  const go = useCallback((to, { skipCurtain = false } = {}) => {
    if (busy.current) return;
    if (to === location.pathname) return;

    if (skipCurtain) {
      // A Flip morph owns this navigation, but the scroll offset still has to
      // reset or the new page opens partway down. The stashed Flip state is
      // viewport-relative, so the morph still starts from where the card was.
      navigate(to);
      scrollToTop();
      return;
    }
    clearFlip();

    if (reduced) {
      navigate(to);
      scrollToTop();
      return;
    }

    busy.current = true;
    const panels = curtainRef.current.querySelectorAll(`.${s.panel}`);
    const tl = gsap.timeline({
      onComplete: () => { busy.current = false; },
    });

    tl.set(curtainRef.current, { pointerEvents: 'auto' })
      .set(panels, { scaleY: 0, transformOrigin: 'bottom' })
      .to(panels, {
        scaleY: 1,
        duration: 0.52,
        ease: EASE.curtain,
        stagger: { each: 0.045, from: 'start' },
      })
      .add(() => { navigate(to); scrollToTop(); })
      .to(panels, {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 0.52,
        ease: EASE.curtain,
        stagger: { each: 0.045, from: 'end' },
      }, '+=0.12')
      .set(curtainRef.current, { pointerEvents: 'none' });
  }, [navigate, location.pathname, reduced]);

  /* After any route change, kill leftover ScrollTriggers from the page that
     just unmounted and re-measure the new one. */
  useEffect(() => {
    if (lastPath.current === location.pathname) return;
    lastPath.current = location.pathname;
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [location.pathname]);

  return (
    <TransitionContext.Provider value={{ go }}>
      {children}
      <div ref={curtainRef} className={s.curtain} aria-hidden="true">
        {Array.from({ length: PANELS }, (_, i) => (
          <div key={i} className={s.panel} />
        ))}
      </div>
    </TransitionContext.Provider>
  );
}
