import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';

// Check if there's an initial route set by the HTML page
const initialRoute = (window as { initialRoute?: string }).initialRoute;
if (initialRoute && window.location.pathname !== initialRoute) {
  window.history.replaceState({}, '', initialRoute);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>
);