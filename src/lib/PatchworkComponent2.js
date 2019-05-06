import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { subscribe } from './applications';

const PatchworkComponent = ({ name, componentName = null, basePath, ...otherProps }) => {
  const ref = React.createRef();
  const [savedUnmount, setUnmount] = useState(null);
  const [isMounted, setMounted] = useState(false);
  const [unsubscribe, setUnsubscribe] = useState(null);

  useEffect(() => {
    if (!isMounted) {
      console.log('>>> Not mounted yet, let us call subscribe later');
      setMounted(true);
      return () => {
        console.log('>>>> Useless clean up 1');
      };
    }
    console.log('>>> Now mounted, ref is:', ref);
    if (!unsubscribe) {
      const onLoad = ({ components = {}, ...app }) => {
        const component = componentName === null ? app : components[componentName];
        if (!component) return;
        const { mount, unmount } = component;
        console.log('>>>> calling ', name, componentName || '', 'MOUNT on', ref.current);
        mount(ref.current, basePath, otherProps);
        setUnmount(unmount);
      };
      const unsub = subscribe(name, componentName, onLoad);
      setUnsubscribe(unsub);
      return () => {
        console.log('>>>> Useless clean up 2');
      };
    }
    if (!savedUnmount) {
      return () => {
        console.log('>>>> Useless clean up 3');
      };
    }
    return () => {
      console.log('>>>> Useful clean up');
      if (savedUnmount) {
        console.log('>>>> calling ', name, componentName || '', 'UNMOUNT on', ref.current);
        savedUnmount()
          .then(() => unsubscribe())
          .catch(() => unsubscribe());
      }
      unsubscribe();
    };
  }, [name, componentName, isMounted, savedUnmount, unsubscribe]);
  return <div ref={ref} />;
};

PatchworkComponent.propTypes = {
  name: PropTypes.string.isRequired,
  componentName: PropTypes.string,
  basePath: PropTypes.string,
};

export default PatchworkComponent;
