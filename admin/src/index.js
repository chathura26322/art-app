import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AdminAuthProvider>
    <App />
    <Toaster 
      position="top-right"
      toastOptions={{
        style: {
          background: '#1a1a1a',
          color: '#f0ebe0',
          border: '1px solid rgba(212,168,83,0.2)',
        }
      }}
    />
  </AdminAuthProvider>
);
