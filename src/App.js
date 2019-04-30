import React from 'react';
import { hot } from 'react-hot-loader';
import { ThemeProvider } from 'styled-components';
import { Theme } from '@fashiontrade/wardrobe';
import logo from './logo.svg';
import './App.css';

const App = () => (
  <ThemeProvider theme={Theme}>
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </header>
    </div>
  </ThemeProvider>
);

export default hot(module)(App);
