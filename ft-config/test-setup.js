// needed for regenerator-runtime
import 'babel-polyfill';
// Enzyme adapter for React 16
import Adapter from 'enzyme-adapter-react-16';

import React from 'react';
import enzyme, { shallow, mount, render } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import { Theme as WardrobeTheme } from '@fashiontrade/wardrobe';

enzyme.configure({ adapter: new Adapter() });

global.shallow = shallow;
global.render = render;
global.mount = mount;

global.byTestId = (testId) => `[data-testid="${testId}"]`;

// Handle Matchmedia https://github.com/akiran/react-slick
window.matchMedia =
  window.matchMedia ||
  (() => ({
    matches: false,
    addListener: () => null,
    removeListener: () => null,
  }));

/**
 * Wrapper for enzyme's mount() that includes the theme for styled-components
 */
global.mountWithTheme = (children, options = {}) => {
  return enzyme.mount(children, buildRenderOptions(options));
};

/**
 * Wrapper for enzyme's shallow() that includes the theme for styled-components
 */
global.shallowWithTheme = (children, options = {}) => {
  return enzyme.shallow(children, buildRenderOptions(options));
};

/**
 * Wrapper for enzyme's render() that includes the theme for styled-components
 */
global.renderWithTheme = (children, options = {}) => {
  return enzyme.render(children, buildRenderOptions(options));
};

let themeProvider;

function buildRenderOptions(options = {}) {
  const { context, childContextTypes } = options;
  if (!themeProvider) {
    themeProvider = enzyme.mount(<ThemeProvider theme={WardrobeTheme} />, options).instance();
  }
  return {
    ...options,
    context: {
      ...context,
      ...themeProvider.getChildContext(),
    },
    childContextTypes: {
      ...childContextTypes,
      ...themeProvider.constructor.childContextTypes,
    },
  };
}
