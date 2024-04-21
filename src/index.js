import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { I18nProvider } from './components/context/i18n-context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <I18nProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </I18nProvider>
);

 reportWebVitals();
serviceWorkerRegistration.register();
