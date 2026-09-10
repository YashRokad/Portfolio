import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { useTransition } from './TransitionProvider';

/**
 * A real <Link> (keyboard, middle-click and right-click all behave natively)
 * whose left-click is intercepted so the GSAP curtain gates the navigation.
 */
const TransitionLink = forwardRef(function TransitionLink(
  { to, children, onClick, skipCurtain = false, ...rest }, ref
) {
  const { go } = useTransition();
  return (
    <Link
      ref={ref}
      to={to}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        go(to, { skipCurtain });
      }}
      {...rest}
    >
      {children}
    </Link>
  );
});

export default TransitionLink;
