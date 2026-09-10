import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import { TransitionProvider } from './components/Transition/TransitionProvider';
import Home from './pages/Home/Home';
import Work from './pages/Work/Work';
import ProjectDetail from './pages/ProjectDetail/ProjectDetail';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import StyleGuide from './pages/StyleGuide/StyleGuide';
import NotFound from './pages/NotFound/NotFound';

export default function App() {
  return (
    <TransitionProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="work" element={<Work />} />
          <Route path="work/:slug" element={<ProjectDetail />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="styleguide" element={<StyleGuide />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </TransitionProvider>
  );
}
