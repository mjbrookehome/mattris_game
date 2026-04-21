import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { useGameStore } from './store/gameStore';

// Expose store for E2E testing only – stripped in production builds
if ((import.meta as { env?: { DEV?: boolean } }).env?.DEV) {
  (window as unknown as Record<string, unknown>).__GAME_STORE__ = useGameStore;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
