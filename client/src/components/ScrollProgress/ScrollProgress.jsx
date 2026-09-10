import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../../animations/gsapConfig';
import s from './ScrollProgress.module.css';

/**
 * Full-width read-progress bar pinned to the bottom edge of the viewport.
 * Driven directly from a ScrollTrigger on the article rather than a scroll
 * listener, so it stays in step with Lenis and with any pinned sections.
 */
export default function ScrollProgress({ targetRef, accent }) {
  const barRef = useRef(null);

  useLayoutEffect(() => {
    const bar = barRef.current;
    const target = targetRef?.current;
    if (!bar || !target) return undefined;

    const ctx = gsap.context(() => {
      gsap.set(bar, { scaleX: 0 });
      const trigger = ScrollTrigger.create({
        trigger: target,
        start: 'top top',
        end: 'bottom bottom',
        invalidateOnRefresh: true,
        onUpdate: (self) => gsap.set(bar, { scaleX: self.progress }),
      });
      return () => trigger.kill();
    });

    return () => ctx.revert();
  }, [targetRef]);

  return (
    <div className={s.root} style={{ '--p-accent': accent }} aria-hidden="true">
      <span ref={barRef} className={s.bar} />
    </div>
  );
}
