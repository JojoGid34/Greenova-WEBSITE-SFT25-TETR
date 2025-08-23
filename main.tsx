import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import './styles/globals.css';

// Pastikan elemen dengan ID 'root' ada di index.html Anda
const rootElement = document.getElementById('root');

if (rootElement) {
  // Gunakan createRoot untuk merender aplikasi
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Elemen dengan ID 'root' tidak ditemukan di dokumen.");
}
