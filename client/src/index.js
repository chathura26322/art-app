import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#1e1e1e',
          color: '#f0ebe0',
          border: '1px solid rgba(212,168,83,0.2)',
        },
        success: { iconTheme: { primary: '#d4a853', secondary: '#0f0f0f' } },
      }}
    />
  </AuthProvider>
);
