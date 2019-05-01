import React from 'react';
import ReactDOM from 'react-dom';

const registerComponent = (name, Component, props) => ({
  name,
  mount: (node) => {
    ReactDOM.render(<Component {...props} />, node);
    return Promise.resolve();
  },
  unmount: () => Promise.resolve(),
});

export default registerComponent;
