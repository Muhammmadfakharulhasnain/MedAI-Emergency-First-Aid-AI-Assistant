import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Explicitly unregister any existing service workers to resolve CORS/Scope errors in preview environment.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  }).catch((error) => {
    console.warn("Service Worker unregistration failed:", error);
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);