import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
/* Global styles first so component CSS Modules always win a specificity tie. */
import './styles/global.css';
import { MotionProvider } from './hooks/useMotionPreference';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MotionProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </BrowserRouter>
    </MotionProvider>
  </StrictMode>
);
