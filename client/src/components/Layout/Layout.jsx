import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Cursor from '../Cursor/Cursor';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';
import { api } from '../../data-client/api';
import { useResource } from '../../data-client/useApi';
import s from './Layout.module.css';

export default function Layout() {
  useSmoothScroll();
  const { data: about } = useResource('about', api.getAbout);
  const { pathname } = useLocation();

  return (
    <div className={s.root} data-route={pathname}>
      <a className="skipLink" href="#main">Skip to content</a>
      <div className="grain" aria-hidden="true" />
      <Cursor />
      <Header name={about?.name} about={about} />
      <main id="main" className={s.main} tabIndex={-1}>
        <Outlet context={{ about }} />
      </main>
      <Footer about={about} />
    </div>
  );
}
