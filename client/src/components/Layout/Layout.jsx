import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Cursor from '../Cursor/Cursor';
import Intro from '../Loader/Intro';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';
import { api } from '../../data-client/api';
import { useResource } from '../../data-client/useApi';
import s from './Layout.module.css';

export default function Layout() {
  useSmoothScroll();
  const { data: about } = useResource('about', api.getAbout);
  const [introDone, setIntroDone] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className={s.root} data-route={pathname}>
      <a className="skipLink" href="#main">Skip to content</a>
      <div className="grain" aria-hidden="true" />
      <Cursor />
      <Intro onDone={() => setIntroDone(true)} />
      <Header name={about?.name} about={about} />
      <main id="main" className={s.main} tabIndex={-1}>
        <Outlet context={{ about, introDone }} />
      </main>
      <Footer about={about} />
    </div>
  );
}
