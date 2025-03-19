import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // ✅ BrowserRouter should be here ONLY
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ Keep BrowserRouter here */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
