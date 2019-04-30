import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/browser';
import './index.css';
import App from './App';
import createStore from './createStore';

Sentry.init({
  dsn: fashionTradeSettings.sentry_url,
  release: window.releaseVersion, // this is defined in index.ejs
  environment: fashionTradeSettings.environment,
});

const store = createStore();
ReactDOM.render(<App store={store} />, document.getElementById('ft-app'));
