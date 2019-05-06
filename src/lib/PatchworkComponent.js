import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { subscribe } from './applications';

const PatchworkComponent = ({ name, componentName = null, basePath, ...otherProps }) => {
  const ref = React.createRef();
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    let savedUnmount = null;
    let unsubscribe = null;
    if (!isMounted) {
      console.log('>>> Not mounted yet, let us call subscribe later');
      setMounted(true);
      return () => {
        console.log('>>>> Useless clean up');
      };
    }
    console.log('>>> Now mounted, ref is:', ref);
    const onLoad = ({ components = {}, ...app }) => {
      const component = componentName === null ? app : components[componentName];
      if (!component) return;
      const { mount, unmount } = component;
      console.log('>>>> calling ', name, componentName || '', 'MOUNT on', ref.current);
      mount(ref.current, basePath, otherProps);
      savedUnmount = unmount;
    };
    unsubscribe = subscribe(name, componentName, onLoad);
    return () => {
      if (savedUnmount) {
        console.log('>>>> calling ', name, componentName || '', 'UNMOUNT on', ref.current);
        return savedUnmount()
          .then(() => unsubscribe())
          .catch(() => unsubscribe());
      }
      unsubscribe();
      return undefined;
    };
  }, [name, componentName, isMounted]);
  return <div ref={ref} />;
};

PatchworkComponent.propTypes = {
  name: PropTypes.string.isRequired,
  componentName: PropTypes.string,
  basePath: PropTypes.string,
};

export default PatchworkComponent;
