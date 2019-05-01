import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { subscribe } from './applications';

const PatchworkComponent = ({ name, componentName = null, basePath, ...otherProps }) => {
  const ref = React.createRef();
  const [savedUnmount, setUnmount] = useState(null);

  useEffect(() => {
    const onLoad = ({ components = {}, ...app }) => {
      const component = componentName === null ? app : components[componentName];
      if (!component) return;
      const { mount, unmount } = component;
      console.log('>>>> calling ', name, componentName || '', 'MOUNT on', ref.current);
      mount(ref.current, basePath, otherProps);
      setUnmount(unmount);
    };
    const unsubscribe = subscribe(name, componentName, onLoad);
    return async () => {
      if (savedUnmount) {
        console.log('>>>> calling ', name, componentName || '', 'UNMOUNT on', ref.current);
        await savedUnmount();
      }
      unsubscribe();
    };
  }, [name, componentName]);
  return <div ref={ref} />;
};

PatchworkComponent.propTypes = {
  name: PropTypes.string.isRequired,
  componentName: PropTypes.string,
  basePath: PropTypes.string,
};

export default PatchworkComponent;
