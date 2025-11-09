import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { Toaster } from 'react-hot-toast';
import store from './store';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <Provider store={store}>
      <AuthProvider>
        <App/>
        <Toaster/>
      </AuthProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
)
