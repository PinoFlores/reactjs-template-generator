import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'sanitize.css/sanitize.css';
import App from './app';
import store from './store/store';
import { HelmetProvider } from 'react-helmet-async';
import reportWebVitals from 'reportWebVitals';

// ! IMPORTANT
// TODO Fix all env url.

// Initialize languages
import './locales/i18n';

const MOUNT_NODE = document.getElementById('root');

ReactDOM.render(
  <Provider store={store}>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </Provider>,
  MOUNT_NODE,
);

// Hot reloadable translation json files
if (module.hot) {
  module.hot.accept(['./locales/i18n'], () => {
    // No need to render the App again because i18next works with the hooks
  });
}

reportWebVitals();
