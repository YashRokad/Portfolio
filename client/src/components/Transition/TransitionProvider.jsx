import { createContext, useContext, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ScrollTrigger } from '../../animations/gsapConfig';
import { scrollToTop } from '../../hooks/useSmoothScroll';
import { clearFlip } from '../../animations/flipBridge';

const TransitionContext = createContext({ go: () => {} });
export const useTransition = () => useContext(TransitionContext);

export function TransitionProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const lastPath = useRef(location.pathname);

  /**
   * Navigate and reset scroll. There is no curtain any more: the striped wipe
   * that used to cover the swap is gone, so a route change is a straight cut.
   *
   * skipCurtain still matters even without a curtain — it marks the callers
   * that have stashed a Flip state for a shared-element morph, and those must
   * keep it. Clearing on every navigation would break the morph.
   */
  const go = useCallback((to, { skipCurtain = false } = {}) => {
    if (to === location.pathname) return;
    if (!skipCurtain) clearFlip();
    navigate(to);
    scrollToTop();
  }, [navigate, location.pathname]);

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
    </TransitionContext.Provider>
  );
}
