import Magnetic from '../Magnetic/Magnetic';
import TransitionLink from '../Transition/TransitionLink';
import { useReveal } from '../../hooks/useReveal';
import s from './CtaBanner.module.css';

/** Secondary "open roles"-style banner used before the footer. */
export default function CtaBanner({ eyebrow, title, body, to = '/contact', action = 'Start a conversation' }) {
  const scope = useReveal({ stagger: 0.08, y: 36 });

  return (
    <section ref={scope} className={`section ${s.root}`}>
      <div className={`shell ${s.inner}`}>
        <div className={s.copy}>
          <p className="eyebrow" data-reveal>{eyebrow}</p>
          <h2 className={`h2 ${s.title}`} data-reveal>{title}</h2>
          {body && <p className="prose" data-reveal>{body}</p>}
        </div>
        <div data-reveal>
          <Magnetic strength={0.4} scale={1.04}>
            <TransitionLink to={to} className={s.action} data-cursor="view" data-cursor-label="Go">
              {action}
              <span className={s.dot} aria-hidden="true" />
            </TransitionLink>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
