import { createContext, useContext, useEffect, useState, useMemo } from 'react';

const MotionContext = createContext({ reduced: false, touch: false });

const query = '(prefers-reduced-motion: reduce)';

export function MotionProvider({ children }) {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );
  const [touch, setTouch] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches
  );

  useEffect(() => {
    const mm = window.matchMedia(query);
    const pm = window.matchMedia('(hover: none), (pointer: coarse)');
    const onMotion = (e) => setReduced(e.matches);
    const onPointer = (e) => setTouch(e.matches);
    mm.addEventListener('change', onMotion);
    pm.addEventListener('change', onPointer);
    return () => {
      mm.removeEventListener('change', onMotion);
      pm.removeEventListener('change', onPointer);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? 'reduced' : 'full';
  }, [reduced]);

  const value = useMemo(() => ({ reduced, touch }), [reduced, touch]);
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export const useMotion = () => useContext(MotionContext);
