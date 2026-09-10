import TransitionLink from '../../components/Transition/TransitionLink';
import usePageTitle from '../../hooks/usePageTitle';
import s from './NotFound.module.css';

export default function NotFound() {
  usePageTitle('Not found');
  return (
    <section className={`shell ${s.root}`}>
      <p className="eyebrow">404</p>
      <h1 className="display">Nothing lives here.</h1>
      <p className="prose">
        The link is either old or invented. The four case studies are all one click away.
      </p>
      <TransitionLink to="/work" className={s.link}>See the work →</TransitionLink>
    </section>
  );
}
