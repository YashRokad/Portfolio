import { useLayoutEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { gsap, DUR, EASE } from '../../animations/gsapConfig';
import { useMotion } from '../../hooks/useMotionPreference';
import s from './PreviewLayer.module.css';

/**
 * A single floating panel that follows the cursor and swaps its image as the
 * pointer moves between work rows/cards. One layer is shared by every row, so
 * hovering fast never stacks tweens or spawns nodes.
 *
 * Imperative API: show(src, accent), hide(), and imageEl for Flip handoff.
 */
const PreviewLayer = forwardRef(function PreviewLayer({ scopeRef }, ref) {
  const rootRef = useRef(null);
  const imgARef = useRef(null);
  const imgBRef = useRef(null);
  const activeRef = useRef('a');
  const currentSrc = useRef(null);
  const apiRef = useRef({ show: () => {}, hide: () => {} });
  const { reduced, touch } = useMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    const scope = scopeRef?.current;
    if (!root || !scope || reduced || touch) return undefined;

    const ctx = gsap.context(() => {
      const xTo = gsap.quickTo(root, 'x', { duration: 0.65, ease: 'power3' });
      const yTo = gsap.quickTo(root, 'y', { duration: 0.65, ease: 'power3' });
      const rTo = gsap.quickTo(root, 'rotation', { duration: 0.9, ease: 'power3' });
      let lastX = 0;

      const onMove = (e) => {
        xTo(e.clientX);
        yTo(e.clientY);
        rTo(gsap.utils.clamp(-9, 9, (e.clientX - lastX) * 0.6));
        lastX = e.clientX;
      };
      scope.addEventListener('pointermove', onMove, { passive: true });

      apiRef.current = {
        show(src, accent) {
          if (src === currentSrc.current) {
            gsap.to(root, { autoAlpha: 1, scale: 1, duration: DUR.quick, ease: EASE.snap });
            return;
          }
          currentSrc.current = src;
          const incoming = activeRef.current === 'a' ? imgBRef.current : imgARef.current;
          const outgoing = activeRef.current === 'a' ? imgARef.current : imgBRef.current;
          activeRef.current = activeRef.current === 'a' ? 'b' : 'a';

          incoming.src = src;
          root.style.setProperty('--preview-accent', accent || 'var(--accent)');

          gsap.timeline()
            .set(incoming, { clipPath: 'inset(0% 0% 100% 0%)', autoAlpha: 1, scale: 1.12, zIndex: 2 })
            .set(outgoing, { zIndex: 1 })
            .to(root, { autoAlpha: 1, scale: 1, duration: DUR.quick, ease: EASE.snap }, 0)
            .to(incoming, {
              clipPath: 'inset(0% 0% 0% 0%)', scale: 1,
              duration: 0.62, ease: EASE.curtain,
            }, 0);
        },
        hide() {
          gsap.to(root, { autoAlpha: 0, scale: 0.9, duration: DUR.micro, ease: EASE.snap });
        },
      };

      return () => scope.removeEventListener('pointermove', onMove);
    }, rootRef);

    return () => { ctx.revert(); apiRef.current = { show: () => {}, hide: () => {} }; };
  }, [reduced, touch, scopeRef]);

  useImperativeHandle(ref, () => ({
    show: (src, accent) => apiRef.current.show(src, accent),
    hide: () => apiRef.current.hide(),
    get imageEl() {
      return activeRef.current === 'a' ? imgARef.current : imgBRef.current;
    },
  }), []);

  if (reduced || touch) return null;

  return (
    <div ref={rootRef} className={s.root} aria-hidden="true">
      <div className={s.frame}>
        <img ref={imgARef} className={s.img} alt="" />
        <img ref={imgBRef} className={s.img} alt="" />
      </div>
    </div>
  );
});

export default PreviewLayer;
