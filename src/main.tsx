import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { useGameStore } from './store/gameStore';

// Expose store for E2E testing only – stripped in production by tree-shaking env check
if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).__GAME_STORE__ = useGameStore;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
