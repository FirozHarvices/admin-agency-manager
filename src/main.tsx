// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.tsx';
import './index.css';
import { setUser } from './features/auth/store/authSlice.ts';
import { User } from './features/auth/types';
import { store } from './store/index.ts';

const token = localStorage.getItem('token');
const userString = localStorage.getItem('user');

if (token && userString) {
  try {
    const user: User = JSON.parse(userString);
    store.dispatch(setUser({ user, token }));
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);