import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Wait for DOM content to be loaded to ensure the static HTML is fully rendered for SEO
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');
  
  if (rootElement) {
    // Create a root for React to render into
    const root = createRoot(rootElement);
    
    // Render the React app
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
});